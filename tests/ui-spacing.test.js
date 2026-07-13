import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesUrl = new URL("../src/styles.css", import.meta.url);

async function loadStyles() {
  return readFile(stylesUrl, "utf8");
}

function declarationsFor(selector, source) {
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, "");

  return [...withoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selectorList]) =>
      selectorList
        .split(",")
        .map((item) => item.trim())
        .includes(selector),
    )
    .map(([, , declarations]) => declarations)
    .join("\n");
}

function blockFor(marker, source) {
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `Missing CSS block: ${marker}`);

  const openingBrace = source.indexOf("{", start);
  let depth = 0;

  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(openingBrace + 1, index);
  }

  throw new Error(`Unclosed CSS block: ${marker}`);
}

function requiredDeclarations(selector, source) {
  const declarations = declarationsFor(selector, source);
  assert.ok(declarations.trim(), `Missing CSS rule: ${selector}`);
  return declarations;
}

test("shared layouts use one responsive spacing scale", async () => {
  const styles = await loadStyles();

  for (const token of [
    "--space-1",
    "--space-2",
    "--space-3",
    "--space-4",
    "--space-5",
    "--section-space",
    "--layout-gap",
    "--card-padding",
  ]) {
    assert.match(styles, new RegExp(`${token}:`), `${token} must be defined`);
  }

  assert.match(requiredDeclarations(".section", styles), /padding:\s*var\(--section-space\)\s+0/);
  assert.match(requiredDeclarations(".cards", styles), /gap:\s*var\(--layout-gap\)/);
  assert.match(requiredDeclarations(".card", styles), /padding:\s*var\(--card-padding\)/);
});

test("shared content blocks keep deliberate vertical breathing room", async () => {
  const styles = await loadStyles();

  assert.match(
    requiredDeclarations(".hero-copy .phone-first-notice", styles),
    /margin:\s*var\(--space-3\)\s+0\s+var\(--space-4\)/,
  );
  assert.match(
    requiredDeclarations(".location-actions + .phone-first-notice", styles),
    /margin-top:\s*var\(--space-4\)/,
  );
  assert.match(requiredDeclarations("details > p", styles), /margin:\s*var\(--space-2\)\s+0\s+0/);
  requiredDeclarations(".cta-content > p", styles);
  assert.equal(declarationsFor(".cta-content p", styles), "");
  assert.match(requiredDeclarations(".section-lead", styles), /max-width:\s*72ch/);
  assert.match(requiredDeclarations(".quick-cta .button-row", styles), /margin-top:\s*0/);
});

test("compact interfaces keep touch targets and calls clear of content", async () => {
  const styles = await loadStyles();
  const tablet = blockFor("@media (max-width: 980px)", styles);
  const compact = blockFor("@media (max-width: 760px)", styles);
  const mobile = blockFor("@media (max-width: 580px)", styles);

  assert.match(
    requiredDeclarations(".phone-first-notice", compact),
    /flex-direction:\s*column/,
  );
  assert.match(requiredDeclarations(".nav-wrap > nav a", styles), /min-height:\s*44px/);
  assert.match(requiredDeclarations(".contact-lines a", styles), /overflow-wrap:\s*anywhere/);
  assert.match(
    requiredDeclarations(".fade-in-right", tablet),
    /transform:\s*translateY\(var\(--space-4\)\)/,
  );
  assert.match(
    requiredDeclarations(".floating-call", mobile),
    /position:\s*static[\s\S]*margin:\s*var\(--space-4\)\s+auto/,
  );
  assert.match(
    requiredDeclarations(".not-found-card .button-row .btn", mobile),
    /width:\s*100%/,
  );
});
