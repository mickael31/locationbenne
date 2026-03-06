import {
  about,
  bennes,
  company,
  home,
  servicesPage,
} from "../data/content.js";

export const SITE_ORIGIN = "https://location-benne-occitanie.fr";
export const SITE_NAME = company.name;
export const SITE_LANGUAGE = "fr-FR";
export const SITE_LOCALE = "fr_FR";
export const DEFAULT_IMAGE =
  "/images/2025/08/ChatGPT-Image-5-aout-2025-01_57_25-1024x683.png";
export const DEFAULT_IMAGE_ALT =
  "Location de benne en Occitanie - Location Benne Occitanie";
export const DEFAULT_IMAGE_WIDTH = 1024;
export const DEFAULT_IMAGE_HEIGHT = 683;
export const DEFAULT_IMAGE_TYPE = "image/png";
export const DEFAULT_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

export const LEGACY_ROUTE_REDIRECTS = [
  { from: "/357-2", to: "/bennes" },
];

const PRIMARY_ROUTES = [
  {
    path: "/",
    label: "Accueil",
    title:
      "Location de benne en Occitanie, Montauban, Toulouse, Albi | Location Benne Occitanie",
    description:
      "Location de bennes rapide en Occitanie pour particuliers et professionnels : Montauban, Toulouse, Albi et alentours. Devis gratuit, livraison rapide, évacuation de déchets.",
    image: home.hero.image,
    imageAlt: "Camion de location de benne en Occitanie",
    imageWidth: 1024,
    imageHeight: 683,
    keywords: [
      "location benne occitanie",
      "location benne montauban",
      "location benne toulouse",
      "location benne albi",
      "location de benne",
      "evacuation dechets chantier",
    ],
    schemaType: "WebPage",
    changefreq: "weekly",
    priority: "1.0",
    includeLocalBusiness: true,
    includeFaq: true,
    includePrimaryService: true,
  },
  {
    path: "/about",
    label: "À propos",
    title: "À propos de Location Benne Occitanie | Entreprise locale",
    description:
      "Découvrez l'entreprise Location Benne Occitanie, son expertise terrain, son histoire et son engagement pour un service fiable et réactif.",
    image: about.images[0],
    imageAlt: "Équipe Location Benne Occitanie sur chantier",
    imageWidth: 1024,
    imageHeight: 1024,
    keywords: [
      "entreprise location benne occitanie",
      "location benne montauban entreprise",
      "expert gestion dechets occitanie",
    ],
    schemaType: "AboutPage",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/services",
    label: "Services",
    title:
      "Location de bennes, évacuation de déchets et devis | Services",
    description:
      "Consultez nos services de location de bennes en Occitanie : livraison, enlèvement, évacuation de déchets et accompagnement pour vos chantiers et débarras.",
    image: servicesPage.items[1].image,
    imageAlt: "Services de location de bennes en Occitanie",
    imageWidth: 1024,
    imageHeight: 683,
    keywords: [
      "services location benne",
      "evacuation dechets occitanie",
      "devis benne montauban",
      "location benne chantier",
    ],
    schemaType: "CollectionPage",
    changefreq: "monthly",
    priority: "0.9",
    includeServiceCatalog: true,
    includeLocalBusiness: true,
  },
  {
    path: "/bennes",
    label: "Bennes",
    title:
      "Bennes 3, 7, 10 et 15 m³ à louer en Occitanie | Location Benne Occitanie",
    description:
      "Choisissez la benne adaptée à votre chantier ou débarras en Occitanie : 3 m³, 7 m³, 10 m³ ou 15 m³, avec livraison rapide et devis gratuit.",
    image: bennes.types[0].image,
    imageAlt: "Bennes 3 à 15 m³ disponibles en Occitanie",
    imageWidth: 1024,
    imageHeight: 872,
    keywords: [
      "benne 3 m3",
      "benne 7 m3",
      "benne 10 m3",
      "benne 15 m3",
      "location benne gravats occitanie",
    ],
    schemaType: "CollectionPage",
    changefreq: "weekly",
    priority: "0.9",
    includeBenneCatalog: true,
    includeLocalBusiness: true,
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Devis location de benne en Occitanie | Contact",
    description:
      "Contactez Location Benne Occitanie pour demander un devis gratuit, une livraison rapide et un accompagnement sur votre location de benne.",
    image: home.hero.image,
    imageAlt: "Demande de devis pour location de benne en Occitanie",
    imageWidth: 1024,
    imageHeight: 683,
    keywords: [
      "contact location benne occitanie",
      "devis benne montauban",
      "devis benne toulouse",
    ],
    schemaType: "ContactPage",
    changefreq: "monthly",
    priority: "0.8",
    includeContactPage: true,
    includeLocalBusiness: true,
  },
  {
    path: "/partenaire-elagage",
    label: "Élagage",
    title:
      "Élagage et abattage en Tarn-et-Garonne | Natur'Elag 82 et benne",
    description:
      "Découvrez l'activité partenaire d'élagage et d'abattage Natur'Elag 82, coordonnée avec la location de benne pour simplifier vos chantiers extérieurs.",
    image: "/images/2025/08/ChatGPT-Image-4-aout-2025-22_15_10-1024x683.png",
    imageAlt: "Travaux d'élagage avec partenaire local en Tarn-et-Garonne",
    imageWidth: 1024,
    imageHeight: 683,
    keywords: [
      "elagage tarn et garonne",
      "abattage arbres 82",
      "partenaire elagage montauban",
      "natur elag 82",
    ],
    schemaType: "WebPage",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/politique-de-confidentialite",
    label: "Politique de confidentialité",
    title: "Politique de confidentialité | Location Benne Occitanie",
    description:
      "Consultez la politique de confidentialité de Location Benne Occitanie et vos droits concernant le traitement de vos données personnelles.",
    image: home.hero.image,
    imageAlt: "Politique de confidentialité - Location Benne Occitanie",
    imageWidth: 1024,
    imageHeight: 683,
    schemaType: "WebPage",
    changefreq: "yearly",
    priority: "0.3",
  },
];

const NOT_FOUND_SEO = {
  title: "Page non trouvée | Location Benne Occitanie",
  description: "La page demandée n'existe pas ou n'est plus disponible.",
  image: DEFAULT_IMAGE,
  imageAlt: "Page non trouvée - Location Benne Occitanie",
  imageWidth: DEFAULT_IMAGE_WIDTH,
  imageHeight: DEFAULT_IMAGE_HEIGHT,
  imageType: DEFAULT_IMAGE_TYPE,
  robots: "noindex,nofollow",
  schemaType: "WebPage",
};

const ROUTE_MAP = new Map(PRIMARY_ROUTES.map((route) => [route.path, route]));

export const INDEXABLE_ROUTES = PRIMARY_ROUTES.map((route) => ({
  path: route.path,
  changefreq: route.changefreq,
  priority: route.priority,
}));

function normalizePathname(pathname) {
  const value = String(pathname || "/").trim();
  if (!value || value === "/") return "/";
  return value.replace(/\/+$/, "");
}

function withTrailingSlash(pathname) {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function getKnownRoute(pathname) {
  return ROUTE_MAP.get(normalizePathname(pathname)) || null;
}

function getBreadcrumb(pathname) {
  const route = getKnownRoute(pathname);
  const crumbs = [{ name: "Accueil", path: "/" }];
  if (route && route.path !== "/") {
    crumbs.push({ name: route.label, path: route.path });
  }
  return crumbs;
}

function getContactPointSchema() {
  return {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: company.email,
    telephone: company.phoneRaw,
    areaServed: ["Montauban", "Toulouse", "Albi", "Occitanie"],
    availableLanguage: ["fr-FR"],
  };
}

function getOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: toAbsoluteUrl(company.logo),
    email: company.email,
    telephone: company.phoneRaw,
    address: {
      "@type": "PostalAddress",
      streetAddress: "28 chemin des bernardets",
      postalCode: "82000",
      addressLocality: "Montauban",
      addressRegion: "Occitanie",
      addressCountry: "FR",
    },
    contactPoint: [getContactPointSchema()],
  };
}

function getWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    inLanguage: SITE_LANGUAGE,
    publisher: {
      "@id": `${SITE_ORIGIN}/#organization`,
    },
  };
}

function getLocalBusinessSchema() {
  return {
    "@type": "LocalBusiness",
    "@id": `${SITE_ORIGIN}/#localbusiness`,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    image: toAbsoluteUrl(home.hero.image),
    logo: toAbsoluteUrl(company.logo),
    email: company.email,
    telephone: company.phoneRaw,
    address: {
      "@type": "PostalAddress",
      streetAddress: "28 chemin des bernardets",
      postalCode: "82000",
      addressLocality: "Montauban",
      addressRegion: "Occitanie",
      addressCountry: "FR",
    },
    areaServed: ["Montauban", "Toulouse", "Albi", "Occitanie"],
    serviceType: [
      "Location de bennes",
      "Évacuation de déchets",
      "Devis gratuit",
    ],
    contactPoint: [getContactPointSchema()],
  };
}

function getPrimaryServiceSchema() {
  return {
    "@type": "Service",
    name: "Location de bennes en Occitanie",
    serviceType: "Location de bennes",
    provider: {
      "@id": `${SITE_ORIGIN}/#localbusiness`,
    },
    areaServed: ["Montauban", "Toulouse", "Albi", "Occitanie"],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_ORIGIN}/contact/`,
      availableLanguage: ["fr-FR"],
    },
  };
}

function getFaqSchema() {
  return {
    "@type": "FAQPage",
    mainEntity: home.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function getServiceCatalogSchema() {
  return {
    "@type": "ItemList",
    name: "Services de Location Benne Occitanie",
    itemListElement: servicesPage.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: item.title,
        description: item.description,
        provider: {
          "@id": `${SITE_ORIGIN}/#localbusiness`,
        },
        areaServed: ["Montauban", "Toulouse", "Albi", "Occitanie"],
      },
    })),
  };
}

function getBenneCatalogSchema() {
  return {
    "@type": "ItemList",
    name: "Volumes de bennes disponibles en Occitanie",
    itemListElement: bennes.types.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: item.title,
        description: item.description,
        provider: {
          "@id": `${SITE_ORIGIN}/#localbusiness`,
        },
        areaServed: ["Montauban", "Toulouse", "Albi", "Occitanie"],
      },
    })),
  };
}

function getContactPageSchema(canonical) {
  return {
    "@type": "ContactPage",
    name: "Contact Location Benne Occitanie",
    url: canonical,
    mainEntity: {
      "@id": `${SITE_ORIGIN}/#organization`,
    },
  };
}

function getBreadcrumbSchema(pathname) {
  const list = getBreadcrumb(pathname);
  return {
    "@type": "BreadcrumbList",
    itemListElement: list.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}

function getWebPageSchema(pathname, seo, canonical) {
  return {
    "@type": seo.schemaType || "WebPage",
    name: seo.title,
    url: canonical,
    inLanguage: SITE_LANGUAGE,
    description: seo.description,
    isPartOf: {
      "@id": `${SITE_ORIGIN}/#website`,
    },
    about: {
      "@id": `${SITE_ORIGIN}/#organization`,
    },
  };
}

export function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return `${SITE_ORIGIN}${DEFAULT_IMAGE}`;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${SITE_ORIGIN}${pathOrUrl}`;
}

export function getPageSeo(pathname) {
  const route = getKnownRoute(pathname);
  if (route) {
    return {
      image: DEFAULT_IMAGE,
      imageAlt: DEFAULT_IMAGE_ALT,
      imageWidth: DEFAULT_IMAGE_WIDTH,
      imageHeight: DEFAULT_IMAGE_HEIGHT,
      imageType: DEFAULT_IMAGE_TYPE,
      robots: DEFAULT_ROBOTS,
      ...route,
    };
  }

  return {
    ...NOT_FOUND_SEO,
  };
}

export function getCanonicalUrl(pathname) {
  const route = getKnownRoute(pathname);
  const normalized = route?.path || normalizePathname(pathname);

  if (normalized === "/404.html") {
    return `${SITE_ORIGIN}/404.html`;
  }

  return `${SITE_ORIGIN}${withTrailingSlash(normalized)}`;
}

export function getSeoGraph(pathname) {
  const seo = getPageSeo(pathname);
  const canonical = getCanonicalUrl(pathname);
  const graph = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getWebPageSchema(pathname, seo, canonical),
    getBreadcrumbSchema(pathname),
  ];

  if (seo.includeLocalBusiness) {
    graph.push(getLocalBusinessSchema());
  }
  if (seo.includePrimaryService) {
    graph.push(getPrimaryServiceSchema());
  }
  if (seo.includeFaq) {
    graph.push(getFaqSchema());
  }
  if (seo.includeServiceCatalog) {
    graph.push(getServiceCatalogSchema());
  }
  if (seo.includeBenneCatalog) {
    graph.push(getBenneCatalogSchema());
  }
  if (seo.includeContactPage) {
    graph.push(getContactPageSchema(canonical));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
