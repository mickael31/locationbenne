import {
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const DIST_DIR = "dist";
const BUSINESS_ID = "https://location-benne-occitanie.fr/#business";
const LEGAL_NOTICE_FILE = join("mentions-legales", "index.html");
const SERVICE_MODE_LABEL =
  "Interventions uniquement chez les clients — aucun accueil sur place";
const ADDRESS_PATTERNS = [
  /28\s+chemin\s+des\s+bernardets\s*,?\s*82000\s+montauban/gi,
  /28\s+chemin\s+des\s+bernardets/gi,
];

function listHtmlFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    if (statSync(absolutePath).isDirectory()) {
      return listHtmlFiles(absolutePath);
    }
    return absolutePath.endsWith(".html") ? [absolutePath] : [];
  });
}

function sanitizeJsonLd(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeJsonLd);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const sanitized = Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, sanitizeJsonLd(child)]),
  );

  if (sanitized["@id"] === BUSINESS_ID) {
    delete sanitized.address;
  }

  return sanitized;
}

function sanitizeHtml(html, { allowLegalAddress = false } = {}) {
  const withoutStructuredAddress = html.replace(
    /<script\b([^>]*\btype=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi,
    (script, attributes, source) => {
      try {
        const sanitized = sanitizeJsonLd(JSON.parse(source));
        return `<script${attributes}>${JSON.stringify(sanitized)}</script>`;
      } catch {
        return script;
      }
    },
  );

  if (allowLegalAddress) {
    return withoutStructuredAddress;
  }

  return ADDRESS_PATTERNS.reduce(
    (result, pattern) => result.replace(pattern, SERVICE_MODE_LABEL),
    withoutStructuredAddress,
  );
}

const files = listHtmlFiles(DIST_DIR);
for (const file of files) {
  const source = readFileSync(file, "utf8");
  const sanitized = sanitizeHtml(source, {
    allowLegalAddress: file.endsWith(LEGAL_NOTICE_FILE),
  });
  if (sanitized !== source) {
    writeFileSync(file, sanitized);
  }
}

console.log(`Service-area address redaction checked ${files.length} HTML files.`);
