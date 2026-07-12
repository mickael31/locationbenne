import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  INDEXABLE_ROUTES,
  getCanonicalUrl,
  getPageSeo,
} from "../src/seo/seoConfig.js";
import { locationPages } from "../src/data/locationPages.js";

const projectRoot = new URL("../", import.meta.url);

function routeFile(pathname) {
  return new URL(
    pathname === "/" ? "dist/index.html" : `dist${pathname}/index.html`,
    projectRoot,
  );
}

test("the production build emits crawlable HTML for every indexable route", async () => {
  const isWindows = process.platform === "win32";
  const command = isWindows ? process.env.ComSpec : "npm";
  const args = isWindows ? ["/d", "/s", "/c", "npm run build"] : ["run", "build"];
  const result = spawnSync(command, args, {
    cwd: fileURLToPath(projectRoot),
    encoding: "utf8",
  });

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

  for (const { path } of INDEXABLE_ROUTES) {
    const file = routeFile(path);
    await stat(file);
    const html = await readFile(file, "utf8");
    const seo = getPageSeo(path);
    const h1Count = (html.match(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/g) || []).length;

    assert.equal(h1Count, 1, `${path} must contain exactly one prerendered h1`);
    assert.match(html, /<main\b/);
    assert.ok(html.includes(seo.title));
    assert.ok(html.includes(getCanonicalUrl(path)));
    assert.doesNotMatch(html, /<div id="root"><\/div>/);
    assert.doesNotMatch(html, /name="geo\.(?:region|placename)"/);

    for (const locationPage of locationPages) {
      assert.ok(
        html.includes(`href="${locationPage.path}"`),
        `${path} must link to ${locationPage.path}`,
      );
    }

    const jsonLd = html.match(
      /<script id="seo-json-ld" type="application\/ld\+json">([\s\S]*?)<\/script>/,
    );
    assert.ok(jsonLd, `${path} must expose JSON-LD`);
    assert.doesNotThrow(() => JSON.parse(jsonLd[1]));
  }
});

test("generated discovery files expose all canonical routes", async () => {
  const sitemap = await readFile(new URL("dist/sitemap.xml", projectRoot), "utf8");
  const robots = await readFile(new URL("dist/robots.txt", projectRoot), "utf8");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const expected = INDEXABLE_ROUTES.map(({ path }) => getCanonicalUrl(path));

  assert.deepEqual(urls, expected);
  assert.equal(new Set(urls).size, urls.length);
  assert.match(robots, /Disallow: \/api\//);
  assert.match(robots, /Sitemap: https:\/\/location-benne-occitanie\.fr\/sitemap\.xml/);
});
