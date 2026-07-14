import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { company } from "../data/content";
import { businessDetails } from "../data/businessDetails";

const SITE_ORIGIN = "https://location-benne-occitanie.fr";
const BUSINESS_ID = `${SITE_ORIGIN}/#business`;

// The registered address is not a customer-facing location. Keep every visible
// use of company.address aligned with the service-area business configuration.
company.address = businessDetails.serviceModeLabel;

function removePublicAddress(value) {
  if (Array.isArray(value)) {
    return value.map(removePublicAddress);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const sanitized = Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, removePublicAddress(child)]),
  );

  if (sanitized["@id"] === BUSINESS_ID) {
    delete sanitized.address;
  }

  return sanitized;
}

export default function BusinessLegalJsonLd() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seoScript = document.getElementById("seo-json-ld");
    if (!seoScript?.textContent) return;

    try {
      const graph = JSON.parse(seoScript.textContent);
      seoScript.textContent = JSON.stringify(removePublicAddress(graph));
    } catch {
      // SeoManager remains the source of truth if another script format is used.
    }
  }, [pathname]);

  const graph = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    "@id": BUSINESS_ID,
    name: company.name,
    legalName: businessDetails.legalName,
    url: `${SITE_ORIGIN}/`,
    email: businessDetails.email,
    telephone: company.phoneRaw,
    description:
      "Entreprise de location de bennes intervenant uniquement chez les clients à Montauban, Toulouse, Albi et dans les secteurs voisins desservis.",
    areaServed: businessDetails.serviceAreas,
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "SIREN",
        value: businessDetails.siren,
      },
      {
        "@type": "PropertyValue",
        propertyID: "SIRET",
        value: businessDetails.siret,
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: company.phoneRaw,
      email: businessDetails.email,
      areaServed: businessDetails.serviceAreas,
      availableLanguage: ["fr-FR"],
    },
    openingHoursSpecification: businessDetails.openingHours.map(
      (openingHours) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: openingHours.dayOfWeek.map(
          (day) => `https://schema.org/${day}`,
        ),
        opens: openingHours.opens,
        closes: openingHours.closes,
      }),
    ),
  };

  return (
    <script
      id="business-legal-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
