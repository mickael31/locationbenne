export async function submitContactForm(form) {
  const response = await fetch("/api/contact/submit", {
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
