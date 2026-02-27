const KEYRING_STORAGE_KEY = "admin_keyring_v1";
const SUBMISSIONS_STORAGE_KEY = "contact_submissions_secure_v1";
const LEGACY_SUBMISSIONS_STORAGE_KEY = "contact_submissions";
const LEGACY_AUTH_KEY = "admin_auth";
const LOGIN_GUARD_KEY = "admin_login_guard_v1";

export const DEFAULT_ADMIN_USERNAME = "mickcbo";
export const DEFAULT_ADMIN_PASSWORD = "admin123";

const VAULT_KDF_ITERATIONS = 350000;
const AUTH_KDF_ITERATIONS = 220000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function fromBase64(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getRandomBytes(size) {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return bytes;
}

function toIsoNow() {
  return new Date().toISOString();
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function timingSafeEqual(leftBytes, rightBytes) {
  if (leftBytes.length !== rightBytes.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < leftBytes.length; i += 1) {
    diff |= leftBytes[i] ^ rightBytes[i];
  }
  return diff === 0;
}

async function deriveAesKeyFromPassphrase(passphrase, salt, iterations) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations,
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function derivePasswordDigest(password, salt, iterations) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations,
    },
    baseKey,
    256,
  );
}

async function buildPasswordVerifier(password) {
  const salt = getRandomBytes(16);
  const digest = await derivePasswordDigest(
    password,
    salt,
    AUTH_KDF_ITERATIONS,
  );

  return {
    kdf: {
      name: "PBKDF2",
      hash: "SHA-256",
      iterations: AUTH_KDF_ITERATIONS,
      salt: toBase64(salt),
    },
    digest: toBase64(digest),
  };
}

async function verifyPassword(password, verifier) {
  const salt = fromBase64(verifier.kdf.salt);
  const expected = fromBase64(verifier.digest);
  const derived = new Uint8Array(
    await derivePasswordDigest(password, salt, verifier.kdf.iterations),
  );
  return timingSafeEqual(derived, expected);
}

async function encryptBinaryWithPassphrase(binary, passphrase) {
  const salt = getRandomBytes(16);
  const iv = getRandomBytes(12);
  const key = await deriveAesKeyFromPassphrase(
    passphrase,
    salt,
    VAULT_KDF_ITERATIONS,
  );
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    binary,
  );

  return {
    kdf: {
      name: "PBKDF2",
      hash: "SHA-256",
      iterations: VAULT_KDF_ITERATIONS,
      salt: toBase64(salt),
    },
    cipher: {
      name: "AES-GCM",
      iv: toBase64(iv),
      ct: toBase64(ciphertext),
    },
  };
}

async function decryptBinaryWithPassphrase(payload, passphrase) {
  const salt = fromBase64(payload.kdf.salt);
  const iv = fromBase64(payload.cipher.iv);
  const ciphertext = fromBase64(payload.cipher.ct);
  const key = await deriveAesKeyFromPassphrase(
    passphrase,
    salt,
    payload.kdf.iterations,
  );

  return crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );
}

async function importPublicKey(publicKeyJwk) {
  return crypto.subtle.importKey(
    "jwk",
    publicKeyJwk,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"],
  );
}

async function encryptRecord(record, publicKeyJwk) {
  const publicKey = await importPublicKey(publicKeyJwk);
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const iv = getRandomBytes(12);
  const plaintext = textEncoder.encode(JSON.stringify(record));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    plaintext,
  );
  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);
  const encryptedAesKey = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    rawAesKey,
  );

  return {
    v: 1,
    alg: "RSA-OAEP-256+A256GCM",
    ek: toBase64(encryptedAesKey),
    iv: toBase64(iv),
    ct: toBase64(ciphertext),
  };
}

async function decryptRecord(envelope, privateKey) {
  const encryptedAesKey = fromBase64(envelope.ek);
  const iv = fromBase64(envelope.iv);
  const ciphertext = fromBase64(envelope.ct);

  const rawAesKey = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedAesKey,
  );
  const aesKey = await crypto.subtle.importKey(
    "raw",
    rawAesKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    ciphertext,
  );

  return JSON.parse(textDecoder.decode(plaintext));
}

function getSortedSubmissions(submissions) {
  return [...submissions].sort((a, b) => {
    const left = new Date(a.date || 0).getTime();
    const right = new Date(b.date || 0).getTime();
    return right - left;
  });
}

function saveKeyring(keyring) {
  writeJsonStorage(KEYRING_STORAGE_KEY, keyring);
  return keyring;
}

async function buildAuthBlock(username, password) {
  return {
    username: normalizeUsername(username),
    verifier: await buildPasswordVerifier(password),
  };
}

export function getKeyring() {
  return readJsonStorage(KEYRING_STORAGE_KEY, null);
}

export function isAdminPasswordStrong(password) {
  if (!password || password.length < 8) return false;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  return hasLower && hasUpper && hasDigit;
}

export async function createKeyring(passphrase) {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  const publicKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateKeyPkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const encryptedPrivateKey = await encryptBinaryWithPassphrase(
    privateKeyPkcs8,
    passphrase,
  );

  const keyring = {
    v: 2,
    createdAt: toIsoNow(),
    updatedAt: toIsoNow(),
    publicKey: publicKeyJwk,
    encryptedPrivateKey,
  };

  saveKeyring(keyring);
  localStorage.removeItem(LEGACY_AUTH_KEY);
  return keyring;
}

export async function createAdminKeyring(username, password) {
  const keyring = await createKeyring(password);
  const withAuth = {
    ...keyring,
    auth: await buildAuthBlock(username, password),
    updatedAt: toIsoNow(),
  };
  return saveKeyring(withAuth);
}

export async function createDefaultAdminKeyring() {
  return createAdminKeyring(DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD);
}

export async function unlockPrivateKey(keyring, passphrase) {
  const privateKeyPkcs8 = await decryptBinaryWithPassphrase(
    keyring.encryptedPrivateKey,
    passphrase,
  );

  return crypto.subtle.importKey(
    "pkcs8",
    privateKeyPkcs8,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["decrypt"],
  );
}

export async function authenticateAdmin(keyring, username, password) {
  if (!keyring) {
    throw new Error("missing-keyring");
  }

  const normalized = normalizeUsername(username);
  const hasModernAuth = Boolean(keyring.auth?.username && keyring.auth?.verifier);

  if (hasModernAuth) {
    if (normalized !== normalizeUsername(keyring.auth.username)) {
      throw new Error("invalid-credentials");
    }

    const validPassword = await verifyPassword(password, keyring.auth.verifier);
    if (!validPassword) {
      throw new Error("invalid-credentials");
    }

    const privateKey = await unlockPrivateKey(keyring, password);
    return { privateKey, keyring, upgraded: false };
  }

  // Legacy keyring migration: username/password that can decrypt private key
  // become the new credentials.
  const privateKey = await unlockPrivateKey(keyring, password);
  const upgraded = {
    ...keyring,
    v: 2,
    auth: await buildAuthBlock(
      normalized || DEFAULT_ADMIN_USERNAME,
      password,
    ),
    updatedAt: toIsoNow(),
  };
  saveKeyring(upgraded);
  return { privateKey, keyring: upgraded, upgraded: true };
}

export async function changeAdminPassword(
  keyring,
  username,
  currentPassword,
  nextPassword,
) {
  const normalized = normalizeUsername(username);
  if (!keyring?.auth || normalizeUsername(keyring.auth.username) !== normalized) {
    throw new Error("invalid-credentials");
  }

  const validCurrent = await verifyPassword(
    currentPassword,
    keyring.auth.verifier,
  );
  if (!validCurrent) {
    throw new Error("invalid-credentials");
  }

  const privateKeyPkcs8 = await decryptBinaryWithPassphrase(
    keyring.encryptedPrivateKey,
    currentPassword,
  );
  const encryptedPrivateKey = await encryptBinaryWithPassphrase(
    privateKeyPkcs8,
    nextPassword,
  );
  const nextAuth = await buildAuthBlock(normalized, nextPassword);

  const updated = {
    ...keyring,
    encryptedPrivateKey,
    auth: nextAuth,
    updatedAt: toIsoNow(),
  };

  return saveKeyring(updated);
}

export function getLockState() {
  const data = readJsonStorage(LOGIN_GUARD_KEY, {
    failedAttempts: 0,
    lockUntil: 0,
  });
  return {
    failedAttempts: Number(data.failedAttempts || 0),
    lockUntil: Number(data.lockUntil || 0),
  };
}

export function clearLockState() {
  writeJsonStorage(LOGIN_GUARD_KEY, { failedAttempts: 0, lockUntil: 0 });
}

export function registerFailedLogin() {
  const current = getLockState();
  const nextAttempts = current.failedAttempts + 1;
  const isLocked = nextAttempts >= MAX_FAILED_ATTEMPTS;
  const next = {
    failedAttempts: isLocked ? 0 : nextAttempts,
    lockUntil: isLocked ? Date.now() + LOCK_WINDOW_MS : current.lockUntil,
  };
  writeJsonStorage(LOGIN_GUARD_KEY, next);
  return next;
}

export function getRemainingLockMs() {
  const lockState = getLockState();
  const remaining = lockState.lockUntil - Date.now();
  return remaining > 0 ? remaining : 0;
}

export async function addEncryptedSubmission(rawSubmission) {
  const keyring = getKeyring();
  if (!keyring?.publicKey) {
    return { status: "keyring-missing" };
  }

  const submission = {
    ...rawSubmission,
    id:
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    date: toIsoNow(),
    status: "new",
  };

  const encrypted = await encryptRecord(submission, keyring.publicKey);
  const existing = readJsonStorage(SUBMISSIONS_STORAGE_KEY, []);
  existing.unshift(encrypted);
  writeJsonStorage(SUBMISSIONS_STORAGE_KEY, existing);

  return { status: "stored" };
}

export async function loadDecryptedSubmissions(privateKey) {
  const encrypted = readJsonStorage(SUBMISSIONS_STORAGE_KEY, []);
  const result = [];

  for (const item of encrypted) {
    try {
      const decoded = await decryptRecord(item, privateKey);
      result.push(decoded);
    } catch {
      // Skip corrupted entries.
    }
  }

  return getSortedSubmissions(result);
}

export async function saveEncryptedSubmissions(submissions, publicKeyJwk) {
  const encrypted = [];
  for (const submission of submissions) {
    const envelope = await encryptRecord(submission, publicKeyJwk);
    encrypted.push(envelope);
  }
  writeJsonStorage(SUBMISSIONS_STORAGE_KEY, encrypted);
}

export async function migrateLegacySubmissions(publicKeyJwk) {
  const legacy = readJsonStorage(LEGACY_SUBMISSIONS_STORAGE_KEY, []);
  if (!Array.isArray(legacy) || legacy.length === 0) {
    return 0;
  }

  const current = readJsonStorage(SUBMISSIONS_STORAGE_KEY, []);
  for (const item of legacy) {
    if (!item || typeof item !== "object") continue;
    const normalized = {
      id:
        item.id ||
        (typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}_${Math.random().toString(36).slice(2)}`),
      fullName: String(item.fullName || ""),
      phone: String(item.phone || ""),
      email: String(item.email || ""),
      message: String(item.message || ""),
      status: item.status || "new",
      date: item.date || toIsoNow(),
    };
    const encrypted = await encryptRecord(normalized, publicKeyJwk);
    current.push(encrypted);
  }

  writeJsonStorage(SUBMISSIONS_STORAGE_KEY, current);
  localStorage.removeItem(LEGACY_SUBMISSIONS_STORAGE_KEY);
  return legacy.length;
}

export function wipeAdminVault() {
  localStorage.removeItem(KEYRING_STORAGE_KEY);
  localStorage.removeItem(SUBMISSIONS_STORAGE_KEY);
  localStorage.removeItem(LEGACY_SUBMISSIONS_STORAGE_KEY);
  localStorage.removeItem(LEGACY_AUTH_KEY);
  localStorage.removeItem(LOGIN_GUARD_KEY);
}
