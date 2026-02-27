import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const source = "public/.htaccess";
const target = "dist/.htaccess";

if (existsSync(source)) {
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
}
