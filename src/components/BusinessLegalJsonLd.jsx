import { company } from "../data/content";

const SITE_ORIGIN = "https://location-benne-occitanie.fr";

export default function BusinessLegalJsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    "@id": `${SITE_ORIGIN}/#business`,
    name: company.name,
    legalName: company.legalName,
    email: company.email,
    telephone: company.phoneRaw,
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "SIREN",
        value: company.siren,
      },
      {
        "@type": "PropertyValue",
        propertyID: "SIRET",
        value: company.siret,
      },
    ],
    openingHoursSpecification: company.openingHours.map((openingHours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: openingHours.dayOfWeek.map(
        (day) => `https://schema.org/${day}`,
      ),
      opens: openingHours.opens,
      closes: openingHours.closes,
    })),
  };

  return (
    <script
      id="business-legal-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
