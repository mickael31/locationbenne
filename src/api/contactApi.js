import {
  getEmailJsConfiguration,
  resolveContactProvider,
} from "./contactProvider";

function getApiUrl(pathname) {
  const baseUrl = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  if (!baseUrl) return pathname;
  return `${baseUrl.replace(/\/+$/, "")}${pathname}`;
}

function buildEmailJsPayload(form) {
  return {
    fullName: String(form.fullName || "").trim(),
    phone: String(form.phone || "").trim(),
    email: String(form.email || "").trim().toLowerCase(),
    city: String(form.city || "").trim(),
    benneType: String(form.benneType || "").trim(),
    volume: String(form.volume || "").trim(),
    message: String(form.message || "").trim(),
    sent_at: new Date().toLocaleString("fr-FR"),
    page_url:
      typeof window !== "undefined" ? window.location.href : "",
  };
}

async function submitViaEmailJs(form, environment) {
  const { default: emailjs } = await import("@emailjs/browser");
  const { publicKey, serviceId, templateId } = getEmailJsConfiguration(
    environment,
  );

  const payload = buildEmailJsPayload(form);

  try {
    await emailjs.send(serviceId, templateId, payload, { publicKey });
    return {
      status: "stored",
      notification: "sent",
      provider: "emailjs",
    };
  } catch (error) {
    const next = new Error("emailjs-send-failed");
    next.code = "emailjs-send-failed";
    next.cause = error;
    throw next;
  }
}

async function submitViaApi(form) {
  const response = await fetch(getApiUrl("/api/contact/submit"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const error = new Error(payload.error || `http-${response.status}`);
    error.code = payload.error || `http-${response.status}`;
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function submitContactForm(form) {
  const environment = import.meta.env;
  const provider = resolveContactProvider(environment);

  if (provider === "emailjs") {
    return submitViaEmailJs(form, environment);
  }

  return submitViaApi(form);
}
