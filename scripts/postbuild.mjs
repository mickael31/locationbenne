import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const source = "public/.htaccess";
const target = "dist/.htaccess";
const distIndex = "dist/index.html";
const staticRouteEntries = [
  "about",
  "contact",
  "357-2",
  "services",
  "politique-de-confidentialite",
];

if (existsSync(source)) {
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
}

if (existsSync(distIndex)) {
  for (const route of staticRouteEntries) {
    const routeIndex = join("dist", route, "index.html");
    mkdirSync(dirname(routeIndex), { recursive: true });
    copyFileSync(distIndex, routeIndex);
  }
}
