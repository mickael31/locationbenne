import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { businessDetails } from "../src/data/businessDetails.js";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const distDirectory = join(projectRoot, "dist");
const legalNoticeFile = join(distDirectory, "mentions-legales", "index.html");
const businessId = "https://location-benne-occitanie.fr/#business";

async function listHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) return listHtmlFiles(absolutePath);
      return absolutePath.endsWith(".html") ? [absolutePath] : [];
    }),
  );
  return files.flat();
}

function collectObjects(value, output = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectObjects(item, output));
    return output;
  }
  if (!value || typeof value !== "object") return output;
  output.push(value);
  Object.values(value).forEach((item) => collectObjects(item, output));
  return output;
}

test("the company is configured as a service-area business", () => {
  assert.equal(businessDetails.publicAddress, false);
  assert.equal(businessDetails.serviceMode, "service-area");
  assert.match(businessDetails.serviceModeLabel, /aucun accueil sur place/i);
  assert.deepEqual(businessDetails.serviceAreas, [
    "Montauban",
    "Toulouse",
    "Albi",
  ]);
});

test("the registered address is limited to the legal notice", async () => {
  const htmlFiles = await listHtmlFiles(distDirectory);
  assert.ok(htmlFiles.length > 0, "the build must emit HTML files");

  let serviceModeIsVisible = false;
  let legalNoticeIsLinked = false;
  let legalNoticeWasChecked = false;
  let businessNodesChecked = 0;

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const isLegalNotice = file === legalNoticeFile;

    if (isLegalNotice) {
      legalNoticeWasChecked = true;
      assert.match(html, /28\s+chemin\s+des\s+bernardets/i);
      assert.match(html, /aucun accueil du public/i);
      assert.match(html, /entrepreneur individuel \(EI\)/i);
    } else {
      assert.doesNotMatch(html, /28\s+chemin\s+des\s+bernardets/i, file);
      if (html.includes('href="/mentions-legales/"')) {
        legalNoticeIsLinked = true;
      }
    }

    if (html.includes(businessDetails.serviceModeLabel)) {
      serviceModeIsVisible = true;
    }

    const scripts = [
      ...html.matchAll(
        /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
      ),
    ];

    for (const [, source] of scripts) {
      const data = JSON.parse(source);
      for (const node of collectObjects(data)) {
        if (node["@id"] !== businessId) continue;
        businessNodesChecked += 1;
        assert.equal(
          Object.hasOwn(node, "address"),
          false,
          `${file} must not publish a customer-facing address in JSON-LD`,
        );
      }
    }
  }

  assert.equal(legalNoticeWasChecked, true);
  assert.equal(legalNoticeIsLinked, true);
  assert.equal(serviceModeIsVisible, true);
  assert.ok(businessNodesChecked > 0, "business JSON-LD must be present");
});
