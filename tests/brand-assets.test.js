import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
const expectedLogo =
  "/images/brand/logo-location-benne-occitanie.png?v=20260719";
const expectedHeaderLogo =
  "/images/brand/logo-location-benne-occitanie-header.webp";
const suppliedLogoSha256 =
  "97fc825bc7575fab60ac886133eddb27dd253d84d63393220d83c789eca4552d";
const expectedHeaderLogoSha256 =
  "dd94a025e23c3eb2d37f176a156fac5a3b33e79b3a65a4baab307b328fe83d30";
const expectedIconHashes = new Map([
  ["/images/icons/favicon-brand-48.png?v=20260719", "f94271c035c9a02c020356c5c4b541df893f3f447378a43970f251e938623260"],
  ["/images/icons/apple-touch-icon-brand-180.png?v=20260719", "a3d091d37570ce3764b9c8b92cf4db5be82b35930b6b513edfc5a5067f5c7e3d"],
  ["/images/icons/icon-brand-192.png?v=20260719", "18412a05c1f4e2e994188a8cb3490ba22f288197f7f23b603422ac51b302a638"],
  ["/images/icons/icon-brand-512.png?v=20260719", "082b959cc1f4bbb28511ddc65e12b6c7334eaa4c2b6e0e07e5797d2557b2c805"],
]);
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
  const [pathname] = assetPath.split(/[?#]/, 1);
  return new URL(`public${pathname}`, projectRoot);
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

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
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

test("the site uses the exact supplied Location Benne Occitanie logo", async () => {
  assert.equal(company.logo, expectedLogo);
  assert.equal(company.logoHeader, expectedHeaderLogo);

  const logo = await readFile(publicFile(expectedLogo));
  assert.equal(sha256(logo), suppliedLogoSha256);
  assert.deepEqual(pngDimensions(logo), { width: 1254, height: 1254 });

  const headerLogo = await readFile(publicFile(expectedHeaderLogo));
  assert.deepEqual(webpDimensions(headerLogo), { width: 1203, height: 839 });
  assert.equal(sha256(headerLogo), expectedHeaderLogoSha256);

  const layoutSource = await readFile(
    new URL("src/components/SiteLayout.jsx", projectRoot),
    "utf8",
  );
  assert.doesNotMatch(layoutSource, /brand-lockup|brand-kicker|brand-name/);
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

test("favicons and install icons are regenerated from the supplied logo", async () => {
  const iconSizes = new Map([
    ["/images/icons/favicon-brand-48.png?v=20260719", 48],
    ["/images/icons/apple-touch-icon-brand-180.png?v=20260719", 180],
    ["/images/icons/icon-brand-192.png?v=20260719", 192],
    ["/images/icons/icon-brand-512.png?v=20260719", 512],
  ]);
  const [manifestSource, indexSource] = await Promise.all([
    readFile(new URL("public/site.webmanifest", projectRoot), "utf8"),
    readFile(new URL("index.html", projectRoot), "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);

  assert.equal(manifest.background_color, "#f7f3ec");
  assert.equal(manifest.theme_color, "#c58e3c");
  assert.match(indexSource, /<meta name="theme-color" content="#c58e3c"/);

  assert.deepEqual(
    manifest.icons.map(({ src }) => src),
    [...iconSizes.keys()],
  );
  assert.doesNotMatch(indexSource, /mark-location-benne-occitanie\.svg/);
  assert.match(indexSource, /favicon-brand-48\.png\?v=20260719/);

  for (const [assetPath, size] of iconSizes) {
    const icon = await readFile(publicFile(assetPath));
    const dimensions = pngDimensions(icon);
    assert.deepEqual(dimensions, { width: size, height: size });
    assert.equal(sha256(icon), expectedIconHashes.get(assetPath));
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
