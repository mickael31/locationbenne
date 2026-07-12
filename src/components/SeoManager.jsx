import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_IMAGE_ALT,
  DEFAULT_IMAGE_TYPE,
  DEFAULT_ROBOTS,
  HOME_HERO_PRELOAD,
  HOME_HERO_PRELOAD_SRCSET,
  HOME_HERO_SIZES,
  SITE_LANGUAGE,
  SITE_LOCALE,
  SITE_NAME,
  getCanonicalUrl,
  getPageSeo,
  getSeoGraph,
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

function setMeta(attributeName, attributeValue, content) {
  if (content) {
    upsertMeta(attributeName, attributeValue, content);
    return;
  }

  removeMeta(attributeName, attributeValue);
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

function removeLink(rel, extra = {}) {
  const extraSelector = Object.entries(extra)
    .map(([key, value]) => `[${key}="${value}"]`)
    .join("");
  document.head.querySelector(`link[rel="${rel}"]${extraSelector}`)?.remove();
}

function syncHomeHeroPreload(isHome) {
  let tag = document.getElementById("seo-home-hero-preload");

  if (!isHome) {
    tag?.remove();
    return;
  }

  if (!tag) {
    tag = document.createElement("link");
    tag.id = "seo-home-hero-preload";
    document.head.appendChild(tag);
  }

  tag.setAttribute("rel", "preload");
  tag.setAttribute("as", "image");
  tag.setAttribute("type", "image/avif");
  tag.setAttribute("fetchpriority", "high");
  tag.setAttribute("href", HOME_HERO_PRELOAD);
  tag.setAttribute("imagesrcset", HOME_HERO_PRELOAD_SRCSET);
  tag.setAttribute("imagesizes", HOME_HERO_SIZES);
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getPageSeo(pathname);
    const canonical = seo.canonical === null ? null : getCanonicalUrl(pathname);
    const ogImage = toAbsoluteUrl(seo.image);
    const imageAlt = seo.imageAlt || DEFAULT_IMAGE_ALT;
    const robots = seo.robots ?? DEFAULT_ROBOTS;

    document.title = seo.title;
    document.documentElement.lang = SITE_LANGUAGE;

    setMeta("name", "description", seo.description);
    setMeta("name", "robots", robots);
    setMeta("name", "googlebot", robots);

    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:locale", SITE_LOCALE);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:image:secure_url", ogImage);
    setMeta("property", "og:image:alt", imageAlt);
    setMeta("property", "og:image:type", seo.imageType || DEFAULT_IMAGE_TYPE);
    setMeta("property", "og:image:width", String(seo.imageWidth || ""));
    setMeta("property", "og:image:height", String(seo.imageHeight || ""));

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", seo.title);
    setMeta("name", "twitter:description", seo.description);
    setMeta("name", "twitter:image", ogImage);
    setMeta("name", "twitter:image:alt", imageAlt);
    setMeta("name", "twitter:url", canonical);

    if (canonical) {
      upsertLink("canonical", canonical);
    } else {
      removeLink("canonical");
    }
    syncHomeHeroPreload(pathname === "/");

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
