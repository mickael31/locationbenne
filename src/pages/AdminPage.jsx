import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "admin2026";

function getSubmissions() {
  try {
    return JSON.parse(localStorage.getItem("contact_submissions") || "[]");
  } catch {
    return [];
  }
}

function saveSubmissions(data) {
  localStorage.setItem("contact_submissions", JSON.stringify(data));
}

function LoginForm({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      onLogin();
    } else {
      setError("Mot de passe incorrect");
    }
  }

  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">Administration</p>
        <h1>Acc\u00E8s administrateur</h1>
        <div className="admin-login card">
          <form onSubmit={handleSubmit}>
            <label style={{ fontWeight: 600, marginBottom: "0.4rem", display: "block" }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Entrez le mot de passe admin"
              autoFocus
            />
            {error && (
              <p style={{ color: "#c0392b", fontSize: "0.9rem", margin: "0 0 0.5rem" }}>
                {error}
              </p>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function EmailModal({ submission, onClose, onSend }) {
  const [subject, setSubject] = useState(
    "Re: Demande de location de benne"
  );
  const [body, setBody] = useState(
    `Bonjour ${submission.fullName},\n\nMerci pour votre demande. Nous avons bien re\u00E7u votre message et nous revenons vers vous tr\u00E8s rapidement.\n\nCordialement,\nLocation Benne Occitanie`
  );

  function handleSend(e) {
    e.preventDefault();
    const mailtoUrl = `mailto:${submission.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
    onSend(submission.id);
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ maxWidth: 600, width: "100%", cursor: "default" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: "1rem" }}>R\u00E9pondre \u00E0 {submission.fullName}</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Destinataire : {submission.email}
        </p>
        <form className="email-compose" onSubmit={handleSend}>
          <label style={{ fontWeight: 600 }}>
            Objet
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </label>
          <label style={{ fontWeight: 600 }}>
            Message
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              required
            />
          </label>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Ouvrir dans le client mail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminPanel({ onLogout }) {
  const [submissions, setSubmissions] = useState(getSubmissions());
  const [tab, setTab] = useState("new");
  const [emailTarget, setEmailTarget] = useState(null);

  useEffect(() => {
    setSubmissions(getSubmissions());
  }, []);

  function updateStatus(id, status) {
    const updated = submissions.map((s) =>
      s.id === id ? { ...s, status } : s
    );
    saveSubmissions(updated);
    setSubmissions(updated);
  }

  function deleteSubmission(id) {
    const updated = submissions.filter((s) => s.id !== id);
    saveSubmissions(updated);
    setSubmissions(updated);
  }

  function handleEmailSent(id) {
    updateStatus(id, "replied");
  }

  const filtered = submissions.filter((s) => {
    if (tab === "new") return s.status === "new";
    if (tab === "replied") return s.status === "replied";
    if (tab === "archived") return s.status === "archived";
    return true;
  });

  const countNew = submissions.filter((s) => s.status === "new").length;
  const countReplied = submissions.filter((s) => s.status === "replied").length;
  const countArchived = submissions.filter((s) => s.status === "archived").length;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="admin-header">
            <div>
              <p className="eyebrow">Administration</p>
              <h1>Gestion des demandes</h1>
            </div>
            <button className="btn btn-ghost" onClick={onLogout}>
              D\u00E9connexion
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container admin-panel">
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
              <div className="stat-label">R\u00E9pondues</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{countArchived}</div>
              <div className="stat-label">Archiv\u00E9es</div>
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
              R\u00E9pondues ({countReplied})
            </button>
            <button
              className={`admin-tab ${tab === "archived" ? "active" : ""}`}
              onClick={() => setTab("archived")}
            >
              Archiv\u00E9es ({countArchived})
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">{tab === "new" ? "\u2709\uFE0F" : "\u{1F4E6}"}</div>
              <p>Aucune demande dans cette cat\u00E9gorie.</p>
            </div>
          ) : (
            filtered.map((sub) => (
              <div className="submission-card" key={sub.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div className="date">
                    {new Date(sub.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <span className={`badge badge-${sub.status}`}>
                    {sub.status === "new" && "Nouvelle"}
                    {sub.status === "replied" && "R\u00E9pondue"}
                    {sub.status === "archived" && "Archiv\u00E9e"}
                  </span>
                </div>
                <div className="field-row">
                  <span className="field-label">Nom :</span>
                  <span className="field-value">{sub.fullName}</span>
                </div>
                <div className="field-row">
                  <span className="field-label">T\u00E9l\u00E9phone :</span>
                  <span className="field-value">
                    <a href={`tel:${sub.phone}`}>{sub.phone}</a>
                  </span>
                </div>
                <div className="field-row">
                  <span className="field-label">Email :</span>
                  <span className="field-value">
                    <a href={`mailto:${sub.email}`}>{sub.email}</a>
                  </span>
                </div>
                <div className="field-row">
                  <span className="field-label">Message :</span>
                  <span className="field-value">{sub.message}</span>
                </div>
                <div className="actions">
                  <button
                    className="btn-sm"
                    onClick={() => setEmailTarget(sub)}
                  >
                    R\u00E9pondre par email
                  </button>
                  <a
                    className="btn-sm"
                    href={`tel:${sub.phone}`}
                  >
                    Appeler
                  </a>
                  {sub.status !== "replied" && (
                    <button
                      className="btn-sm"
                      onClick={() => updateStatus(sub.id, "replied")}
                    >
                      Marquer r\u00E9pondue
                    </button>
                  )}
                  {sub.status !== "archived" && (
                    <button
                      className="btn-sm"
                      onClick={() => updateStatus(sub.id, "archived")}
                    >
                      Archiver
                    </button>
                  )}
                  <button
                    className="btn-sm danger"
                    onClick={() => deleteSubmission(sub.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {emailTarget && (
        <EmailModal
          submission={emailTarget}
          onClose={() => setEmailTarget(null)}
          onSend={handleEmailSent}
        />
      )}
    </>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("admin_auth") === "true"
  );

  function handleLogout() {
    sessionStorage.removeItem("admin_auth");
    setAuthenticated(false);
  }

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
}
