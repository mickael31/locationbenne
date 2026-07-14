import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  about,
  bennes,
  company,
  home,
  servicesPage,
} from "../src/data/content.js";

const projectRoot = new URL("../", import.meta.url);
const expectedLogo = "/images/brand/logo-location-benne-occitanie.svg";
const expectedMark = "/images/brand/mark-location-benne-occitanie.svg";
const expectedEditorialImages = [
  "/images/pro/hero-location-benne-occitanie.png",
  "/images/pro/equipe-controle-benne.png",
  "/images/pro/livraison-benne-chantier.png",
  "/images/pro/evacuation-dechets-tries.png",
  "/images/pro/conseil-devis-telephone.png",
  "/images/pro/benne-3m3.png",
  "/images/pro/benne-7m3.png",
  "/images/pro/benne-10m3.png",
  "/images/pro/benne-15m3.png",
];

const editorialImages = [
  home.hero.image,
  home.intro.image,
  ...about.images,
  ...servicesPage.items.map(({ image }) => image),
  ...bennes.types.map(({ image }) => image),
];

function publicFile(assetPath) {
  return new URL(`public${assetPath}`, projectRoot);
}

function responsiveVariant(assetPath, suffix, format) {
  return assetPath.replace(/\.png$/i, `${suffix}.${format}`);
}

function pngDimensions(buffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  assert.ok(buffer.subarray(0, signature.length).equals(signature));
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function avifDimensions(buffer) {
  assert.equal(buffer.subarray(4, 12).toString("ascii"), "ftypavif");
  const propertyIndex = buffer.indexOf(Buffer.from("ispe"));
  assert.ok(propertyIndex > 0, "AVIF spatial dimensions must be present");
  return {
    width: buffer.readUInt32BE(propertyIndex + 8),
    height: buffer.readUInt32BE(propertyIndex + 12),
  };
}

function webpDimensions(buffer) {
  assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP");
  const frameMarker = buffer.indexOf(Buffer.from([0x9d, 0x01, 0x2a]));
  assert.ok(frameMarker > 0, "WebP frame dimensions must be present");
  return {
    width: buffer.readUInt16LE(frameMarker + 3) & 0x3fff,
    height: buffer.readUInt16LE(frameMarker + 5) & 0x3fff,
  };
}

test("the brand uses a crisp vector logo and compact mark", async () => {
  assert.equal(company.logo, expectedLogo);
  assert.equal(company.logoHeader, expectedMark);

  for (const [assetPath, viewBox] of [
    [expectedLogo, "0 0 640 144"],
    [expectedMark, "0 0 128 128"],
  ]) {
    const source = await readFile(publicFile(assetPath), "utf8");
    assert.match(source, /<svg\b/);
    assert.match(source, /<title>/);
    assert.match(source, new RegExp(`viewBox="${viewBox}"`));
    assert.match(source, /#17212b/i);
    assert.match(source, /#f2aa00/i);
    assert.match(source, /#2f7d4a/i);
  }
});

test("all editorial content uses the coherent professional image set", async () => {
  assert.deepEqual(
    [...new Set(editorialImages)].sort(),
    [...expectedEditorialImages].sort(),
  );

  for (const assetPath of editorialImages) {
    assert.match(assetPath, /^\/images\/pro\/[a-z0-9-]+\.png$/);
    assert.doesNotMatch(assetPath, /chatgpt|[a-f0-9]{8}-[a-f0-9-]{27,}/i);
    const source = await readFile(publicFile(assetPath));
    assert.deepEqual(pngDimensions(source), { width: 1536, height: 1024 });
  }
});

test("favicons and install icons use the compact brand mark", async () => {
  const iconSizes = new Map([
    ["/images/icons/favicon-brand-48.png", 48],
    ["/images/icons/apple-touch-icon-brand-180.png", 180],
    ["/images/icons/icon-brand-192.png", 192],
    ["/images/icons/icon-brand-512.png", 512],
  ]);
  const [manifestSource, indexSource] = await Promise.all([
    readFile(new URL("public/site.webmanifest", projectRoot), "utf8"),
    readFile(new URL("index.html", projectRoot), "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);

  assert.deepEqual(
    manifest.icons.map(({ src }) => src),
    [...iconSizes.keys()],
  );
  assert.match(indexSource, /mark-location-benne-occitanie\.svg/);

  for (const [assetPath, size] of iconSizes) {
    const dimensions = pngDimensions(await readFile(publicFile(assetPath)));
    assert.deepEqual(dimensions, { width: size, height: size });
  }
});

test("professional images ship with responsive AVIF and WebP variants", async () => {
  for (const assetPath of new Set(editorialImages)) {
    const fallbackSize = (await readFile(publicFile(assetPath))).length;

    for (const format of ["avif", "webp"]) {
      for (const suffix of ["", "-480w", "-768w"]) {
        const variant = await readFile(
          publicFile(responsiveVariant(assetPath, suffix, format)),
        );
        const width = suffix ? Number.parseInt(suffix.slice(1), 10) : 1536;
        const expected = { width, height: Math.round((width * 2) / 3) };
        const dimensions = format === "avif"
          ? avifDimensions(variant)
          : webpDimensions(variant);

        assert.deepEqual(dimensions, expected);
        assert.ok(variant.length < fallbackSize);
      }
    }
  }
});

test("source and SEO configuration no longer reference the legacy image library", async () => {
  const sources = await Promise.all([
    readFile(new URL("src/data/content.js", projectRoot), "utf8"),
    readFile(new URL("src/seo/seoConfig.js", projectRoot), "utf8"),
    readFile(new URL("index.html", projectRoot), "utf8"),
  ]);

  for (const source of sources) {
    assert.doesNotMatch(source, /\/images\/2025\/08\//);
    assert.doesNotMatch(source, /ChatGPT-Image/i);
  }
});
