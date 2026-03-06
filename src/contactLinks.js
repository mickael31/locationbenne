import { company } from "./data/content";

function toQuery(params) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;
    search.set(key, value);
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getMailtoHref({
  subject = "Demande de contact - Location Benne Occitanie",
  body = "Bonjour,\r\n\r\nJe vous contacte concernant...",
} = {}) {
  return `mailto:${company.email}${toQuery({ subject, body })}`;
}
