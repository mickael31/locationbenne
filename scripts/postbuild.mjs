import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import {
  DEFAULT_IMAGE_ALT,
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_TYPE,
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_ROBOTS,
  INDEXABLE_ROUTES,
  LEGACY_ROUTE_REDIRECTS,
  SITE_ORIGIN,
  SITE_NAME,
  getCanonicalUrl,
  getPageSeo,
  getSeoGraph,
  toAbsoluteUrl,
} from "../src/seo/seoConfig.js";

const DIST_DIR = "dist";
const DIST_INDEX = join(DIST_DIR, "index.html");
const SOURCE_HTACCESS = "public/.htaccess";
const SEO_HEAD_PATTERN =
  /<!-- SEO_HEAD_START -->[\s\S]*?<!-- SEO_HEAD_END -->/;
const BUILD_DATE = new Date().toISOString().slice(0, 10);

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function serializeJsonLd(graph) {
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}

function renderSeoBlock({
  title,
  description,
  robots,
  keywords,
  canonical,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  imageType,
  graph,
}) {
  const lines = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeAttribute(description)}" />`,
    `<meta name="robots" content="${escapeAttribute(robots || DEFAULT_ROBOTS)}" />`,
    `<meta name="googlebot" content="${escapeAttribute(robots || DEFAULT_ROBOTS)}" />`,
    keywords?.length
      ? `<meta name="keywords" content="${escapeAttribute(
          keywords.join(", "),
        )}" />`
      : null,
    canonical
      ? `<link rel="canonical" href="${escapeAttribute(canonical)}" />`
      : null,
    canonical
      ? `<link rel="alternate" hreflang="fr-FR" href="${escapeAttribute(canonical)}" />`
      : null,
    canonical
      ? `<link rel="alternate" hreflang="x-default" href="${escapeAttribute(canonical)}" />`
      : null,
    `<meta property="og:title" content="${escapeAttribute(title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttribute(SITE_NAME)}" />`,
    canonical
      ? `<meta property="og:url" content="${escapeAttribute(canonical)}" />`
      : null,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:image" content="${escapeAttribute(image)}" />`,
    `<meta property="og:image:secure_url" content="${escapeAttribute(image)}" />`,
    `<meta property="og:image:alt" content="${escapeAttribute(
      imageAlt || DEFAULT_IMAGE_ALT,
    )}" />`,
    `<meta property="og:image:type" content="${escapeAttribute(
      imageType || DEFAULT_IMAGE_TYPE,
    )}" />`,
    `<meta property="og:image:width" content="${escapeAttribute(
      imageWidth || DEFAULT_IMAGE_WIDTH,
    )}" />`,
    `<meta property="og:image:height" content="${escapeAttribute(
      imageHeight || DEFAULT_IMAGE_HEIGHT,
    )}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttribute(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(description)}" />`,
    `<meta name="twitter:image" content="${escapeAttribute(image)}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttribute(
      imageAlt || DEFAULT_IMAGE_ALT,
    )}" />`,
    canonical
      ? `<meta name="twitter:url" content="${escapeAttribute(canonical)}" />`
      : null,
    `<script id="seo-json-ld" type="application/ld+json">${serializeJsonLd(
      graph,
    )}</script>`,
  ].filter(Boolean);

  return [
    "<!-- SEO_HEAD_START -->",
    ...lines.map((line) => `    ${line}`),
    "    <!-- SEO_HEAD_END -->",
  ].join("\n");
}

function injectSeoBlock(html, seoBlock) {
  if (!SEO_HEAD_PATTERN.test(html)) {
    throw new Error("SEO markers not found in dist/index.html");
  }

  return html.replace(SEO_HEAD_PATTERN, seoBlock);
}

function renderRouteHtml(templateHtml, pathname) {
  const seo = getPageSeo(pathname);
  const canonical = getCanonicalUrl(pathname);
  const graph = getSeoGraph(pathname);

  return injectSeoBlock(
    templateHtml,
    renderSeoBlock({
      title: seo.title,
      description: seo.description,
      robots: seo.robots || DEFAULT_ROBOTS,
      keywords: seo.keywords,
      canonical,
      image: toAbsoluteUrl(seo.image),
      imageAlt: seo.imageAlt,
      imageWidth: seo.imageWidth,
      imageHeight: seo.imageHeight,
      imageType: seo.imageType,
      graph,
    }),
  );
}

function render404Html(templateHtml) {
  const seo = getPageSeo("/route-introuvable");
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: `${SITE_ORIGIN}/`,
      },
      {
        "@type": "WebPage",
        name: seo.title,
        url: `${SITE_ORIGIN}/404.html`,
        description: seo.description,
      },
    ],
  };

  return injectSeoBlock(
    templateHtml,
    renderSeoBlock({
      title: seo.title,
      description: seo.description,
      robots: seo.robots,
      keywords: [],
      canonical: `${SITE_ORIGIN}/404.html`,
      image: toAbsoluteUrl(seo.image),
      imageAlt: seo.imageAlt,
      imageWidth: seo.imageWidth,
      imageHeight: seo.imageHeight,
      imageType: seo.imageType,
      graph,
    }),
  );
}

function renderRedirectHtml(fromPath, toPath) {
  const targetUrl = getCanonicalUrl(toPath);
  const targetSeo = getPageSeo(toPath);
  const title = `Redirection vers ${SITE_NAME}`;
  const description = `Cette page a été déplacée vers ${targetUrl}.`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        url: `${SITE_ORIGIN}${fromPath}/`,
        description,
      },
    ],
  };

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0;url=${escapeAttribute(targetUrl)}" />
    ${renderSeoBlock({
      title,
      description,
      robots: "noindex,follow",
      keywords: [],
      canonical: targetUrl,
      image: toAbsoluteUrl(targetSeo.image),
      imageAlt: targetSeo.imageAlt,
      imageWidth: targetSeo.imageWidth,
      imageHeight: targetSeo.imageHeight,
      imageType: targetSeo.imageType,
      graph,
    }).replace(/^/gm, "    ")}
    <script>window.location.replace(${JSON.stringify(targetUrl)});</script>
  </head>
  <body>
    <p>Redirection vers <a href="${escapeAttribute(targetUrl)}">${escapeHtml(
      targetUrl,
    )}</a>.</p>
  </body>
</html>
`;
}

function renderSitemapXml() {
  const urls = INDEXABLE_ROUTES.map(
    (route) => `  <url>
    <loc>${getCanonicalUrl(route.path)}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function renderRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
}

function writeRouteFile(relativePath, html) {
  const target = join(DIST_DIR, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
}

if (existsSync(SOURCE_HTACCESS)) {
  writeRouteFile(".htaccess", readFileSync(SOURCE_HTACCESS, "utf8"));
}

if (!existsSync(DIST_INDEX)) {
  throw new Error("dist/index.html not found. Run vite build before postbuild.");
}

const templateHtml = readFileSync(DIST_INDEX, "utf8");

writeRouteFile("index.html", renderRouteHtml(templateHtml, "/"));

for (const route of INDEXABLE_ROUTES) {
  if (route.path === "/") continue;
  const routeDirectory = route.path.replace(/^\/+/, "");
  writeRouteFile(join(routeDirectory, "index.html"), renderRouteHtml(templateHtml, route.path));
}

for (const redirect of LEGACY_ROUTE_REDIRECTS) {
  const routeDirectory = redirect.from.replace(/^\/+/, "");
  writeRouteFile(
    join(routeDirectory, "index.html"),
    renderRedirectHtml(redirect.from, redirect.to),
  );
}

writeRouteFile("404.html", render404Html(templateHtml));
writeRouteFile("sitemap.xml", renderSitemapXml());
writeRouteFile("robots.txt", renderRobotsTxt());
