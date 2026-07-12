const SUPPORTED_CONTACT_PROVIDERS = new Set(["api", "emailjs"]);

function hasEmailJsConfiguration(environment) {
  return [
    environment.VITE_EMAILJS_PUBLIC_KEY,
    environment.VITE_EMAILJS_SERVICE_ID,
    environment.VITE_EMAILJS_TEMPLATE_ID,
  ].every((value) => String(value || "").trim());
}

function isExplicitlyEnabled(value) {
  return ["1", "true", "yes", "on"].includes(
    String(value || "").trim().toLowerCase(),
  );
}

export function resolveContactProvider(environment = {}) {
  const provider = String(environment.VITE_CONTACT_PROVIDER || "api")
    .trim()
    .toLowerCase();

  if (!SUPPORTED_CONTACT_PROVIDERS.has(provider)) {
    throw new Error("invalid-contact-provider");
  }

  if (provider === "emailjs") {
    if (!isExplicitlyEnabled(environment.VITE_EMAILJS_ENABLED)) {
      throw new Error("emailjs-not-enabled");
    }
    if (!hasEmailJsConfiguration(environment)) {
      throw new Error("emailjs-not-configured");
    }
  }

  return provider;
}
