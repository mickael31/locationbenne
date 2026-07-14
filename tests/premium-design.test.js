import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, projectRoot), "utf8");
}

test("the premium home hero keeps its proof and advice in distinct, scannable areas", async () => {
  const source = await readProjectFile("src/pages/HomePage.jsx");

  assert.match(source, /className="hero hero-premium"/);
  assert.match(source, /className="hero-proof-list"/);
  assert.match(source, /className="hero-advice"/);
  assert.match(source, /className="hero-media-caption"/);
});

test("the header keeps a compact quote action available, readable branding, and closes its mobile menu with Escape", async () => {
  const [source, styles] = await Promise.all([
    readProjectFile("src/components/SiteLayout.jsx"),
    readProjectFile("src/styles.css"),
  ]);

  assert.match(source, /className="header-quote btn btn-primary small"/);
  assert.match(source, /className="brand-lockup"/);
  assert.match(source, /className="brand-kicker">Location<\/span>/);
  assert.match(source, /className="brand-name">BENNE OCCITANIE<\/strong>/);
  assert.match(
    styles,
    /\.brand-kicker\s*\{[^}]*color:\s*#745312;[^}]*font-size:\s*0\.62rem;/,
  );
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /window\.addEventListener\("keydown", closeMenuWithEscape\)/);
  assert.match(source, /window\.removeEventListener\("keydown", closeMenuWithEscape\)/);
});

test("the conversion advice follows the primary call to action and stays deliberately constrained", async () => {
  const [source, styles] = await Promise.all([
    readProjectFile("src/components/SectionCta.jsx"),
    readProjectFile("src/styles.css"),
  ]);
  const noticeIndex = source.indexOf("<PhoneFirstNotice compact />");
  const actionsIndex = source.indexOf('<div className="cta-actions">');

  assert.ok(noticeIndex > actionsIndex);
  assert.match(
    styles,
    /\.cta-content > \.phone-first-notice-compact\s*\{[^}]*width:\s*min\(100%, 58rem\);[^}]*margin:\s*1\.5rem auto 0;[^}]*text-align:\s*left;/,
  );
});

test("local pages pair their useful editorial content with an accessible visual", async () => {
  const source = await readProjectFile("src/pages/LocationPage.jsx");

  assert.match(source, /import SiteImage from "\.\.\/components\/SiteImage"/);
  assert.match(source, /className="location-feature"/);
  assert.match(source, /src=\{page\.seo\.image\}/);
  assert.match(source, /loading="lazy"/);
});

test("the premium system keeps visible focus, reduced motion, and 44px mobile actions", async () => {
  const styles = await readProjectFile("src/styles.css");

  for (const token of ["--surface-warm", "--ink-strong", "--gold"]) {
    assert.match(styles, new RegExp(`${token}:`));
  }

  assert.match(styles, /:focus-visible\s*\{/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(styles, /\.header-quote\s*\{[\s\S]*min-height:\s*44px/);
});

test("reveal enhancements never hide prerendered content after hydration", async () => {
  const [styles, revealHook] = await Promise.all([
    readProjectFile("src/styles.css"),
    readProjectFile("src/hooks/useScrollReveal.js"),
  ]);

  assert.doesNotMatch(revealHook, /reveal-ready/);
  assert.doesNotMatch(styles, /\.reveal-ready \.fade-in/);
});
