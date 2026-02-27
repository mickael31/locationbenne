import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getCanonicalUrl,
  getPageSeo,
  getSeoGraph,
  SITE_NAME,
  toAbsoluteUrl,
} from "../seo/seoConfig";

function upsertMeta(attributeName, attributeValue, content) {
  if (!content) return;
  let tag = document.head.querySelector(
    `meta[${attributeName}="${attributeValue}"]`,
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attributeName, attributeValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function removeMeta(attributeName, attributeValue) {
  const tag = document.head.querySelector(
    `meta[${attributeName}="${attributeValue}"]`,
  );
  if (tag) {
    tag.remove();
  }
}

function upsertLink(rel, href, extra = {}) {
  const extraSelector = Object.entries(extra)
    .map(([key, value]) => `[${key}="${value}"]`)
    .join("");
  let tag = document.head.querySelector(`link[rel="${rel}"]${extraSelector}`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    Object.entries(extra).forEach(([key, value]) => {
      tag.setAttribute(key, value);
    });
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getPageSeo(pathname);
    const canonical = getCanonicalUrl(pathname);
    const ogImage = toAbsoluteUrl(seo.image);
    const robots = seo.robots ?? "index,follow";

    document.title = seo.title;

    upsertMeta("name", "description", seo.description);
    if (seo.keywords?.length) {
      upsertMeta("name", "keywords", seo.keywords.join(", "));
    } else {
      removeMeta("name", "keywords");
    }
    upsertMeta("name", "robots", robots);

    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:locale", "fr_FR");
    upsertMeta("property", "og:image", ogImage);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", ogImage);

    upsertLink("canonical", canonical);
    upsertLink("alternate", canonical, { hreflang: "fr-FR" });
    upsertLink("alternate", canonical, { hreflang: "x-default" });

    const graph = getSeoGraph(pathname);
    let jsonLdTag = document.getElementById("seo-json-ld");
    if (!jsonLdTag) {
      jsonLdTag = document.createElement("script");
      jsonLdTag.id = "seo-json-ld";
      jsonLdTag.setAttribute("type", "application/ld+json");
      document.head.appendChild(jsonLdTag);
    }
    jsonLdTag.textContent = JSON.stringify(graph);
  }, [pathname]);

  return null;
}
