import assert from "node:assert/strict";
import test from "node:test";

import { resolveContactProvider } from "../src/api/contactProvider.js";

test("the contact form uses the local API by default", () => {
  assert.equal(resolveContactProvider({}), "api");
});

test("EmailJS is only enabled by an explicit and complete configuration", () => {
  assert.throws(
    () =>
      resolveContactProvider({
        VITE_CONTACT_PROVIDER: "emailjs",
        VITE_EMAILJS_PUBLIC_KEY: "public-test-key",
        VITE_EMAILJS_SERVICE_ID: "service-test",
        VITE_EMAILJS_TEMPLATE_ID: "template-test",
      }),
    /emailjs-not-enabled/,
  );

  assert.throws(
    () =>
      resolveContactProvider({
        VITE_CONTACT_PROVIDER: "emailjs",
        VITE_EMAILJS_ENABLED: "true",
      }),
    /emailjs-not-configured/,
  );

  assert.equal(
    resolveContactProvider({
      VITE_CONTACT_PROVIDER: "emailjs",
      VITE_EMAILJS_ENABLED: "true",
      VITE_EMAILJS_PUBLIC_KEY: "public-test-key",
      VITE_EMAILJS_SERVICE_ID: "service-test",
      VITE_EMAILJS_TEMPLATE_ID: "template-test",
    }),
    "emailjs",
  );
});
