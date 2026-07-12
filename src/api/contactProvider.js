const SUPPORTED_CONTACT_PROVIDERS = new Set(["api", "emailjs"]);

const DEFAULT_EMAILJS_CONFIGURATION = {
  publicKey: "JZnrgJVTyt3Fy_rX7",
  serviceId: "smtp_contact",
  templateId: "template_full",
};

function getConfiguredValue(value, fallback) {
  return String(value || fallback).trim();
}

export function getEmailJsConfiguration(environment = {}) {
  return {
    publicKey: getConfiguredValue(
      environment.VITE_EMAILJS_PUBLIC_KEY,
      DEFAULT_EMAILJS_CONFIGURATION.publicKey,
    ),
    serviceId: getConfiguredValue(
      environment.VITE_EMAILJS_SERVICE_ID,
      DEFAULT_EMAILJS_CONFIGURATION.serviceId,
    ),
    templateId: getConfiguredValue(
      environment.VITE_EMAILJS_TEMPLATE_ID,
      DEFAULT_EMAILJS_CONFIGURATION.templateId,
    ),
  };
}

export function resolveContactProvider(environment = {}) {
  const provider = String(environment.VITE_CONTACT_PROVIDER || "emailjs")
    .trim()
    .toLowerCase();

  if (!SUPPORTED_CONTACT_PROVIDERS.has(provider)) {
    throw new Error("invalid-contact-provider");
  }

  return provider;
}
