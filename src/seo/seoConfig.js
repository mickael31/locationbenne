import { company, home } from "../data/content";

export const SITE_ORIGIN = "https://location-benne-occitanie.fr";
export const SITE_NAME = company.name;
export const DEFAULT_IMAGE =
  "/images/2025/08/ChatGPT-Image-5-aout-2025-01_57_25-1024x683.png";

const ROUTE_LABELS = {
  "/": "Accueil",
  "/about": "À propos",
  "/services": "Services",
  "/357-2": "Bennes",
  "/contact": "Contact",
  "/politique-de-confidentialite": "Politique de confidentialité",
};

const PAGE_SEO = {
  "/": {
    title: "Location Benne Occitanie | Location de bennes en Occitanie",
    description:
      "Location de bennes rapide en Occitanie : Montauban, Toulouse, Albi et alentours. Devis gratuit, livraison rapide, évacuation de déchets.",
    image: "/images/2025/08/ChatGPT-Image-5-aout-2025-01_57_25-1024x683.png",
    keywords: [
      "location benne occitanie",
      "location benne montauban",
      "location benne toulouse",
      "location benne albi",
      "évacuation déchets",
    ],
    includeLocalBusiness: true,
    includeFaq: true,
  },
  "/about": {
    title: "À propos | Location Benne Occitanie",
    description:
      "Découvrez l'expertise de Location Benne Occitanie, son histoire, son équipe et son engagement pour un service de qualité.",
    image: "/images/2025/08/ChatGPT-Image-4-aout-2025-21_26_42.png",
  },
  "/services": {
    title: "Services | Location Benne Occitanie",
    description:
      "Nos services : location de bennes, évacuation de déchets, devis gratuits et accompagnement personnalisé en Occitanie.",
    image: "/images/2025/08/ChatGPT-Image-4-aout-2025-23_35_24-1024x683.png",
  },
  "/357-2": {
    title: "Bennes 3 à 15 m³ | Location Benne Occitanie",
    description:
      "Consultez notre gamme de bennes 3 m³, 7 m³, 10 m³ et 15 m³ pour tous vos chantiers et débarras en Occitanie.",
    image:
      "/images/2025/08/ChatGPT-Image-6-aout-2025-17_06_30-e1754492942287.png",
  },
  "/contact": {
    title: "Contact | Location Benne Occitanie",
    description:
      "Contactez Location Benne Occitanie pour votre demande de location de benne. Réponse rapide et devis gratuit.",
    image: "/images/2025/08/cropped-Logo_de_Benne_Occitanie-removebg-preview.png",
  },
  "/politique-de-confidentialite": {
    title: "Politique de confidentialité | Location Benne Occitanie",
    description:
      "Consultez notre politique de confidentialité et vos droits concernant le traitement des données personnelles.",
    image: "/images/2025/08/cropped-Logo_de_Benne_Occitanie-removebg-preview.png",
  },
  "*": {
    title: "Page non trouvée | Location Benne Occitanie",
    description: "La page demandée n'existe pas.",
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
      "Évacuation de déchets",
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
