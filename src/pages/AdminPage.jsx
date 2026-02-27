import { useEffect, useMemo, useState } from "react";
import {
  bootstrapAdmin,
  changeAdminPassword,
  deleteSubmission,
  getAdminSession,
  getBootstrapStatus,
  getSmtpConfig,
  getSubmissions,
  loginAdmin,
  logoutAdmin,
  saveSmtpConfig,
  sendSmtpTest,
  updateSubmissionStatus,
} from "../api/adminApi";

const defaultSmtpConfig = {
  enabled: false,
  host: "",
  port: 587,
  secure: false,
  username: "",
  fromEmail: "",
  recipients: [],
  hasPassword: false,
};

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRemainingMs(value) {
  const seconds = Math.max(0, Math.ceil(Number(value || 0) / 1000));
  const minutesPart = Math.floor(seconds / 60);
  const secondsPart = seconds % 60;
  return `${minutesPart.toString().padStart(2, "0")}:${secondsPart
    .toString()
    .padStart(2, "0")}`;
}

function isStrongPassword(password) {
  const value = String(password || "");
  if (value.length < 8) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/\d/.test(value)) return false;
  return true;
}

function parseRecipients(value) {
  return Array.from(
    new Set(
      String(value || "")
        .split(/[\n,;]+/)
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

function recipientsToText(recipients) {
  if (!Array.isArray(recipients)) return "";
  return recipients.join("\n");
}

function getAuthErrorMessage(code) {
  if (code === "invalid-credentials") return "Identifiant ou mot de passe invalide.";
  if (code === "login-locked") return "Trop de tentatives. Reessayez plus tard.";
  if (code === "weak-password") return "Mot de passe trop faible.";
  if (code === "invalid-current-password") return "Mot de passe actuel incorrect.";
  if (code === "admin-not-configured") return "Le compte admin n'est pas configure.";
  return "Erreur d'authentification.";
}

function getSmtpErrorMessage(code) {
  if (code === "smtp-host-required") return "Le serveur SMTP est obligatoire.";
  if (code === "smtp-port-invalid") return "Le port SMTP est invalide.";
  if (code === "smtp-username-required") return "Le compte SMTP est obligatoire.";
  if (code === "smtp-password-required") return "Le mot de passe SMTP est obligatoire.";
  if (code === "smtp-from-invalid") return "L'email expediteur est invalide.";
  if (code === "smtp-recipients-required") {
    return "Ajoute au moins un destinataire.";
  }
  if (code === "smtp-recipient-invalid") {
    return "Un ou plusieurs destinataires sont invalides.";
  }
  if (code === "smtp-send-failed") {
    return "Echec d'envoi SMTP. Verifie tes identifiants et ton host.";
  }
  return "Configuration SMTP invalide.";
}

function SetupForm({ suggestedUsername, busy, error, onSubmit }) {
  const [username, setUsername] = useState(suggestedUsername || "admin");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setUsername(suggestedUsername || "admin");
  }, [suggestedUsername]);

  async function submit(event) {
    event.preventDefault();
    setLocalError("");

    if (!username.trim()) {
      setLocalError("Identifiant obligatoire.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Le mot de passe et la confirmation ne correspondent pas.");
      return;
    }
    if (!isStrongPassword(password)) {
      setLocalError(
        "Mot de passe faible (8+ caracteres, majuscule, minuscule, chiffre).",
      );
      return;
    }

    await onSubmit({
      username: username.trim().toLowerCase(),
      password,
    });
  }

  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">Administration</p>
        <h1>Configuration initiale</h1>
        <div className="admin-login card">
          <p className="security-note">
            Cree le compte administrateur du site. Les donnees seront ensuite
            gerees cote serveur.
          </p>

          <form onSubmit={submit}>
            <label className="admin-input-label">
              Identifiant admin
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </label>

            <label className="admin-input-label">
              Mot de passe admin
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            <label className="admin-input-label">
              Confirmation
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </label>

            {localError ? <p className="admin-error">{localError}</p> : null}
            {error ? <p className="admin-error">{error}</p> : null}

            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Initialisation..." : "Creer le compte admin"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function LoginForm({ defaultUsername, busy, error, lockMs, onSubmit }) {
  const [username, setUsername] = useState(defaultUsername || "admin");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setUsername(defaultUsername || "admin");
  }, [defaultUsername]);

  async function submit(event) {
    event.preventDefault();
    if (lockMs > 0) return;
    await onSubmit({
      username: username.trim().toLowerCase(),
      password,
    });
  }

  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">Administration</p>
        <h1>Connexion securisee</h1>
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

            {lockMs > 0 ? (
              <p className="admin-lock">
                Connexion verrouillee temporairement: {formatRemainingMs(lockMs)}.
              </p>
            ) : null}

            {error ? <p className="admin-error">{error}</p> : null}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={busy || lockMs > 0}
            >
              {busy ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ChangePasswordCard({ busy, status, onSubmit }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setLocalError("");

    if (nextPassword !== confirmPassword) {
      setLocalError("Le mot de passe et la confirmation ne correspondent pas.");
      return;
    }
    if (!isStrongPassword(nextPassword)) {
      setLocalError(
        "Mot de passe faible (8+ caracteres, majuscule, minuscule, chiffre).",
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

function SmtpSettingsCard({ config, busy, status, onSave, onTest }) {
  const [enabled, setEnabled] = useState(Boolean(config.enabled));
  const [host, setHost] = useState(config.host || "");
  const [port, setPort] = useState(String(config.port || 587));
  const [secure, setSecure] = useState(Boolean(config.secure));
  const [username, setUsername] = useState(config.username || "");
  const [password, setPassword] = useState("");
  const [fromEmail, setFromEmail] = useState(config.fromEmail || "");
  const [recipientsText, setRecipientsText] = useState(
    recipientsToText(config.recipients),
  );

  useEffect(() => {
    setEnabled(Boolean(config.enabled));
    setHost(config.host || "");
    setPort(String(config.port || 587));
    setSecure(Boolean(config.secure));
    setUsername(config.username || "");
    setFromEmail(config.fromEmail || "");
    setRecipientsText(recipientsToText(config.recipients));
    setPassword("");
  }, [config]);

  function buildPayload() {
    const payload = {
      enabled,
      host: host.trim(),
      port: Number(port),
      secure,
      username: username.trim(),
      fromEmail: fromEmail.trim().toLowerCase(),
      recipients: parseRecipients(recipientsText),
    };
    if (password.trim()) {
      payload.password = password.trim();
    }
    return payload;
  }

  async function submit(event) {
    event.preventDefault();
    await onSave(buildPayload());
  }

  async function sendTest() {
    await onTest(buildPayload());
  }

  return (
    <article className="card admin-notification-card">
      <h3>Notifications email SMTP</h3>
      <p className="security-note">
        Les demandes sont stockees cote serveur de maniere chiffree. Quand SMTP est
        actif, un email complet est envoye automatiquement aux destinataires.
      </p>

      <form className="email-compose" onSubmit={submit}>
        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
          />
          Activer les notifications automatiques
        </label>

        <label className="admin-input-label">
          Serveur SMTP
          <input
            type="text"
            value={host}
            onChange={(event) => setHost(event.target.value)}
            placeholder="smtp.votre-domaine.com"
            disabled={!enabled}
          />
        </label>

        <label className="admin-input-label">
          Port SMTP
          <input
            type="number"
            min={1}
            max={65535}
            value={port}
            onChange={(event) => setPort(event.target.value)}
            disabled={!enabled}
          />
        </label>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={secure}
            onChange={(event) => setSecure(event.target.checked)}
            disabled={!enabled}
          />
          Connexion securisee TLS/SSL
        </label>

        <label className="admin-input-label">
          Identifiant SMTP
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="contact@votre-domaine.com"
            disabled={!enabled}
          />
        </label>

        <label className="admin-input-label">
          Mot de passe SMTP
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={config.hasPassword ? "Laisser vide pour conserver" : ""}
            disabled={!enabled}
          />
        </label>

        <label className="admin-input-label">
          Email expediteur
          <input
            type="email"
            value={fromEmail}
            onChange={(event) => setFromEmail(event.target.value)}
            placeholder="contact@votre-domaine.com"
            disabled={!enabled}
          />
        </label>

        <label className="admin-input-label">
          Destinataires (1 email par ligne ou separes par virgule)
          <textarea
            rows={4}
            value={recipientsText}
            onChange={(event) => setRecipientsText(event.target.value)}
            placeholder={"admin@exemple.com\nassistant@exemple.com"}
            disabled={!enabled}
          />
        </label>

        {status.type === "error" ? <p className="admin-error">{status.message}</p> : null}
        {status.type === "success" ? <p className="success">{status.message}</p> : null}

        <div className="admin-inline-actions">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Sauvegarde..." : "Sauvegarder la config SMTP"}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={sendTest}
            disabled={busy || !enabled}
          >
            Envoyer un test SMTP
          </button>
        </div>
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
        <p className="admin-muted">Destinataire: {submission.email}</p>
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
  onChangePassword,
  passwordStatus,
  smtpConfig,
  smtpStatus,
  onSaveSmtpConfig,
  onTestSmtp,
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
              <h1>Espace admin serveur</h1>
              <p className="admin-muted">Connecte en tant que: {adminUsername}</p>
            </div>
            <div className="admin-inline-actions">
              <button className="btn btn-ghost" onClick={onLogout}>
                Deconnexion
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

          <SmtpSettingsCard
            config={smtpConfig}
            status={smtpStatus}
            onSave={onSaveSmtpConfig}
            onTest={onTestSmtp}
            busy={busy}
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

          {busy ? <p className="admin-muted">Synchronisation...</p> : null}

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
                  <span className="field-label">Nom:</span>
                  <span className="field-value">{submission.fullName}</span>
                </div>
                <div className="field-row">
                  <span className="field-label">Telephone:</span>
                  <span className="field-value">
                    <a href={`tel:${submission.phone}`}>{submission.phone}</a>
                  </span>
                </div>
                <div className="field-row">
                  <span className="field-label">Email:</span>
                  <span className="field-value">
                    <a href={`mailto:${submission.email}`}>{submission.email}</a>
                  </span>
                </div>
                <div className="field-row">
                  <span className="field-label">Message:</span>
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
  const [stage, setStage] = useState("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [suggestedUsername, setSuggestedUsername] = useState("admin");
  const [adminUsername, setAdminUsername] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [smtpConfig, setSmtpConfig] = useState(defaultSmtpConfig);
  const [passwordStatus, setPasswordStatus] = useState({
    type: "idle",
    message: "",
  });
  const [smtpStatus, setSmtpStatus] = useState({
    type: "idle",
    message: "",
  });
  const [loginLockMs, setLoginLockMs] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      setBusy(true);
      setError("");
      try {
        const boot = await getBootstrapStatus();
        if (!mounted) return;

        setSuggestedUsername(boot.suggestedUsername || "admin");
        if (!boot.configured) {
          setStage("setup");
          return;
        }

        try {
          const me = await getAdminSession();
          if (!mounted) return;
          setAdminUsername(me.username);
          await refreshDashboard();
          if (!mounted) return;
          setStage("panel");
        } catch {
          if (!mounted) return;
          setStage("login");
        }
      } catch {
        if (!mounted) return;
        setError("Impossible de charger la configuration admin.");
        setStage("login");
      } finally {
        if (mounted) {
          setBusy(false);
        }
      }
    }

    initialize();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loginLockMs <= 0) return undefined;
    const timerId = setInterval(() => {
      setLoginLockMs((current) => Math.max(0, current - 1000));
    }, 1000);
    return () => clearInterval(timerId);
  }, [loginLockMs]);

  async function refreshDashboard() {
    const [submissionsResult, smtpResult] = await Promise.all([
      getSubmissions(),
      getSmtpConfig(),
    ]);
    setSubmissions(Array.isArray(submissionsResult.submissions) ? submissionsResult.submissions : []);
    setSmtpConfig(smtpResult.config || defaultSmtpConfig);
  }

  async function handleSetup(payload) {
    setBusy(true);
    setError("");
    try {
      const result = await bootstrapAdmin(payload);
      setAdminUsername(result.username);
      await refreshDashboard();
      setStage("panel");
    } catch (apiError) {
      setError(getAuthErrorMessage(apiError.code));
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin(payload) {
    setBusy(true);
    setError("");
    try {
      const result = await loginAdmin(payload);
      setAdminUsername(result.username);
      setLoginLockMs(0);
      await refreshDashboard();
      setStage("panel");
    } catch (apiError) {
      setError(getAuthErrorMessage(apiError.code));
      const remaining = Number(apiError.payload?.remainingMs || 0);
      if (remaining > 0) {
        setLoginLockMs(remaining);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    try {
      await logoutAdmin();
    } catch {
      // Ignore logout failures and continue local reset.
    } finally {
      setBusy(false);
    }

    setSubmissions([]);
    setAdminUsername("");
    setSmtpConfig(defaultSmtpConfig);
    setPasswordStatus({ type: "idle", message: "" });
    setSmtpStatus({ type: "idle", message: "" });
    setError("");
    setStage("login");
  }

  async function handleChangePassword(currentPassword, nextPassword) {
    setBusy(true);
    setPasswordStatus({ type: "idle", message: "" });
    try {
      await changeAdminPassword({ currentPassword, nextPassword });
      setPasswordStatus({
        type: "success",
        message: "Mot de passe modifie avec succes.",
      });
      return true;
    } catch (apiError) {
      setPasswordStatus({
        type: "error",
        message: getAuthErrorMessage(apiError.code),
      });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveSmtpConfig(nextConfig) {
    setBusy(true);
    setSmtpStatus({ type: "idle", message: "" });
    try {
      const result = await saveSmtpConfig(nextConfig);
      setSmtpConfig(result.config || defaultSmtpConfig);
      setSmtpStatus({
        type: "success",
        message: "Configuration SMTP enregistree.",
      });
      return true;
    } catch (apiError) {
      setSmtpStatus({
        type: "error",
        message: getSmtpErrorMessage(apiError.code),
      });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleTestSmtp(nextConfig) {
    setBusy(true);
    setSmtpStatus({ type: "idle", message: "" });
    try {
      const result = await saveSmtpConfig(nextConfig);
      setSmtpConfig(result.config || defaultSmtpConfig);
      await sendSmtpTest();
      setSmtpStatus({
        type: "success",
        message: "Email SMTP de test envoye.",
      });
      return true;
    } catch (apiError) {
      setSmtpStatus({
        type: "error",
        message: getSmtpErrorMessage(apiError.code),
      });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdateStatus(id, status) {
    setBusy(true);
    try {
      await updateSubmissionStatus(id, status);
      setSubmissions((current) =>
        current.map((item) => (item.id === id ? { ...item, status } : item)),
      );
    } catch {
      // Ignore UI notification to keep admin usable.
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteSubmission(id) {
    setBusy(true);
    try {
      await deleteSubmission(id);
      setSubmissions((current) => current.filter((item) => item.id !== id));
    } catch {
      // Ignore UI notification to keep admin usable.
    } finally {
      setBusy(false);
    }
  }

  if (stage === "loading") {
    return (
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Administration</p>
          <h1>Chargement...</h1>
        </div>
      </section>
    );
  }

  if (stage === "setup") {
    return (
      <SetupForm
        suggestedUsername={suggestedUsername}
        busy={busy}
        error={error}
        onSubmit={handleSetup}
      />
    );
  }

  if (stage === "login") {
    return (
      <LoginForm
        defaultUsername={suggestedUsername}
        busy={busy}
        error={error}
        lockMs={loginLockMs}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <AdminPanel
      adminUsername={adminUsername}
      submissions={submissions}
      busy={busy}
      onLogout={handleLogout}
      onChangePassword={handleChangePassword}
      passwordStatus={passwordStatus}
      smtpConfig={smtpConfig}
      smtpStatus={smtpStatus}
      onSaveSmtpConfig={handleSaveSmtpConfig}
      onTestSmtp={handleTestSmtp}
      onUpdateStatus={handleUpdateStatus}
      onDeleteSubmission={handleDeleteSubmission}
    />
  );
}
