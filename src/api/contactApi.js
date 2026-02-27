import emailjs from "@emailjs/browser";

const EMAILJS_DEFAULT_PUBLIC_KEY = "JZnrgJVTyt3Fy_rX7";
const EMAILJS_DEFAULT_SERVICE_ID = "smtp_contact";
const EMAILJS_DEFAULT_TEMPLATE_ID = "template_full";

function parseBool(value, fallback = false) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return fallback;
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

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

async function submitViaEmailJs(form) {
  const publicKey = String(
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY || EMAILJS_DEFAULT_PUBLIC_KEY,
  ).trim();
  const serviceId = String(
    import.meta.env.VITE_EMAILJS_SERVICE_ID || EMAILJS_DEFAULT_SERVICE_ID,
  ).trim();
  const templateId = String(
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID || EMAILJS_DEFAULT_TEMPLATE_ID,
  ).trim();

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
  const provider = String(import.meta.env.VITE_CONTACT_PROVIDER || "emailjs")
    .trim()
    .toLowerCase();
  const emailJsEnabled =
    provider === "emailjs" ||
    parseBool(import.meta.env.VITE_EMAILJS_ENABLED, true);
  const emailJsConfigured =
    String(
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY || EMAILJS_DEFAULT_PUBLIC_KEY,
    ).trim() &&
    String(
      import.meta.env.VITE_EMAILJS_SERVICE_ID || EMAILJS_DEFAULT_SERVICE_ID,
    ).trim() &&
    String(
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID || EMAILJS_DEFAULT_TEMPLATE_ID,
    ).trim();

  if (emailJsEnabled && emailJsConfigured) {
    return submitViaEmailJs(form);
  }

  return submitViaApi(form);
}
