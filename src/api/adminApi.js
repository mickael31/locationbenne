async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
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

export async function getBootstrapStatus() {
  return request("/api/admin/bootstrap", { method: "GET" });
}

export async function bootstrapAdmin({ username, password }) {
  return request("/api/admin/bootstrap", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function loginAdmin({ username, password }) {
  return request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function logoutAdmin() {
  return request("/api/admin/logout", { method: "POST" });
}

export async function getAdminSession() {
  return request("/api/admin/me", { method: "GET" });
}

export async function changeAdminPassword({ currentPassword, nextPassword }) {
  return request("/api/admin/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, nextPassword }),
  });
}

export async function getSubmissions() {
  return request("/api/admin/submissions", { method: "GET" });
}

export async function updateSubmissionStatus(id, status) {
  return request(`/api/admin/submissions/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteSubmission(id) {
  return request(`/api/admin/submissions/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getSmtpConfig() {
  return request("/api/admin/smtp-config", { method: "GET" });
}

export async function saveSmtpConfig(config) {
  return request("/api/admin/smtp-config", {
    method: "PUT",
    body: JSON.stringify(config),
  });
}

export async function sendSmtpTest() {
  return request("/api/admin/smtp-test", {
    method: "POST",
    body: JSON.stringify({}),
  });
}
