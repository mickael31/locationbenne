import { company, home } from "../data/content";

export const SITE_ORIGIN = "https://location-benne-occitanie.fr";
export const SITE_NAME = company.name;
export const DEFAULT_IMAGE =
  "/images/2025/08/ChatGPT-Image-5-aout-2025-01_57_25-1024x683.png";

const ROUTE_LABELS = {
  "/": "Accueil",
  "/about": "A propos",
  "/services": "Services",
  "/357-2": "Bennes",
  "/contact": "Contact",
  "/blog": "Blog",
  "/politique-de-confidentialite": "Politique de confidentialite",
};

const PAGE_SEO = {
  "/": {
    title: "Location Benne Occitanie | Location de bennes en Occitanie",
    description:
      "Location de bennes rapide en Occitanie : Montauban, Toulouse, Albi et alentours. Devis gratuit, livraison rapide, evacuation de dechets.",
    image: "/images/2025/08/ChatGPT-Image-5-aout-2025-01_57_25-1024x683.png",
    keywords: [
      "location benne occitanie",
      "location benne montauban",
      "location benne toulouse",
      "location benne albi",
      "evacuation dechets",
    ],
    includeLocalBusiness: true,
    includeFaq: true,
  },
  "/about": {
    title: "A propos | Location Benne Occitanie",
    description:
      "Decouvrez l'expertise de Location Benne Occitanie, son histoire, son equipe et son engagement pour un service de qualite.",
    image: "/images/2025/08/ChatGPT-Image-4-aout-2025-21_26_42.png",
  },
  "/services": {
    title: "Services | Location Benne Occitanie",
    description:
      "Nos services : location de bennes, evacuation de dechets, devis gratuits et accompagnement personnalise en Occitanie.",
    image: "/images/2025/08/ChatGPT-Image-4-aout-2025-23_35_24-1024x683.png",
  },
  "/357-2": {
    title: "Bennes 3 a 15 m3 | Location Benne Occitanie",
    description:
      "Consultez notre gamme de bennes 3 m3, 7 m3, 10 m3 et 15 m3 pour tous vos chantiers et debarras en Occitanie.",
    image:
      "/images/2025/08/ChatGPT-Image-6-aout-2025-17_06_30-e1754492942287.png",
  },
  "/contact": {
    title: "Contact | Location Benne Occitanie",
    description:
      "Contactez Location Benne Occitanie pour votre demande de location de benne. Reponse rapide et devis gratuit.",
    image: "/images/2025/08/cropped-Logo_de_Benne_Occitanie-removebg-preview.png",
  },
  "/politique-de-confidentialite": {
    title: "Politique de confidentialite | Location Benne Occitanie",
    description:
      "Consultez notre politique de confidentialite et vos droits concernant le traitement des donnees personnelles.",
    image: "/images/2025/08/cropped-Logo_de_Benne_Occitanie-removebg-preview.png",
  },
  "/blog": {
    title: "Blog | Location Benne Occitanie",
    description:
      "Actualites et conseils de Location Benne Occitanie sur la location de bennes et la gestion des dechets.",
    image: "/images/2025/08/ChatGPT-Image-4-aout-2025-19_24_04.png",
    robots: "noindex,follow",
  },
  "/admin": {
    title: "Administration | Location Benne Occitanie",
    description: "Panneau d'administration - acces restreint.",
    image: "/images/2025/08/cropped-Logo_de_Benne_Occitanie-removebg-preview.png",
    robots: "noindex,nofollow",
  },
  "*": {
    title: "Page non trouvee | Location Benne Occitanie",
    description: "La page demandee n'existe pas.",
    image: "/images/2025/08/cropped-Logo_de_Benne_Occitanie-removebg-preview.png",
    robots: "noindex,nofollow",
  },
};

function withTrailingSlash(pathname) {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return `${SITE_ORIGIN}${DEFAULT_IMAGE}`;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${SITE_ORIGIN}${pathOrUrl}`;
}

export function getPageSeo(pathname) {
  return PAGE_SEO[pathname] ?? PAGE_SEO["*"];
}

export function getCanonicalUrl(pathname) {
  return `${SITE_ORIGIN}${withTrailingSlash(pathname)}`;
}

function getBreadcrumb(pathname) {
  const crumbs = [{ name: ROUTE_LABELS["/"], path: "/" }];
  if (pathname !== "/" && ROUTE_LABELS[pathname]) {
    crumbs.push({ name: ROUTE_LABELS[pathname], path: pathname });
  }
  return crumbs;
}

function getWebPageSchema(pathname, seo, canonical) {
  return {
    "@type": "WebPage",
    name: seo.title,
    url: canonical,
    inLanguage: "fr-FR",
    description: seo.description,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/`,
    },
  };
}

function getOrganizationSchema() {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: toAbsoluteUrl(company.logo),
    email: company.email,
    telephone: company.phoneRaw,
  };
}

function getLocalBusinessSchema() {
  return {
    "@type": "LocalBusiness",
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
      "Evacuation de dechets",
      "Devis gratuit",
    ],
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

export function getSeoGraph(pathname) {
  const seo = getPageSeo(pathname);
  const canonical = getCanonicalUrl(pathname);
  const graph = [
    getOrganizationSchema(),
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/`,
      inLanguage: "fr-FR",
    },
    getWebPageSchema(pathname, seo, canonical),
    getBreadcrumbSchema(pathname),
  ];

  if (seo.includeLocalBusiness) {
    graph.push(getLocalBusinessSchema());
  }
  if (seo.includeFaq) {
    graph.push(getFaqSchema());
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
