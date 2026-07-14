import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  about,
  bennes,
  home,
  servicesPage,
} from "../src/data/content.js";
import { locationPages } from "../src/data/locationPages.js";
import {
  SITE_ORIGIN,
  getCanonicalUrl,
  getSeoGraph,
} from "../src/seo/seoConfig.js";

const projectRoot = new URL("../", import.meta.url);

const localExpectations = {
  montauban: {
    city: "Montauban",
    department: "Tarn-et-Garonne",
    departmentCode: "82",
    officialGuidanceUrl:
      "https://montauban.com/fileadmin/ARBORESCENCE/01_Ma_ville/05_Reglements/Voirie/Reglement_de_voirie_GMCA_10-07-2014.pdf",
  },
  toulouse: {
    city: "Toulouse",
    department: "Haute-Garonne",
    departmentCode: "31",
    officialGuidanceUrl:
      "https://metropole.toulouse.fr/demarches/chantier-demander-un-arrete-de-circulation-ou-stationnement",
  },
  albi: {
    city: "Albi",
    department: "Tarn",
    departmentCode: "81",
    officialGuidanceUrl:
      "https://albi.fr/mes-demarches/demander-une-autorisation-doccupation-du-domaine-public-pour-travaux",
  },
};

function collectCopy(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectCopy);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectCopy);
  }
  return [];
}

function normalizeCopy(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

test("local pages provide substantial and genuinely local decision support", () => {
  const editorialBlocks = [];

  for (const page of locationPages) {
    const expected = localExpectations[page.key];
    const copy = collectCopy(page).join(" ");

    assert.ok(expected, `missing expectations for ${page.key}`);
    assert.equal(page.city, expected.city);
    assert.equal(page.department, expected.department);
    assert.equal(page.departmentCode, expected.departmentCode);
    assert.match(page.title, new RegExp(`location de benne à ${page.city}`, "i"));
    assert.match(copy, new RegExp(expected.department, "i"));
    assert.match(copy, /3 à 15 m³/i);
    assert.ok(page.useCases.length >= 3);
    assert.ok(page.volumeGuidance.length >= 2);
    assert.ok(page.preparation.length >= 2);
    assert.equal(page.rentalSteps.length, 3);
    assert.ok(page.faqs.length >= 4);
    assert.ok(
      page.faqs.every(({ question }) =>
        new RegExp(page.city, "i").test(question),
      ),
      `${page.city} FAQ questions must stay locally focused`,
    );
    assert.match(page.officialGuidance.url, /^https:\/\//);
    assert.equal(page.officialGuidance.url, expected.officialGuidanceUrl);
    assert.match(page.officialGuidance.label, new RegExp(page.city, "i"));

    editorialBlocks.push(
      page.lead,
      page.introduction,
      ...page.useCases.map(({ description }) => description),
      ...page.volumeGuidance.map(({ description }) => description),
      ...page.preparation.map(({ description }) => description),
      ...page.rentalSteps.map(({ description }) => description),
      ...page.faqs.flatMap(({ question, answer }) => [question, answer]),
    );
  }

  assert.equal(
    new Set(editorialBlocks.map(normalizeCopy)).size,
    editorialBlocks.length,
    "local editorial blocks must not be duplicated",
  );
});

test("city metadata and structured data describe one real business and one local service", () => {
  for (const page of locationPages) {
    const canonical = getCanonicalUrl(page.path);
    const graph = getSeoGraph(page.path)["@graph"];
    const service = graph.find(({ "@type": type }) => type === "Service");
    const webPage = graph.find(
      ({ "@id": id }) => id === `${canonical}#webpage`,
    );
    const businesses = graph.filter(({ "@id": id }) =>
      id === `${SITE_ORIGIN}/#business`,
    );

    assert.match(
      page.seo.title,
      new RegExp(`location de benne à ${page.city} \\(${page.departmentCode}\\)`, "i"),
    );
    assert.match(page.seo.description, new RegExp(page.city, "i"));
    assert.match(page.seo.description, /3 à 15 m³|devis/i);
    assert.ok(page.seo.description.length >= 120);
    assert.ok(page.seo.description.length <= 170);

    assert.equal(businesses.length, 1);
    assert.equal(businesses[0].address.addressLocality, "Montauban");
    assert.deepEqual(businesses[0].areaServed, [
      "Montauban",
      "Toulouse",
      "Albi",
    ]);
    assert.equal(service["@id"], `${canonical}#service`);
    assert.equal(service.url, canonical);
    assert.equal(service.name, `Location de benne à ${page.city}`);
    assert.deepEqual(service.areaServed, [page.city]);
    assert.equal(service.description, page.seo.serviceDescription);
    assert.deepEqual(service.provider, { "@id": businesses[0]["@id"] });
    assert.deepEqual(webPage.mainEntity, { "@id": service["@id"] });
    assert.equal(webPage.dateModified, page.lastModified);
  }
});

test("public-facing copy avoids unsupported guarantees and generic sales hype", () => {
  const publicCopy = collectCopy({
    home,
    about,
    servicesPage,
    bennes,
    locationPages,
  }).join(" ");

  assert.doesNotMatch(
    publicCopy,
    /24\s*(?:h|heures?)\s*(?:à|a|-)\s*48\s*(?:h|heures?)|nous garantissons|satisfaction totale|acteur clé|réputation solide|expertise reconnue|toute la région Occitanie|tous vos déchets|tous vos besoins|se faufiler partout/i,
  );
});

test("page-level calls to action avoid fixed delivery promises", async () => {
  const sources = await Promise.all(
    [
      "src/pages/HomePage.jsx",
      "src/pages/ContactPage.jsx",
      "src/components/SectionCta.jsx",
    ].map((path) => readFile(new URL(path, projectRoot), "utf8")),
  );

  assert.doesNotMatch(
    sources.join(" "),
    /24\s*(?:h|heures?)\s*(?:à|a|-)\s*48\s*(?:h|heures?)|intervention locale rapide|urgence chantier|devis gratuit et rapide/i,
  );
});

test("local page template exposes official guidance and contextual city links", async () => {
  const source = await readFile(
    new URL("src/pages/LocationPage.jsx", projectRoot),
    "utf8",
  );

  assert.match(source, /page\.volumeGuidance\.map/);
  assert.match(source, /page\.rentalSteps\.map/);
  assert.match(source, /page\.officialGuidance\.url/);
  assert.match(source, /locationPages\.filter/);
  assert.match(source, /Autres secteurs desservis/);
});

test("local routes wire scroll reveal to the changing location key", async () => {
  const [locationPageSource, scrollRevealSource] = await Promise.all([
    readFile(new URL("src/pages/LocationPage.jsx", projectRoot), "utf8"),
    readFile(new URL("src/hooks/useScrollReveal.js", projectRoot), "utf8"),
  ]);

  assert.match(locationPageSource, /useScrollReveal\(locationKey\)/);
  assert.match(scrollRevealSource, /export default function useScrollReveal\(dependencyKey\)/);
  assert.match(scrollRevealSource, /\[dependencyKey\]/);
});
