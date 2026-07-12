import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { home } from "../src/data/content.js";
import {
  INDEXABLE_ROUTES,
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
