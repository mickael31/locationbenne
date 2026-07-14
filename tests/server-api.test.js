import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";

import { HOME_HERO_PRELOAD } from "../src/seo/seoConfig.js";

const port = 46000 + Math.floor(Math.random() * 1000);
const baseUrl = `http://127.0.0.1:${port}`;

let dataDirectory;
let serverProcess;
let serverOutput = "";

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // The process may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Test server did not start. Output:\n${serverOutput}`);
}

before(async () => {
  dataDirectory = await mkdtemp(join(tmpdir(), "location-benne-api-test-"));
  serverProcess = spawn(process.execPath, ["server/index.js"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "test",
      PORT: String(port),
      APP_DATA_DIR: dataDirectory,
      AUTO_BOOTSTRAP_ADMIN: "false",
      HTTP_ADMIN_BOOTSTRAP_ENABLED: "false",
      MAILERSEND_ENABLED: "false",
      SMTP_PREFILL_ENABLED: "false",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  serverProcess.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  serverProcess.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  await waitForServer();
});

after(async () => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
  if (dataDirectory) {
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

test("admin bootstrap and login routes are reachable", async () => {
  const bootstrapResponse = await fetch(`${baseUrl}/api/admin/bootstrap`);
  const bootstrap = await bootstrapResponse.json();
  assert.equal(bootstrapResponse.status, 200);
  assert.equal(bootstrap.configured, false);
  assert.equal("suggestedPassword" in bootstrap, false);

  const createAdminResponse = await fetch(`${baseUrl}/api/admin/bootstrap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "admin-test",
      password: ["Strong", "Password", "123"].join(""),
    }),
  });
  const createAdmin = await createAdminResponse.json();
  assert.equal(createAdminResponse.status, 403);
  assert.equal(createAdmin.error, "bootstrap-disabled");

  const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  const login = await loginResponse.json();
  assert.equal(loginResponse.status, 409);
  assert.equal(login.error, "admin-not-configured");
});

test("invalid JSON primitives return a JSON 400 response", async () => {
  const response = await fetch(`${baseUrl}/api/contact/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "null",
  });
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.match(response.headers.get("content-type") || "", /application\/json/);
  assert.equal(payload.error, "invalid-json");
});

test("malformed and oversized JSON payloads return safe client errors", async () => {
  const malformedResponse = await fetch(`${baseUrl}/api/contact/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(malformedResponse.status, 400);
  assert.deepEqual(await malformedResponse.json(), { error: "invalid-json" });

  const oversizedResponse = await fetch(`${baseUrl}/api/contact/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "x".repeat(310 * 1024) }),
  });
  assert.equal(oversizedResponse.status, 413);
  assert.deepEqual(await oversizedResponse.json(), {
    error: "payload-too-large",
  });
});

test("unknown API routes return a consistent JSON 404 response", async () => {
  const response = await fetch(`${baseUrl}/api/unknown-route`);
  const payload = await response.json();

  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type") || "", /application\/json/);
  assert.equal(payload.error, "not-found");

  const postResponse = await fetch(`${baseUrl}/api/unknown-route`, {
    method: "POST",
  });
  assert.equal(postResponse.status, 404);
  assert.deepEqual(await postResponse.json(), { error: "not-found" });
});

test("API responses cannot be indexed and static index files redirect cleanly", async () => {
  const healthResponse = await fetch(`${baseUrl}/api/health`);
  assert.equal(healthResponse.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.equal(healthResponse.headers.get("cache-control"), "no-store");

  for (const [pathname, expectedLocation] of [
    ["/index.html", "/"],
    ["/about/index.html", "/about/"],
    ["/ABOUT/index.html", "/about/"],
    ["/about/index.html?utm_source=test", "/about/?utm_source=test"],
    ["/357-2/index.html", "/bennes/"],
  ]) {
    const response = await fetch(`${baseUrl}${pathname}`, {
      redirect: "manual",
    });

    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), expectedLocation);
  }

  const uppercaseApiResponse = await fetch(`${baseUrl}/API/test/index.html`, {
    redirect: "manual",
  });
  assert.equal(uppercaseApiResponse.status, 404);
  assert.equal(uppercaseApiResponse.headers.get("location"), null);
  assert.equal(
    uppercaseApiResponse.headers.get("x-robots-tag"),
    "noindex, nofollow",
  );

  const uppercasePageResponse = await fetch(`${baseUrl}/ABOUT/?utm_source=test`, {
    redirect: "manual",
  });
  assert.equal(uppercasePageResponse.status, 301);
  assert.equal(
    uppercasePageResponse.headers.get("location"),
    "/about/?utm_source=test",
  );
});

test("public pages revalidate while versioned assets use durable caching", async () => {
  const assetNames = await readdir(new URL("../dist/assets/", import.meta.url));
  const scriptName = assetNames.find((name) => /-[A-Za-z0-9_-]+\.js$/i.test(name));
  assert.ok(scriptName);

  const [pageResponse, assetResponse, imageResponse] = await Promise.all([
    fetch(`${baseUrl}/about/`, {
      headers: { "Accept-Encoding": "gzip" },
    }),
    fetch(`${baseUrl}/assets/${scriptName}`),
    fetch(`${baseUrl}${HOME_HERO_PRELOAD}`),
  ]);

  assert.match(pageResponse.headers.get("cache-control") || "", /no-cache/);
  assert.equal(pageResponse.headers.get("content-encoding"), "gzip");
  assert.equal(
    assetResponse.headers.get("cache-control"),
    "public, max-age=31536000, immutable",
  );
  assert.equal(
    imageResponse.headers.get("cache-control"),
    "public, max-age=2592000",
  );
});
