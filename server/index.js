import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import nodemailer from "nodemailer";

function parseIntEnv(name, fallback) {
  const value = Number(process.env[name]);
  if (Number.isInteger(value) && value > 0) return value;
  return fallback;
}

function isoNow() {
  return new Date().toISOString();
}

function toBase64(buffer) {
  return Buffer.from(buffer).toString("base64");
}

function fromBase64(base64) {
  return Buffer.from(String(base64 || ""), "base64");
}

function deriveSecretKey(rawValue, fallbackSeed) {
  const trimmed = String(rawValue || "").trim();
  if (!trimmed) {
    return crypto.createHash("sha256").update(fallbackSeed, "utf8").digest();
  }

  if (/^[a-fA-F0-9]{64}$/.test(trimmed)) {
    return Buffer.from(trimmed, "hex");
  }

  const decoded = Buffer.from(trimmed, "base64");
  if (decoded.length === 32) {
    return decoded;
  }

  return crypto.createHash("sha256").update(trimmed, "utf8").digest();
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function parseCookies(headerValue) {
  const cookies = {};
  const source = String(headerValue || "");
  if (!source) return cookies;

  for (const chunk of source.split(";")) {
    const [rawKey, ...rest] = chunk.trim().split("=");
    if (!rawKey) continue;
    const rawValue = rest.join("=");
    try {
      cookies[rawKey] = decodeURIComponent(rawValue);
    } catch {
      cookies[rawKey] = rawValue;
    }
  }

  return cookies;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(String(value || ""));
}

function isStrongPassword(password) {
  const value = String(password || "");
  if (value.length < 8) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/\d/.test(value)) return false;
  return true;
}

function splitRecipients(input) {
  if (Array.isArray(input)) return input;
  return String(input || "").split(/[\n,;]+/);
}

function buildRecipientList(input) {
  return Array.from(
    new Set(
      splitRecipients(input)
        .map((item) => String(item || "").trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.resolve(ROOT_DIR, "dist");
const DATA_DIR = path.resolve(ROOT_DIR, "server-data");
const DATA_FILE = path.resolve(DATA_DIR, "state.json");

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = parseIntEnv("PORT", 3001);
const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = parseIntEnv("SESSION_TTL_MS", 12 * 60 * 60 * 1000);
const SESSION_IDLE_TIMEOUT_MS = parseIntEnv(
  "SESSION_IDLE_TIMEOUT_MS",
  30 * 60 * 1000,
);
const LOGIN_LOCK_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const CONTACT_RATE_WINDOW_MS = 60 * 1000;
const CONTACT_RATE_MAX = 20;
const VALID_SUBMISSION_STATUS = new Set(["new", "replied", "archived"]);
const DEFAULT_BOOTSTRAP_USERNAME = normalizeUsername(
  process.env.DEFAULT_ADMIN_USERNAME || "admin",
);

const ENCRYPTION_KEY = deriveSecretKey(
  process.env.APP_ENCRYPTION_KEY,
  "dev-only-encryption-key-change-me",
);

if (NODE_ENV === "production" && !process.env.APP_ENCRYPTION_KEY) {
  throw new Error("APP_ENCRYPTION_KEY is required in production.");
}

function createDefaultState() {
  return {
    v: 1,
    createdAt: isoNow(),
    updatedAt: isoNow(),
    admin: null,
    smtpConfig: null,
    submissions: [],
  };
}

function ensureStateFile() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(createDefaultState(), null, 2));
  }
}

function coerceState(raw) {
  if (!raw || typeof raw !== "object") {
    return createDefaultState();
  }

  const defaults = createDefaultState();
  return {
    ...defaults,
    ...raw,
    admin: raw.admin && typeof raw.admin === "object" ? raw.admin : null,
    smtpConfig:
      raw.smtpConfig && typeof raw.smtpConfig === "object" ? raw.smtpConfig : null,
    submissions: Array.isArray(raw.submissions) ? raw.submissions : [],
  };
}

function loadState() {
  ensureStateFile();

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return coerceState(JSON.parse(raw));
  } catch (error) {
    const fallback = createDefaultState();
    try {
      const brokenFile = `${DATA_FILE}.broken-${Date.now()}`;
      if (fs.existsSync(DATA_FILE)) {
        fs.copyFileSync(DATA_FILE, brokenFile);
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(fallback, null, 2));
    } catch {
      // Ignore backup issues and continue with clean in-memory fallback.
    }
    console.error("State file reset due to parse error:", error);
    return fallback;
  }
}

function saveState(nextState) {
  const state = {
    ...nextState,
    updatedAt: isoNow(),
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
  return state;
}

function encryptJson(payload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    v: 1,
    alg: "A256GCM",
    iv: toBase64(iv),
    tag: toBase64(tag),
    ct: toBase64(ciphertext),
  };
}

function decryptJson(envelope) {
  if (!envelope || typeof envelope !== "object") {
    throw new Error("invalid-envelope");
  }

  const iv = fromBase64(envelope.iv);
  const tag = fromBase64(envelope.tag);
  const ciphertext = fromBase64(envelope.ct);
  const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return JSON.parse(plaintext.toString("utf8"));
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
  });
  return {
    kdf: "scrypt",
    params: { N: 16384, r: 8, p: 1, keyLen: 64 },
    salt: toBase64(salt),
    hash: toBase64(hash),
    createdAt: isoNow(),
  };
}

function verifyPassword(password, passwordRecord) {
  if (!passwordRecord || passwordRecord.kdf !== "scrypt") return false;
  const salt = fromBase64(passwordRecord.salt);
  const expected = fromBase64(passwordRecord.hash);
  const derived = crypto.scryptSync(
    String(password || ""),
    salt,
    passwordRecord.params?.keyLen || 64,
    {
      N: passwordRecord.params?.N || 16384,
      r: passwordRecord.params?.r || 8,
      p: passwordRecord.params?.p || 1,
    },
  );
  return (
    derived.length === expected.length &&
    crypto.timingSafeEqual(derived, expected)
  );
}

function normalizeSmtpConfig(rawConfig, existingConfig) {
  const previous =
    existingConfig && typeof existingConfig === "object"
      ? existingConfig
      : {
          enabled: false,
          host: "",
          port: 587,
          secure: false,
          username: "",
          password: "",
          fromEmail: "",
          recipients: [],
          updatedAt: "",
        };

  const hasPasswordField = Object.prototype.hasOwnProperty.call(
    rawConfig || {},
    "password",
  );
  const passwordValue = hasPasswordField
    ? String(rawConfig?.password || "").trim()
    : previous.password;

  return {
    enabled: Boolean(rawConfig?.enabled),
    host: normalizeText(rawConfig?.host || "", 255),
    port: Number(rawConfig?.port || 0),
    secure: Boolean(rawConfig?.secure),
    username: normalizeText(rawConfig?.username || "", 255),
    password: passwordValue,
    fromEmail: normalizeText(rawConfig?.fromEmail || "", 255).toLowerCase(),
    recipients: buildRecipientList(rawConfig?.recipients),
    updatedAt: isoNow(),
  };
}

function validateSmtpConfig(config) {
  if (!config.enabled) return;

  if (!config.host) throw new Error("smtp-host-required");
  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
    throw new Error("smtp-port-invalid");
  }
  if (!config.username) throw new Error("smtp-username-required");
  if (!config.password) throw new Error("smtp-password-required");
  if (!isValidEmail(config.fromEmail)) throw new Error("smtp-from-invalid");
  if (!Array.isArray(config.recipients) || config.recipients.length === 0) {
    throw new Error("smtp-recipients-required");
  }
  if (config.recipients.some((email) => !isValidEmail(email))) {
    throw new Error("smtp-recipient-invalid");
  }
}

function getSmtpConfigFromState(state) {
  if (!state.smtpConfig) {
    return normalizeSmtpConfig({}, null);
  }

  try {
    const decrypted = decryptJson(state.smtpConfig);
    return normalizeSmtpConfig(decrypted, decrypted);
  } catch (error) {
    console.error("Failed to decrypt SMTP config, returning defaults:", error);
    return normalizeSmtpConfig({}, null);
  }
}

function setSmtpConfigInState(state, nextConfig) {
  const encrypted = encryptJson(nextConfig);
  return {
    ...state,
    smtpConfig: encrypted,
  };
}

function sanitizeSmtpConfigForClient(config) {
  return {
    enabled: config.enabled,
    host: config.host,
    port: config.port,
    secure: config.secure,
    username: config.username,
    fromEmail: config.fromEmail,
    recipients: config.recipients,
    hasPassword: Boolean(config.password),
    updatedAt: config.updatedAt || "",
  };
}

function mapSubmissionEnvelopeToObject(envelope) {
  try {
    return decryptJson(envelope);
  } catch {
    return null;
  }
}

function getSubmissionsFromState(state) {
  return state.submissions
    .map((envelope) => mapSubmissionEnvelopeToObject(envelope))
    .filter(Boolean)
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
}

function setSubmissionsInState(state, submissions) {
  return {
    ...state,
    submissions: submissions.map((item) => encryptJson(item)),
  };
}

function createSubmission(rawInput) {
  const fullName = normalizeText(rawInput?.fullName, 140);
  const phone = normalizeText(rawInput?.phone, 40);
  const email = normalizeText(rawInput?.email, 255).toLowerCase();
  const message = normalizeText(rawInput?.message, 4000);

  if (!fullName || !phone || !email || !message) {
    throw new Error("submission-missing-fields");
  }
  if (!isValidEmail(email)) {
    throw new Error("submission-invalid-email");
  }

  return {
    id:
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    date: isoNow(),
    status: "new",
    fullName,
    phone,
    email,
    message,
  };
}

async function sendSubmissionNotificationEmail(submission, smtpConfig) {
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.username,
      pass: smtpConfig.password,
    },
  });

  const subject = `Nouvelle demande de location - ${submission.fullName}`;
  const textLines = [
    "Nouvelle demande recue.",
    "",
    `Date: ${submission.date}`,
    `Nom: ${submission.fullName}`,
    `Telephone: ${submission.phone}`,
    `Email: ${submission.email}`,
    "",
    "Message:",
    submission.message,
    "",
    `ID: ${submission.id}`,
  ];

  await transporter.sendMail({
    from: smtpConfig.fromEmail,
    to: smtpConfig.recipients.join(", "),
    replyTo: submission.email,
    subject,
    text: textLines.join("\n"),
  });
}

async function sendSmtpTestEmail(smtpConfig, username) {
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.username,
      pass: smtpConfig.password,
    },
  });

  await transporter.sendMail({
    from: smtpConfig.fromEmail,
    to: smtpConfig.recipients.join(", "),
    subject: "Test SMTP - Location Benne",
    text: [
      "Test SMTP valide.",
      `Date: ${isoNow()}`,
      `Declenche par: ${username}`,
      "",
      "Si vous recevez ce message, la configuration SMTP est operationnelle.",
    ].join("\n"),
  });
}

const sessions = new Map();
const loginGuards = new Map();
const contactRateLimit = new Map();

function createSession(username) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  sessions.set(token, {
    username,
    createdAt: now,
    lastSeenAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });
  return token;
}

function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS,
  });
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: NODE_ENV === "production",
    path: "/",
  });
}

function getSessionTokenFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie);
  return String(cookies[SESSION_COOKIE_NAME] || "");
}

function getSessionFromRequest(req) {
  const token = getSessionTokenFromRequest(req);
  if (!token) return null;

  const session = sessions.get(token);
  if (!session) return null;

  const now = Date.now();
  if (session.expiresAt <= now || session.lastSeenAt + SESSION_IDLE_TIMEOUT_MS <= now) {
    sessions.delete(token);
    return null;
  }

  session.lastSeenAt = now;
  sessions.set(token, session);
  return { token, ...session };
}

function requireAdmin(req, res, next) {
  const session = getSessionFromRequest(req);
  if (!session) {
    clearSessionCookie(res);
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  req.admin = session;
  next();
}

function getLoginGuard(ip) {
  const key = String(ip || "unknown");
  const current = loginGuards.get(key);
  if (!current) {
    return { key, failedAttempts: 0, lockUntil: 0 };
  }
  return { key, failedAttempts: current.failedAttempts, lockUntil: current.lockUntil };
}

function getRemainingLockMs(ip) {
  const guard = getLoginGuard(ip);
  const remaining = guard.lockUntil - Date.now();
  return remaining > 0 ? remaining : 0;
}

function registerFailedLogin(ip) {
  const guard = getLoginGuard(ip);
  const nextAttempts = guard.failedAttempts + 1;
  const locked = nextAttempts >= MAX_LOGIN_ATTEMPTS;
  const next = {
    failedAttempts: locked ? 0 : nextAttempts,
    lockUntil: locked ? Date.now() + LOGIN_LOCK_WINDOW_MS : guard.lockUntil,
  };
  loginGuards.set(guard.key, next);
  return {
    failedAttempts: next.failedAttempts,
    remainingMs: next.lockUntil > Date.now() ? next.lockUntil - Date.now() : 0,
  };
}

function clearLoginGuard(ip) {
  const guard = getLoginGuard(ip);
  loginGuards.delete(guard.key);
}

function checkAndRegisterContactRate(ip) {
  const key = String(ip || "unknown");
  const now = Date.now();
  const current = contactRateLimit.get(key) || { count: 0, startedAt: now };
  const stillSameWindow = now - current.startedAt <= CONTACT_RATE_WINDOW_MS;
  const next = stillSameWindow
    ? { count: current.count + 1, startedAt: current.startedAt }
    : { count: 1, startedAt: now };
  contactRateLimit.set(key, next);
  return next.count <= CONTACT_RATE_MAX;
}

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "300kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, timestamp: isoNow() });
});

app.get("/api/admin/bootstrap", (_req, res) => {
  const state = loadState();
  res.json({
    configured: Boolean(state.admin),
    suggestedUsername: DEFAULT_BOOTSTRAP_USERNAME,
  });
});

app.post("/api/admin/bootstrap", (req, res) => {
  const state = loadState();
  if (state.admin) {
    res.status(409).json({ error: "admin-already-configured" });
    return;
  }

  const username = normalizeUsername(
    req.body?.username || DEFAULT_BOOTSTRAP_USERNAME,
  );
  const password = String(req.body?.password || "");

  if (!username) {
    res.status(400).json({ error: "username-required" });
    return;
  }
  if (!isStrongPassword(password)) {
    res.status(400).json({ error: "weak-password" });
    return;
  }

  const next = {
    ...state,
    admin: {
      username,
      password: hashPassword(password),
      createdAt: isoNow(),
      updatedAt: isoNow(),
    },
  };
  saveState(next);

  const sessionToken = createSession(username);
  setSessionCookie(res, sessionToken);
  clearLoginGuard(req.ip);

  res.status(201).json({
    status: "configured",
    username,
  });
});

app.post("/api/admin/login", (req, res) => {
  const remainingLockMs = getRemainingLockMs(req.ip);
  if (remainingLockMs > 0) {
    res.status(429).json({
      error: "login-locked",
      remainingMs: remainingLockMs,
    });
    return;
  }

  const state = loadState();
  if (!state.admin) {
    res.status(409).json({ error: "admin-not-configured" });
    return;
  }

  const username = normalizeUsername(req.body?.username);
  const password = String(req.body?.password || "");
  const usernameMatches = username === normalizeUsername(state.admin.username);
  const passwordMatches = verifyPassword(password, state.admin.password);

  if (!usernameMatches || !passwordMatches) {
    const guard = registerFailedLogin(req.ip);
    res.status(401).json({
      error: "invalid-credentials",
      remainingMs: guard.remainingMs,
    });
    return;
  }

  clearLoginGuard(req.ip);
  const sessionToken = createSession(state.admin.username);
  setSessionCookie(res, sessionToken);

  res.json({
    status: "authenticated",
    username: state.admin.username,
  });
});

app.post("/api/admin/logout", (req, res) => {
  const token = getSessionTokenFromRequest(req);
  if (token) {
    sessions.delete(token);
  }
  clearSessionCookie(res);
  res.json({ status: "logged-out" });
});

app.get("/api/admin/me", requireAdmin, (req, res) => {
  res.json({
    username: req.admin.username,
    sessionExpiresAt: new Date(req.admin.expiresAt).toISOString(),
  });
});

app.post("/api/admin/change-password", requireAdmin, (req, res) => {
  const currentPassword = String(req.body?.currentPassword || "");
  const nextPassword = String(req.body?.nextPassword || "");

  if (!isStrongPassword(nextPassword)) {
    res.status(400).json({ error: "weak-password" });
    return;
  }

  const state = loadState();
  if (!state.admin) {
    res.status(409).json({ error: "admin-not-configured" });
    return;
  }
  if (!verifyPassword(currentPassword, state.admin.password)) {
    res.status(401).json({ error: "invalid-current-password" });
    return;
  }

  const next = {
    ...state,
    admin: {
      ...state.admin,
      password: hashPassword(nextPassword),
      updatedAt: isoNow(),
    },
  };
  saveState(next);

  res.json({ status: "password-updated" });
});

app.get("/api/admin/submissions", requireAdmin, (_req, res) => {
  const state = loadState();
  const submissions = getSubmissionsFromState(state);
  res.json({ submissions });
});

app.patch("/api/admin/submissions/:id/status", requireAdmin, (req, res) => {
  const id = String(req.params.id || "").trim();
  const status = String(req.body?.status || "").trim();
  if (!id) {
    res.status(400).json({ error: "submission-id-required" });
    return;
  }
  if (!VALID_SUBMISSION_STATUS.has(status)) {
    res.status(400).json({ error: "invalid-status" });
    return;
  }

  const state = loadState();
  const submissions = getSubmissionsFromState(state);
  const index = submissions.findIndex((item) => item.id === id);
  if (index === -1) {
    res.status(404).json({ error: "submission-not-found" });
    return;
  }

  const updated = submissions.map((item) =>
    item.id === id ? { ...item, status } : item,
  );
  saveState(setSubmissionsInState(state, updated));
  const current = updated.find((item) => item.id === id);

  res.json({ status: "updated", submission: current });
});

app.delete("/api/admin/submissions/:id", requireAdmin, (req, res) => {
  const id = String(req.params.id || "").trim();
  if (!id) {
    res.status(400).json({ error: "submission-id-required" });
    return;
  }

  const state = loadState();
  const submissions = getSubmissionsFromState(state);
  const next = submissions.filter((item) => item.id !== id);
  if (next.length === submissions.length) {
    res.status(404).json({ error: "submission-not-found" });
    return;
  }

  saveState(setSubmissionsInState(state, next));
  res.json({ status: "deleted" });
});

app.get("/api/admin/smtp-config", requireAdmin, (_req, res) => {
  const state = loadState();
  const smtpConfig = getSmtpConfigFromState(state);
  res.json({
    config: sanitizeSmtpConfigForClient(smtpConfig),
  });
});

app.put("/api/admin/smtp-config", requireAdmin, (req, res) => {
  const state = loadState();
  const current = getSmtpConfigFromState(state);
  const normalized = normalizeSmtpConfig(req.body, current);

  try {
    validateSmtpConfig(normalized);
  } catch (error) {
    res.status(400).json({ error: error.message || "invalid-smtp-config" });
    return;
  }

  const nextState = setSmtpConfigInState(state, normalized);
  saveState(nextState);

  res.json({
    status: "smtp-config-updated",
    config: sanitizeSmtpConfigForClient(normalized),
  });
});

app.post("/api/admin/smtp-test", requireAdmin, async (req, res) => {
  const state = loadState();
  const smtpConfig = getSmtpConfigFromState(state);

  try {
    validateSmtpConfig(smtpConfig);
  } catch (error) {
    res.status(400).json({ error: error.message || "invalid-smtp-config" });
    return;
  }

  try {
    await sendSmtpTestEmail(smtpConfig, req.admin.username);
    res.json({ status: "smtp-test-sent" });
  } catch (error) {
    console.error("SMTP test failed:", error);
    res.status(502).json({ error: "smtp-send-failed" });
  }
});

app.post("/api/contact/submit", async (req, res) => {
  if (!checkAndRegisterContactRate(req.ip)) {
    res.status(429).json({ error: "too-many-requests" });
    return;
  }

  let submission;
  try {
    submission = createSubmission(req.body);
  } catch (error) {
    res.status(400).json({ error: error.message || "invalid-submission" });
    return;
  }

  const state = loadState();
  const next = {
    ...state,
    submissions: [encryptJson(submission), ...state.submissions],
  };
  saveState(next);

  const smtpConfig = getSmtpConfigFromState(next);
  if (!smtpConfig.enabled) {
    res.status(201).json({
      status: "stored",
      notification: "disabled",
    });
    return;
  }

  try {
    validateSmtpConfig(smtpConfig);
    await sendSubmissionNotificationEmail(submission, smtpConfig);
    res.status(201).json({
      status: "stored",
      notification: "sent",
    });
  } catch (error) {
    console.error("Submission stored but SMTP notification failed:", error);
    res.status(201).json({
      status: "stored",
      notification: "failed",
    });
  }
});

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    next();
    return;
  }

  if (fs.existsSync(DIST_DIR)) {
    res.sendFile(path.join(DIST_DIR, "index.html"));
    return;
  }

  res.status(404).send("Frontend build not found. Run npm run build first.");
});

app.use((error, _req, res, _next) => {
  console.error("Unhandled server error:", error);
  res.status(500).json({ error: "internal-server-error" });
});

ensureStateFile();
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
  if (NODE_ENV !== "production" && !process.env.APP_ENCRYPTION_KEY) {
    console.warn(
      "APP_ENCRYPTION_KEY is not set; using a development fallback key.",
    );
  }
});
