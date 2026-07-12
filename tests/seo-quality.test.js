import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

import {
  DEFAULT_IMAGE,
  INDEXABLE_ROUTES,
  SITE_ORIGIN,
  getBreadcrumbItems,
  getCanonicalUrl,
  getPageSeo,
  getSeoGraph,
  toAbsoluteUrl,
} from "../src/seo/seoConfig.js";
import {
  about,
  bennes,
  company,
  home,
  navLinks,
  servicesPage,
} from "../src/data/content.js";
import {
  getLocationPage,
  locationPages,
} from "../src/data/locationPages.js";

const projectRoot = new URL("../", import.meta.url);

function hasType(node, type) {
  const types = Array.isArray(node?.["@type"])
    ? node["@type"]
    : [node?.["@type"]];
  return types.includes(type);
}

function optimizedImageUrl(source, format) {
  return source.replace(/\.png$/i, `.${format}`);
}

test("internal route targets use the same trailing-slash URLs as canonicals", async () => {
  for (const { path } of INDEXABLE_ROUTES) {
    const canonicalPath = new URL(getCanonicalUrl(path)).pathname;
    assert.equal(path, canonicalPath);
    assert.ok(path === "/" || path.endsWith("/"));
  }

  for (const { to } of navLinks) {
    assert.ok(to === "/" || to.endsWith("/"), `${to} must be canonical`);
  }

  for (const { path } of locationPages) {
    assert.ok(path.endsWith("/"), `${path} must be canonical`);
  }

  const componentFiles = [
    "src/App.jsx",
    "src/components/SectionCta.jsx",
    "src/components/SiteLayout.jsx",
    "src/pages/AboutPage.jsx",
    "src/pages/BennesPage.jsx",
    "src/pages/ContactPage.jsx",
    "src/pages/HomePage.jsx",
    "src/pages/LocationPage.jsx",
    "src/pages/NotFoundPage.jsx",
    "src/pages/PartnerPage.jsx",
    "src/pages/PrivacyPage.jsx",
    "src/pages/ServicesPage.jsx",
  ];

  for (const relativePath of componentFiles) {
    const source = await readFile(new URL(relativePath, projectRoot), "utf8");
    const targets = [...source.matchAll(/\bto="(\/[^"?#]*)"/g)].map(
      (match) => match[1],
    );

    for (const target of targets) {
      assert.ok(
        target === "/" || target.endsWith("/"),
        `${relativePath} links to non-canonical ${target}`,
      );
    }
  }

  const appSource = await readFile(new URL("src/App.jsx", projectRoot), "utf8");
  const routeTags = [...appSource.matchAll(/<Route\b([\s\S]*?)\/>/g)].map(
    (match) => match[1],
  );
  for (const routeTag of routeTags.filter((tag) => !/path="\*"/.test(tag))) {
    assert.match(routeTag, /\bcaseSensitive\b/);
  }
});

test("structured data models one stable business entity without obsolete FAQ markup", () => {
  const businessId = `${SITE_ORIGIN}/#business`;

  for (const { path } of INDEXABLE_ROUTES) {
    const graph = getSeoGraph(path)["@graph"];
    const businesses = graph.filter((node) => hasType(node, "LocalBusiness"));
    const websites = graph.filter((node) => hasType(node, "WebSite"));
    const breadcrumbs = graph.filter((node) =>
      hasType(node, "BreadcrumbList"),
    );

    assert.equal(businesses.length, 1, `${path} must expose one business`);
    assert.equal(businesses[0]["@id"], businessId);
    assert.ok(hasType(businesses[0], "Organization"));
    assert.equal(businesses[0].telephone, company.phoneRaw);
    assert.ok(businesses[0].address);
    assert.equal(
      graph.some((node) => hasType(node, "FAQPage")),
      false,
      `${path} must not expose removed FAQ rich-result markup`,
    );
    assert.equal(websites.length, path === "/" ? 1 : 0);
    assert.equal(breadcrumbs.length, path === "/" ? 0 : 1);

    const ids = graph.map((node) => node["@id"]);
    assert.ok(ids.every(Boolean), `${path} graph nodes must have stable IDs`);
    assert.equal(new Set(ids).size, ids.length, `${path} graph IDs must be unique`);

    for (const service of graph.filter((node) => hasType(node, "Service"))) {
      assert.equal(service.provider?.["@id"], businessId);
    }
  }

  const contactGraph = getSeoGraph("/contact/")["@graph"];
  assert.equal(
    contactGraph.filter((node) => hasType(node, "ContactPage")).length,
    1,
  );
});

test("SEO helpers handle absolute assets, aliases and unknown routes safely", () => {
  assert.equal(toAbsoluteUrl("https://cdn.example.com/image.png"), "https://cdn.example.com/image.png");
  assert.equal(toAbsoluteUrl("http://cdn.example.com/image.png"), "http://cdn.example.com/image.png");
  assert.equal(toAbsoluteUrl(""), `${SITE_ORIGIN}${DEFAULT_IMAGE}`);
  assert.equal(toAbsoluteUrl("/image.png"), `${SITE_ORIGIN}/image.png`);
  assert.equal(getCanonicalUrl("/about////"), `${SITE_ORIGIN}/about/`);
  assert.equal(getCanonicalUrl("/404.html"), `${SITE_ORIGIN}/404.html`);
  assert.equal(getPageSeo("/route-inconnue/").canonical, null);
  assert.deepEqual(getBreadcrumbItems("/route-inconnue/"), [
    { name: "Accueil", path: "/" },
  ]);
  assert.equal(getSeoGraph("/route-inconnue/")["@graph"].length, 1);
  assert.equal(getLocationPage("ville-inconnue"), null);
});

test("search metadata is concise, useful and free of obsolete directives", async () => {
  const [indexHtml, seoManager, postbuild] = await Promise.all([
    readFile(new URL("index.html", projectRoot), "utf8"),
    readFile(new URL("src/components/SeoManager.jsx", projectRoot), "utf8"),
    readFile(new URL("scripts/postbuild.mjs", projectRoot), "utf8"),
  ]);

  assert.match(indexHtml, /<html lang="fr-FR">/);
  assert.doesNotMatch(indexHtml, /<meta\s+name="keywords"/i);
  assert.doesNotMatch(indexHtml, /hreflang=/i);
  assert.doesNotMatch(indexHtml, /iframe-resizer/i);
  assert.doesNotMatch(indexHtml, /fonts\.(?:googleapis|gstatic)\.com/i);
  assert.match(indexHtml, /href="\/fonts\/oswald-latin\.woff2"/);
  assert.match(indexHtml, /imagesrcset=/i);
  assert.doesNotMatch(seoManager, /"name",\s*"keywords"/);
  assert.doesNotMatch(seoManager, /hreflang/);
  assert.doesNotMatch(postbuild, /<meta name="keywords"/i);
  assert.doesNotMatch(postbuild, /hreflang=/i);

  assert.match(bennes.title, /location de bennes/i);
  assert.match(servicesPage.title, /location de bennes/i);
  assert.match(company.name, /Location Benne Occitanie/);

  const contactSeo = getPageSeo("/contact/");
  assert.match(contactSeo.title, /devis.*location de benne/i);
});

test("sitemap routes carry truthful per-page last-modified dates", () => {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  for (const route of INDEXABLE_ROUTES) {
    assert.match(route.lastmod, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(route.lastmod <= today);
    assert.equal(getPageSeo(route.path).lastModified, route.lastmod);
  }
});

test("local pages add distinct, useful preparation guidance", () => {
  const guidance = locationPages.map((page) =>
    page.preparation.map(({ description }) => description).join(" "),
  );

  assert.equal(new Set(guidance).size, locationPages.length);
  for (const [index, page] of locationPages.entries()) {
    assert.match(guidance[index], new RegExp(page.city, "i"));
    assert.match(guidance[index], /accès|emplacement|voirie|stationnement/i);
  }
});

test("editorial images provide materially smaller AVIF and WebP alternatives", async () => {
  const editorialImages = [
    home.hero.image,
    home.intro.image,
    ...about.images,
    ...bennes.types.map(({ image }) => image),
    ...servicesPage.items.map(({ image }) => image),
  ];

  for (const source of new Set(editorialImages)) {
    const sourceFile = new URL(`public${source}`, projectRoot);
    const original = await stat(sourceFile);

    for (const format of ["avif", "webp"]) {
      const optimizedUrl = optimizedImageUrl(source, format);
      const optimized = await stat(new URL(`public${optimizedUrl}`, projectRoot));
      assert.ok(
        optimized.size < original.size,
        `${optimizedUrl} must be smaller than its PNG fallback`,
      );
    }
  }

  const heroAvif = await stat(
    new URL(`public${optimizedImageUrl(home.hero.image, "avif")}`, projectRoot),
  );
  assert.ok(heroAvif.size <= 250_000, "the LCP image must stay below 250 KB");
});

test("the responsive image component and above-the-fold content favor fast LCP", async () => {
  const [siteImage, homePage, layout, styles] = await Promise.all([
    readFile(new URL("src/components/SiteImage.jsx", projectRoot), "utf8"),
    readFile(new URL("src/pages/HomePage.jsx", projectRoot), "utf8"),
    readFile(new URL("src/components/SiteLayout.jsx", projectRoot), "utf8"),
    readFile(new URL("src/styles.css", projectRoot), "utf8"),
  ]);

  assert.match(siteImage, /<picture/);
  assert.match(siteImage, /type="image\/avif"/);
  assert.match(siteImage, /type="image\/webp"/);
  assert.match(siteImage, /const candidates = \[480, 768\]/);
  assert.doesNotMatch(homePage, /hero-copy fade-in-left/);
  assert.doesNotMatch(homePage, /hero-media fade-in-right/);
  assert.match(layout, /href="#main-content"/);
  assert.match(layout, /<main id="main-content"/);
  assert.doesNotMatch(layout, /loading="eager"\s+fetchPriority="high"/);
  assert.match(styles, /\.nav-wrap\s*>\s*nav\s*\{/);
  assert.match(styles, /@font-face[\s\S]*manrope-latin\.woff2/i);
  assert.match(styles, /@font-face[\s\S]*oswald-latin\.woff2/i);
});

test("Apache configuration removes duplicate URLs and caches static assets", async () => {
  const htaccess = await readFile(
    new URL("public/.htaccess", projectRoot),
    "utf8",
  );

  assert.match(htaccess, /THE_REQUEST[\s\S]*index\\\.html/i);
  assert.match(htaccess, /Cache-Control[\s\S]*immutable/i);
  assert.match(htaccess, /mod_deflate|mod_brotli/i);
});
