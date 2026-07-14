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
export const DEFAULT_IMAGE = home.hero.image;
export const DEFAULT_IMAGE_ALT =
  "Location de benne en Occitanie - Location Benne Occitanie";
export const DEFAULT_IMAGE_WIDTH = 1536;
export const DEFAULT_IMAGE_HEIGHT = 1024;
export const DEFAULT_IMAGE_TYPE = "image/png";
export const DEFAULT_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
export const HOME_HERO_PRELOAD = home.hero.image.replace(/\.png$/i, ".avif");
export const HOME_HERO_PRELOAD_SRCSET = [
  `${home.hero.image.replace(/\.png$/i, "-480w.avif")} 480w`,
  `${home.hero.image.replace(/\.png$/i, "-768w.avif")} 768w`,
  `${HOME_HERO_PRELOAD} 1536w`,
].join(", ");
export const HOME_HERO_SIZES = "(max-width: 980px) 92vw, 44vw";

export const LEGACY_ROUTE_REDIRECTS = [
  { from: "/357-2", to: "/bennes/" },
];

const DEFAULT_AREA_SERVED = ["Montauban", "Toulouse", "Albi"];

const locationRoutes = locationPages.map((page) => ({
  path: withTrailingSlash(page.path),
  label: `Location de benne à ${page.city}`,
  title: page.seo.title,
  description: page.seo.description,
  image: page.seo.image || home.hero.image,
  imageAlt: page.seo.imageAlt || `Location de benne à ${page.city}`,
  imageWidth: 1536,
  imageHeight: 1024,
  lastModified: page.lastModified,
  schemaType: "WebPage",
  includePrimaryService: true,
  areaServed: [page.city],
  serviceName: `Location de benne à ${page.city}`,
  serviceDescription: page.seo.serviceDescription,
}));

const PRIMARY_ROUTES = [
  {
    path: "/",
    label: "Accueil",
    title:
      "Location de benne à Montauban, Toulouse et Albi | Benne Occitanie",
    description:
      "Location de bennes de 3 à 15 m³ à Montauban, Toulouse et Albi. Conseil sur les déchets, le volume et l'accès, puis devis gratuit selon votre adresse.",
    image: home.hero.image,
    imageAlt: "Camion de location de benne en Occitanie",
    imageWidth: 1536,
    imageHeight: 1024,
    lastModified: "2026-07-14",
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
    imageAlt: "Professionnel contrôlant une benne avant livraison",
    imageWidth: 1536,
    imageHeight: 1024,
    lastModified: "2026-07-14",
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
    imageWidth: 1536,
    imageHeight: 1024,
    lastModified: "2026-07-14",
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
    imageWidth: 1536,
    imageHeight: 1024,
    lastModified: "2026-07-14",
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
    imageWidth: 1536,
    imageHeight: 1024,
    lastModified: "2026-07-14",
    schemaType: "ContactPage",
  },
  {
    path: "/partenaire-elagage/",
    label: "Élagage",
    title:
      "Élagage et abattage en Tarn-et-Garonne | Natur'Elag 82 et benne",
    description:
      "Découvrez l'activité partenaire d'élagage et d'abattage Natur'Elag 82, coordonnée avec la location de benne pour simplifier vos chantiers extérieurs.",
    image: "/images/pro/livraison-benne-chantier.png",
    imageAlt: "Livraison d'une benne sur un chantier en Occitanie",
    imageWidth: 1536,
    imageHeight: 1024,
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
    imageWidth: 1536,
    imageHeight: 1024,
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
    logo: toAbsoluteUrl(company.logo),
    description:
      "Location de bennes de 3 à 15 m³ pour particuliers et professionnels à Montauban, Toulouse et Albi, après vérification de l'adresse et des conditions d'accès.",
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
  serviceDescription =
    "Un premier échange par téléphone permet de qualifier le besoin et de recommander la benne adaptée au volume, aux déchets et aux accès.",
} = {}) {
  return {
    "@type": "Service",
    "@id": `${canonical}#service`,
    name: serviceName,
    serviceType: "Location de bennes",
    description: serviceDescription,
    url: canonical,
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
        areaServed: DEFAULT_AREA_SERVED,
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
        areaServed: DEFAULT_AREA_SERVED,
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
    dateModified: seo.lastModified,
    isPartOf: {
      "@id": `${SITE_ORIGIN}/#website`,
    },
    about: {
      "@id": `${SITE_ORIGIN}/#business`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      "@id": `${canonical}#primaryimage`,
      url: toAbsoluteUrl(seo.image),
      contentUrl: toAbsoluteUrl(seo.image),
      caption: seo.imageAlt,
      width: seo.imageWidth,
      height: seo.imageHeight,
    },
    ...(seo.includePrimaryService
      ? { mainEntity: { "@id": `${canonical}#service` } }
      : {}),
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
        serviceDescription: seo.serviceDescription,
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
