import assert from "node:assert/strict";
import test from "node:test";

import {
  getEmailJsConfiguration,
  resolveContactProvider,
} from "../src/api/contactProvider.js";

test("the contact form uses EmailJS automatically for static deployments", () => {
  assert.equal(resolveContactProvider({}), "emailjs");
  const configuration = getEmailJsConfiguration({});
  assert.ok(configuration.publicKey);
  assert.ok(configuration.serviceId);
  assert.ok(configuration.templateId);
});

test("the local API remains available when explicitly selected", () => {
  assert.equal(resolveContactProvider({ VITE_CONTACT_PROVIDER: "api" }), "api");
});

test("EmailJS environment values override the static deployment defaults", () => {
  assert.equal(
    resolveContactProvider({
      VITE_CONTACT_PROVIDER: "emailjs",
      VITE_EMAILJS_PUBLIC_KEY: "public-test-key",
      VITE_EMAILJS_SERVICE_ID: "service-test",
      VITE_EMAILJS_TEMPLATE_ID: "template-test",
    }),
    "emailjs",
  );

  assert.deepEqual(
    getEmailJsConfiguration({
      VITE_EMAILJS_PUBLIC_KEY: "public-test-key",
      VITE_EMAILJS_SERVICE_ID: "service-test",
      VITE_EMAILJS_TEMPLATE_ID: "template-test",
    }),
    {
      publicKey: "public-test-key",
      serviceId: "service-test",
      templateId: "template-test",
    },
  );
});
