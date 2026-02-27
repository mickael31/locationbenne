import { useEffect, useMemo, useState } from "react";
import {
  authenticateAdmin,
  changeAdminPassword,
  clearLockState,
  createDefaultAdminKeyring,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ADMIN_USERNAME,
  getKeyring,
  getRemainingLockMs,
  isAdminPasswordStrong,
  loadDecryptedSubmissions,
  migrateLegacySubmissions,
  registerFailedLogin,
  saveEncryptedSubmissions,
  wipeAdminVault,
} from "../security/adminVault";

const SESSION_TIMEOUT_MS = 10 * 60 * 1000;

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRemaining(secondsTotal) {
  const minutes = Math.floor(secondsTotal / 60);
  const seconds = secondsTotal % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function SetupForm({ onSetup, busy, error }) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">Administration</p>
        <h1>Initialiser le compte admin</h1>
        <div className="admin-login card">
          <p className="security-note">
            Identifiants initiaux: <strong>{DEFAULT_ADMIN_USERNAME}</strong> /
            <strong> {DEFAULT_ADMIN_PASSWORD}</strong>
          </p>
          <p className="security-note">
            Le mot de passe sera utilise pour dechiffrer le coffre local.
            Change-le des la premiere connexion.
          </p>
          {error ? <p className="admin-error">{error}</p> : null}
          <button className="btn btn-primary" onClick={onSetup} disabled={busy}>
            {busy ? "Initialisation..." : "Creer l'admin par defaut"}
          </button>
        </div>
      </div>
    </section>
  );
}

function LoginForm({ onLogin, onReset, busy, error }) {
  const [username, setUsername] = useState(DEFAULT_ADMIN_USERNAME);
  const [password, setPassword] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    Math.ceil(getRemainingLockMs() / 1000),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds(Math.ceil(getRemainingLockMs() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function submit(event) {
    event.preventDefault();
    if (remainingSeconds > 0) return;
    onLogin(username, password);
  }

  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">Administration</p>
        <h1>Connexion admin securisee</h1>
        <div className="admin-login card">
          <form onSubmit={submit}>
            <label className="admin-input-label">
              Identifiant
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </label>
            <label className="admin-input-label">
              Mot de passe
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {remainingSeconds > 0 ? (
              <p className="admin-lock">
                Trop de tentatives. Nouvel essai dans{" "}
                {formatRemaining(remainingSeconds)}.
              </p>
            ) : null}
            {error ? <p className="admin-error">{error}</p> : null}

            <div className="admin-inline-actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={busy || remainingSeconds > 0}
              >
                {busy ? "Verification..." : "Se connecter"}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={onReset}
                disabled={busy}
              >
                Reinitialiser l'admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function ChangePasswordCard({ onSubmit, busy, status }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setLocalError("");

    if (nextPassword !== confirmPassword) {
      setLocalError("Le nouveau mot de passe et la confirmation ne correspondent pas.");
      return;
    }
    if (!isAdminPasswordStrong(nextPassword)) {
      setLocalError(
        "Nouveau mot de passe trop faible (8+ caracteres, majuscule, minuscule, chiffre).",
      );
      return;
    }

    const ok = await onSubmit(currentPassword, nextPassword);
    if (ok) {
      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <article className="card admin-password-card">
      <h3>Changer le mot de passe admin</h3>
      <form className="email-compose" onSubmit={submit}>
        <label className="admin-input-label">
          Mot de passe actuel
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <label className="admin-input-label">
          Nouveau mot de passe
          <input
            type="password"
            value={nextPassword}
            onChange={(event) => setNextPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
        <label className="admin-input-label">
          Confirmation
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </label>

        {localError ? <p className="admin-error">{localError}</p> : null}
        {status.type === "error" ? <p className="admin-error">{status.message}</p> : null}
        {status.type === "success" ? <p className="success">{status.message}</p> : null}

        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Mise a jour..." : "Modifier le mot de passe"}
        </button>
      </form>
    </article>
  );
}

function EmailModal({ submission, onClose, onSend }) {
  const [subject, setSubject] = useState("Re: Demande de location de benne");
  const [body, setBody] = useState(
    `Bonjour ${submission.fullName},\n\nMerci pour votre demande. Nous revenons vers vous tres rapidement.\n\nCordialement,\nLocation Benne Occitanie`,
  );

  function handleSend(event) {
    event.preventDefault();
    const url = `mailto:${submission.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onSend(submission.id);
    onClose();
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="card admin-modal" onClick={(event) => event.stopPropagation()}>
        <h2>Repondre a {submission.fullName}</h2>
        <p className="admin-muted">Destinataire : {submission.email}</p>
        <form className="email-compose" onSubmit={handleSend}>
          <label className="admin-input-label">
            Objet
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              required
            />
          </label>
          <label className="admin-input-label">
            Message
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={8}
              required
            />
          </label>
          <div className="admin-inline-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Ouvrir le client mail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminPanel({
  adminUsername,
  submissions,
  busy,
  onLogout,
  onWipeVault,
  onChangePassword,
  passwordStatus,
  onUpdateStatus,
  onDeleteSubmission,
}) {
  const [tab, setTab] = useState("new");
  const [emailTarget, setEmailTarget] = useState(null);

  const countNew = useMemo(
    () => submissions.filter((item) => item.status === "new").length,
    [submissions],
  );
  const countReplied = useMemo(
    () => submissions.filter((item) => item.status === "replied").length,
    [submissions],
  );
  const countArchived = useMemo(
    () => submissions.filter((item) => item.status === "archived").length,
    [submissions],
  );

  const filtered = useMemo(() => {
    if (tab === "all") return submissions;
    return submissions.filter((item) => item.status === tab);
  }, [submissions, tab]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="admin-header">
            <div>
              <p className="eyebrow">Administration</p>
              <h1>Espace admin chiffre</h1>
              <p className="admin-muted">Connecte en tant que: {adminUsername}</p>
            </div>
            <div className="admin-inline-actions">
              <button className="btn btn-ghost" onClick={onWipeVault}>
                Reinitialiser le coffre
              </button>
              <button className="btn btn-ghost" onClick={onLogout}>
                Verrouiller
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container admin-panel">
          <ChangePasswordCard
            onSubmit={onChangePassword}
            busy={busy}
            status={passwordStatus}
          />

          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-number">{submissions.length}</div>
              <div className="stat-label">Total demandes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{countNew}</div>
              <div className="stat-label">Nouvelles</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{countReplied}</div>
              <div className="stat-label">Repondues</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{countArchived}</div>
              <div className="stat-label">Archivees</div>
            </div>
          </div>

          <div className="admin-tabs">
            <button
              className={`admin-tab ${tab === "all" ? "active" : ""}`}
              onClick={() => setTab("all")}
            >
              Toutes ({submissions.length})
            </button>
            <button
              className={`admin-tab ${tab === "new" ? "active" : ""}`}
              onClick={() => setTab("new")}
            >
              Nouvelles ({countNew})
            </button>
            <button
              className={`admin-tab ${tab === "replied" ? "active" : ""}`}
              onClick={() => setTab("replied")}
            >
              Repondues ({countReplied})
            </button>
            <button
              className={`admin-tab ${tab === "archived" ? "active" : ""}`}
              onClick={() => setTab("archived")}
            >
              Archivees ({countArchived})
            </button>
          </div>

          {busy ? <p className="admin-muted">Synchronisation chiffree...</p> : null}

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>Aucune demande dans cette categorie.</p>
            </div>
          ) : (
            filtered.map((submission) => (
              <article className="submission-card" key={submission.id}>
                <div className="submission-header">
                  <div className="date">{formatDate(submission.date)}</div>
                  <span className={`badge badge-${submission.status}`}>
                    {submission.status === "new" && "Nouvelle"}
                    {submission.status === "replied" && "Repondue"}
                    {submission.status === "archived" && "Archivee"}
                  </span>
                </div>
                <div className="field-row">
                  <span className="field-label">Nom :</span>
                  <span className="field-value">{submission.fullName}</span>
                </div>
                <div className="field-row">
                  <span className="field-label">Telephone :</span>
                  <span className="field-value">
                    <a href={`tel:${submission.phone}`}>{submission.phone}</a>
                  </span>
                </div>
                <div className="field-row">
                  <span className="field-label">Email :</span>
                  <span className="field-value">
                    <a href={`mailto:${submission.email}`}>{submission.email}</a>
                  </span>
                </div>
                <div className="field-row">
                  <span className="field-label">Message :</span>
                  <span className="field-value">{submission.message}</span>
                </div>
                <div className="actions">
                  <button className="btn-sm" onClick={() => setEmailTarget(submission)}>
                    Repondre
                  </button>
                  <a className="btn-sm" href={`tel:${submission.phone}`}>
                    Appeler
                  </a>
                  {submission.status !== "replied" ? (
                    <button
                      className="btn-sm"
                      onClick={() => onUpdateStatus(submission.id, "replied")}
                    >
                      Marquer repondue
                    </button>
                  ) : null}
                  {submission.status !== "archived" ? (
                    <button
                      className="btn-sm"
                      onClick={() => onUpdateStatus(submission.id, "archived")}
                    >
                      Archiver
                    </button>
                  ) : null}
                  <button
                    className="btn-sm danger"
                    onClick={() => onDeleteSubmission(submission.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {emailTarget ? (
        <EmailModal
          submission={emailTarget}
          onClose={() => setEmailTarget(null)}
          onSend={(id) => onUpdateStatus(id, "replied")}
        />
      ) : null}
    </>
  );
}

export default function AdminPage() {
  const [keyring, setKeyring] = useState(() => getKeyring());
  const [privateKey, setPrivateKey] = useState(null);
  const [adminUsername, setAdminUsername] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [migrationInfo, setMigrationInfo] = useState("");
  const [passwordStatus, setPasswordStatus] = useState({
    type: "idle",
    message: "",
  });

  const isConfigured = Boolean(keyring);
  const isUnlocked = Boolean(privateKey);

  useEffect(() => {
    if (!isUnlocked || !keyring) return undefined;

    const activityEvents = ["click", "keydown", "mousemove", "touchstart"];
    let timerId = null;

    function lockSession() {
      setPrivateKey(null);
      setSubmissions([]);
      setError("Session fermee automatiquement apres inactivite.");
    }

    function resetTimer() {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(lockSession, SESSION_TIMEOUT_MS);
    }

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetTimer);
    });
    resetTimer();

    return () => {
      if (timerId) clearTimeout(timerId);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimer);
      });
    };
  }, [isUnlocked, keyring]);

  async function refreshSubmissions(unlockedKey) {
    const decrypted = await loadDecryptedSubmissions(unlockedKey);
    setSubmissions(decrypted);
  }

  async function setupDefaultAdmin() {
    setBusy(true);
    setError("");
    setMigrationInfo("");
    setPasswordStatus({ type: "idle", message: "" });

    try {
      const created = await createDefaultAdminKeyring();
      const auth = await authenticateAdmin(
        created,
        DEFAULT_ADMIN_USERNAME,
        DEFAULT_ADMIN_PASSWORD,
      );
      const migratedCount = await migrateLegacySubmissions(auth.keyring.publicKey);

      clearLockState();
      setKeyring(auth.keyring);
      setPrivateKey(auth.privateKey);
      setAdminUsername(auth.keyring.auth.username);
      await refreshSubmissions(auth.privateKey);

      if (migratedCount > 0) {
        setMigrationInfo(
          `${migratedCount} anciennes demande(s) ont ete migrees vers le stockage chiffre.`,
        );
      } else {
        setMigrationInfo(
          "Compte admin initialise. Pense a changer le mot de passe par defaut.",
        );
      }
    } catch {
      setError("Impossible de creer le compte admin.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin(username, password) {
    if (!keyring) return;
    setBusy(true);
    setError("");
    setMigrationInfo("");
    setPasswordStatus({ type: "idle", message: "" });

    try {
      const auth = await authenticateAdmin(keyring, username, password);
      const migratedCount = await migrateLegacySubmissions(auth.keyring.publicKey);

      clearLockState();
      setKeyring(auth.keyring);
      setPrivateKey(auth.privateKey);
      setAdminUsername(auth.keyring.auth.username);
      await refreshSubmissions(auth.privateKey);

      if (auth.upgraded) {
        setMigrationInfo(
          "Ancien coffre migre vers le format compte admin username/password.",
        );
      } else if (migratedCount > 0) {
        setMigrationInfo(
          `${migratedCount} anciennes demande(s) ont ete migrees vers le stockage chiffre.`,
        );
      }
    } catch {
      const state = registerFailedLogin();
      if (state.lockUntil > Date.now()) {
        setError("Trop de tentatives. Acces temporairement verrouille.");
      } else {
        setError("Identifiant ou mot de passe invalide.");
      }
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    setPrivateKey(null);
    setSubmissions([]);
    setMigrationInfo("");
    setPasswordStatus({ type: "idle", message: "" });
    setError("");
  }

  async function persistSubmissions(nextSubmissions) {
    if (!keyring?.publicKey) return;
    setBusy(true);
    try {
      await saveEncryptedSubmissions(nextSubmissions, keyring.publicKey);
      setSubmissions(nextSubmissions);
    } finally {
      setBusy(false);
    }
  }

  function updateStatus(id, status) {
    const next = submissions.map((item) =>
      item.id === id ? { ...item, status } : item,
    );
    persistSubmissions(next);
  }

  function deleteSubmission(id) {
    const next = submissions.filter((item) => item.id !== id);
    persistSubmissions(next);
  }

  async function handleChangePassword(currentPassword, nextPassword) {
    if (!keyring || !adminUsername) return false;
    setBusy(true);
    setPasswordStatus({ type: "idle", message: "" });

    try {
      const updated = await changeAdminPassword(
        keyring,
        adminUsername,
        currentPassword,
        nextPassword,
      );
      setKeyring(updated);
      setPasswordStatus({
        type: "success",
        message: "Mot de passe modifie avec succes.",
      });
      return true;
    } catch {
      setPasswordStatus({
        type: "error",
        message: "Mot de passe actuel incorrect.",
      });
      return false;
    } finally {
      setBusy(false);
    }
  }

  function resetAdmin() {
    const confirmed = window.confirm(
      "Reinitialiser l'admin supprime toutes les donnees locales chiffrees. Continuer ?",
    );
    if (!confirmed) return;
    wipeAdminVault();
    setPrivateKey(null);
    setSubmissions([]);
    setKeyring(null);
    setAdminUsername("");
    setBusy(false);
    setError("");
    setMigrationInfo("");
    setPasswordStatus({ type: "idle", message: "" });
  }

  if (!isConfigured) {
    return <SetupForm onSetup={setupDefaultAdmin} busy={busy} error={error} />;
  }

  if (!isUnlocked) {
    return (
      <LoginForm
        onLogin={handleLogin}
        onReset={resetAdmin}
        busy={busy}
        error={error}
      />
    );
  }

  return (
    <>
      {migrationInfo ? (
        <section className="section">
          <div className="container">
            <p className="success">{migrationInfo}</p>
          </div>
        </section>
      ) : null}
      <AdminPanel
        adminUsername={adminUsername}
        submissions={submissions}
        busy={busy}
        onLogout={handleLogout}
        onWipeVault={resetAdmin}
        onChangePassword={handleChangePassword}
        passwordStatus={passwordStatus}
        onUpdateStatus={updateStatus}
        onDeleteSubmission={deleteSubmission}
      />
    </>
  );
}
