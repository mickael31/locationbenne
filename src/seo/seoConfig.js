import {
  about,
  bennes,
  company,
  home,
  servicesPage,
} from "../data/content.js";
import { locationPages } from "../data/locationPages.js";

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
export const HOME_HERO_PRELOAD = home.hero.image.replace(/\.png$/i, ".avif");
export const HOME_HERO_PRELOAD_SRCSET = [
  `${home.hero.image.replace(/\.png$/i, "-480w.avif")} 480w`,
  `${home.hero.image.replace(/\.png$/i, "-768w.avif")} 768w`,
  `${HOME_HERO_PRELOAD} 1024w`,
].join(", ");
export const HOME_HERO_SIZES = "(max-width: 980px) 92vw, 44vw";

export const LEGACY_ROUTE_REDIRECTS = [
  { from: "/357-2", to: "/bennes/" },
];

const DEFAULT_AREA_SERVED = ["Montauban", "Toulouse", "Albi", "Occitanie"];

const locationRoutes = locationPages.map((page) => ({
  path: withTrailingSlash(page.path),
  label: `Location de benne à ${page.city}`,
  title: page.seo.title,
  description: page.seo.description,
  image: home.hero.image,
  imageAlt: `Location de benne à ${page.city}`,
  imageWidth: 1024,
  imageHeight: 683,
  lastModified: page.lastModified,
  schemaType: "WebPage",
  includePrimaryService: true,
  areaServed: [page.city, "Occitanie"],
  serviceName: `Location de benne à ${page.city}`,
}));

const PRIMARY_ROUTES = [
  {
    path: "/",
    label: "Accueil",
    title:
      "Location de benne à Montauban, Toulouse et Albi | Benne Occitanie",
    description:
      "Location de bennes de 3 à 15 m³ à Montauban, Toulouse, Albi et alentours. Conseil par téléphone, devis gratuit, livraison rapide et évacuation des déchets.",
    image: home.hero.image,
    imageAlt: "Camion de location de benne en Occitanie",
    imageWidth: 1024,
    imageHeight: 683,
    lastModified: "2026-07-12",
    schemaType: "WebPage",
    includePrimaryService: true,
  },
  {
    path: "/about/",
    label: "À propos",
    title: "À propos de Location Benne Occitanie | Entreprise locale",
    description:
      "Découvrez l'entreprise Location Benne Occitanie, son expertise terrain, son histoire et son engagement pour un service fiable et réactif.",
    image: about.images[0],
    imageAlt: "Illustration d'un professionnel contrôlant une benne",
    imageWidth: 1024,
    imageHeight: 1024,
    lastModified: "2026-07-12",
    schemaType: "AboutPage",
  },
  {
    path: "/services/",
    label: "Services",
    title:
      "Location de bennes, évacuation de déchets et devis | Services",
    description:
      "Consultez nos services de location de bennes en Occitanie : livraison, enlèvement, évacuation de déchets et accompagnement pour vos chantiers et débarras.",
    image: servicesPage.items[1].image,
    imageAlt: "Services de location de bennes en Occitanie",
    imageWidth: 1024,
    imageHeight: 683,
    lastModified: "2026-07-12",
    schemaType: "CollectionPage",
    includeServiceCatalog: true,
  },
  {
    path: "/bennes/",
    label: "Bennes",
    title:
      "Bennes 3, 7, 10 et 15 m³ à louer en Occitanie | Location Benne Occitanie",
    description:
      "Choisissez la benne adaptée à votre chantier ou débarras en Occitanie : 3 m³, 7 m³, 10 m³ ou 15 m³, avec livraison rapide et devis gratuit.",
    image: bennes.types[0].image,
    imageAlt: "Bennes 3 à 15 m³ disponibles en Occitanie",
    imageWidth: 1024,
    imageHeight: 872,
    lastModified: "2026-07-12",
    schemaType: "CollectionPage",
    includeBenneCatalog: true,
  },
  {
    path: "/contact/",
    label: "Contact",
    title: "Devis location de benne en Occitanie par téléphone | Contact",
    description:
      "Premier échange par téléphone pour comprendre vos déchets, votre volume et vos accès, puis vous conseiller la benne adaptée. Devis gratuit en Occitanie.",
    image: home.hero.image,
    imageAlt: "Demande de devis pour location de benne en Occitanie",
    imageWidth: 1024,
    imageHeight: 683,
    lastModified: "2026-07-12",
    schemaType: "ContactPage",
  },
  {
    path: "/partenaire-elagage/",
    label: "Élagage",
    title:
      "Élagage et abattage en Tarn-et-Garonne | Natur'Elag 82 et benne",
    description:
      "Découvrez l'activité partenaire d'élagage et d'abattage Natur'Elag 82, coordonnée avec la location de benne pour simplifier vos chantiers extérieurs.",
    image: "/images/2025/08/ChatGPT-Image-4-aout-2025-22_15_10-1024x683.png",
    imageAlt: "Camion transportant une benne en Occitanie",
    imageWidth: 1024,
    imageHeight: 683,
    lastModified: "2026-07-12",
    schemaType: "WebPage",
  },
  {
    path: "/politique-de-confidentialite/",
    label: "Politique de confidentialité",
    title: "Politique de confidentialité | Location Benne Occitanie",
    description:
      "Consultez la politique de confidentialité de Location Benne Occitanie et vos droits concernant le traitement de vos données personnelles.",
    image: home.hero.image,
    imageAlt: "Politique de confidentialité - Location Benne Occitanie",
    imageWidth: 1024,
    imageHeight: 683,
    lastModified: "2026-07-12",
    schemaType: "WebPage",
  },
  ...locationRoutes,
];

const NOT_FOUND_SEO = {
  title: "Page non trouvée | Location Benne Occitanie",
  description: "La page demandée n'existe pas ou n'est plus disponible.",
  image: DEFAULT_IMAGE,
  imageAlt: "Page non trouvée - Location Benne Occitanie",
  imageWidth: DEFAULT_IMAGE_WIDTH,
  imageHeight: DEFAULT_IMAGE_HEIGHT,
  imageType: DEFAULT_IMAGE_TYPE,
  robots: "noindex,follow",
  canonical: null,
  schemaType: "WebPage",
};

const ROUTE_MAP = new Map(
  PRIMARY_ROUTES.map((route) => [normalizePathname(route.path), route]),
);

export const INDEXABLE_ROUTES = PRIMARY_ROUTES.map((route) => ({
  path: withTrailingSlash(route.path),
  lastmod: route.lastModified,
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

export function getBreadcrumbItems(pathname) {
  const route = getKnownRoute(pathname);
  const crumbs = [{ name: "Accueil", path: "/" }];
  if (route && route.path !== "/") {
    crumbs.push({ name: route.label, path: withTrailingSlash(route.path) });
  }
  return crumbs;
}

function getContactPointSchema(areaServed = DEFAULT_AREA_SERVED) {
  return {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: company.email,
    telephone: company.phoneRaw,
    areaServed,
    availableLanguage: ["fr-FR"],
  };
}

function getBusinessSchema() {
  return {
    "@type": ["LocalBusiness", "Organization"],
    "@id": `${SITE_ORIGIN}/#business`,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    image: toAbsoluteUrl(home.hero.image),
    logo: toAbsoluteUrl("/images/icons/icon-512.png"),
    description:
      "Location de bennes et évacuation de déchets pour particuliers et professionnels à Montauban, Toulouse, Albi et dans les secteurs desservis en Occitanie.",
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
    areaServed: DEFAULT_AREA_SERVED,
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
      "@id": `${SITE_ORIGIN}/#business`,
    },
  };
}

function getPrimaryServiceSchema({
  canonical,
  areaServed = DEFAULT_AREA_SERVED,
  serviceName = "Location de bennes en Occitanie",
} = {}) {
  return {
    "@type": "Service",
    "@id": `${canonical}#service`,
    name: serviceName,
    serviceType: "Location de bennes",
    description:
      "Un premier échange par téléphone permet de qualifier le besoin et de recommander la benne adaptée au volume, aux déchets et aux accès.",
    provider: {
      "@id": `${SITE_ORIGIN}/#business`,
    },
    areaServed,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_ORIGIN}/contact/`,
      servicePhone: getContactPointSchema(areaServed),
      availableLanguage: ["fr-FR"],
    },
  };
}

function getServiceCatalogSchema(canonical) {
  return {
    "@type": "ItemList",
    "@id": `${canonical}#service-catalog`,
    name: "Services de Location Benne Occitanie",
    itemListElement: servicesPage.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: item.title,
        description: item.description,
        provider: {
          "@id": `${SITE_ORIGIN}/#business`,
        },
        areaServed: ["Montauban", "Toulouse", "Albi", "Occitanie"],
      },
    })),
  };
}

function getBenneCatalogSchema(canonical) {
  return {
    "@type": "ItemList",
    "@id": `${canonical}#benne-catalog`,
    name: "Volumes de bennes disponibles en Occitanie",
    itemListElement: bennes.types.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: item.title,
        description: item.description,
        provider: {
          "@id": `${SITE_ORIGIN}/#business`,
        },
        areaServed: ["Montauban", "Toulouse", "Albi", "Occitanie"],
      },
    })),
  };
}

function getBreadcrumbSchema(pathname, canonical) {
  const list = getBreadcrumbItems(pathname);
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
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
    "@id": `${canonical}#webpage`,
    name: seo.title,
    url: canonical,
    inLanguage: SITE_LANGUAGE,
    description: seo.description,
    isPartOf: {
      "@id": `${SITE_ORIGIN}/#website`,
    },
    about: {
      "@id": `${SITE_ORIGIN}/#business`,
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
  const route = getKnownRoute(pathname);
  const graph = [getBusinessSchema()];

  if (!route) {
    return {
      "@context": "https://schema.org",
      "@graph": graph,
    };
  }

  if (route?.path === "/") {
    graph.push(getWebSiteSchema());
  }

  graph.push(getWebPageSchema(pathname, seo, canonical));

  if (getBreadcrumbItems(pathname).length > 1) {
    graph.push(getBreadcrumbSchema(pathname, canonical));
  }

  if (seo.includePrimaryService) {
    graph.push(
      getPrimaryServiceSchema({
        canonical,
        areaServed: seo.areaServed,
        serviceName: seo.serviceName,
      }),
    );
  }
  if (seo.includeServiceCatalog) {
    graph.push(getServiceCatalogSchema(canonical));
  }
  if (seo.includeBenneCatalog) {
    graph.push(getBenneCatalogSchema(canonical));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
