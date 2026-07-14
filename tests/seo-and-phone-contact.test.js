import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { home } from "../src/data/content.js";
import { locationPages } from "../src/data/locationPages.js";
import {
  INDEXABLE_ROUTES,
  getCanonicalUrl,
  getPageSeo,
  getSeoGraph,
} from "../src/seo/seoConfig.js";

test("each indexable page has focused and unique SEO metadata", () => {
  const pages = INDEXABLE_ROUTES.map(({ path }) => getPageSeo(path));
  const titles = pages.map(({ title }) => title);
  const descriptions = pages.map(({ description }) => description);

  assert.equal(new Set(titles).size, titles.length);
  assert.equal(new Set(descriptions).size, descriptions.length);

  for (const page of pages) {
    assert.ok(page.title.length >= 30 && page.title.length <= 75);
    assert.ok(page.description.length >= 110 && page.description.length <= 180);
  }
});

test("SEO content explains the phone-first qualification process", () => {
  const contactSeo = getPageSeo("/contact");
  const faq = home.faqs.find(({ question, answer }) =>
    question.toLowerCase().includes("choisir la bonne benne") &&
    answer.toLowerCase().includes("téléphone"),
  );

  assert.match(contactSeo.description, /téléphone/i);
  assert.match(contactSeo.description, /benne adaptée/i);
  assert.ok(faq);
  assert.match(faq.answer, /volume|déchets|accès/i);
});

test("structured data exposes the phone channel for the rental service", () => {
  const graph = getSeoGraph("/")["@graph"];
  const service = graph.find((item) => item["@type"] === "Service");

  assert.equal(service.availableChannel["@type"], "ServiceChannel");
  assert.equal(service.availableChannel.servicePhone["@type"], "ContactPoint");
  assert.match(service.description, /téléphone/i);
});

test("local landing pages are indexable with distinct city-focused metadata", () => {
  const expectedPaths = [
    "/location-benne-montauban/",
    "/location-benne-toulouse/",
    "/location-benne-albi/",
  ];

  assert.deepEqual(
    locationPages.map(({ path }) => path),
    expectedPaths,
  );
  assert.deepEqual(
    expectedPaths.map((path) => INDEXABLE_ROUTES.find((route) => route.path === path)?.path),
    expectedPaths,
  );

  for (const page of locationPages) {
    const seo = getPageSeo(page.path);
    const graph = getSeoGraph(page.path)["@graph"];
    const pageSchema = graph.find(
      (item) => item.url === getCanonicalUrl(page.path),
    );
    const service = graph.find((item) => item["@type"] === "Service");

    assert.match(seo.title, new RegExp(page.city, "i"));
    assert.match(seo.description, new RegExp(page.city, "i"));
    assert.equal(pageSchema["@type"], "WebPage");
    assert.ok(service.areaServed.includes(page.city));
    assert.match(service.description, /téléphone/i);
  }
});

test("local landing pages provide unique content and conversion paths", async () => {
  const [locationPage, app, homePage] = await Promise.all([
    readFile(new URL("../src/pages/LocationPage.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/pages/HomePage.jsx", import.meta.url), "utf8"),
  ]);

  assert.match(locationPage, /Appeler .*company\.phoneLocalDisplay/);
  assert.match(locationPage, /Demander un devis/);
  assert.match(locationPage, /Questions fréquentes/);
  assert.match(app, /location-benne-montauban/);
  assert.match(app, /location-benne-toulouse/);
  assert.match(app, /location-benne-albi/);
  assert.match(homePage, /locationPages\.map/);
});

test("the phone-first notice is visible on key conversion pages", async () => {
  const [notice, homePage, contactPage, sectionCta] = await Promise.all([
    readFile(new URL("../src/components/PhoneFirstNotice.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/pages/HomePage.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/pages/ContactPage.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/SectionCta.jsx", import.meta.url), "utf8"),
  ]);

  assert.match(notice, /avant de choisir votre benne, parlons de votre chantier/i);
  assert.match(notice, /que vous nous appeliez directement ou remplissiez le formulaire/i);
  assert.match(notice, /avant de confirmer la location/i);
  assert.match(notice, /benne adaptée/i);
  assert.match(notice, /trop petite, trop grande ou inadaptée/i);
  assert.match(homePage, /<PhoneFirstNotice/);
  assert.match(contactPage, /<PhoneFirstNotice/);
  assert.match(sectionCta, /<PhoneFirstNotice/);

  const heroAdvicePosition = homePage.indexOf('<section className="hero-advice">');
  const heroNoticePosition = homePage.indexOf("<PhoneFirstNotice compact />");
  const heroTitlePosition = homePage.indexOf("<h1>{home.hero.title}</h1>");
  const heroLeadPosition = homePage.indexOf('<p className="hero-lead">');
  const heroKpisPosition = homePage.indexOf('<div className="hero-kpis hero-facts"');
  assert.ok(heroAdvicePosition > 0);
  assert.ok(heroNoticePosition > 0);
  assert.ok(heroTitlePosition < heroNoticePosition);
  assert.ok(heroLeadPosition < heroKpisPosition);
  assert.ok(heroKpisPosition < heroAdvicePosition);
  assert.ok(heroAdvicePosition < heroNoticePosition);
  assert.equal((homePage.match(/<PhoneFirstNotice/g) || []).length, 1);
});

test("images use the browser-recognized priority attribute", async () => {
  const siteImage = await readFile(
    new URL("../src/components/SiteImage.jsx", import.meta.url),
    "utf8",
  );

  assert.match(siteImage, /fetchpriority=\{fetchPriority\}/);
  assert.doesNotMatch(siteImage, /fetchPriority=\{fetchPriority\}/);
});

test("unknown frontend routes return the generated 404 page with status 404", async () => {
  const [server, htaccess] = await Promise.all([
    readFile(new URL("../server/index.js", import.meta.url), "utf8"),
    readFile(new URL("../public/.htaccess", import.meta.url), "utf8"),
  ]);

  assert.match(server, /res\.status\(404\)\.sendFile/);
  assert.match(server, /path\.join\(DIST_DIR, "404\.html"\)/);
  assert.match(htaccess, /ErrorDocument 404 \/404\.html/);
  assert.doesNotMatch(htaccess, /RewriteRule \. \/index\.html/);
});
