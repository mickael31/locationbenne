export default function LegalNoticeLink() {
  return (
    <div
      role="contentinfo"
      style={{
        padding: "0.9rem 1rem",
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        background: "#102431",
        color: "#ffffff",
        textAlign: "center",
        fontSize: "0.9rem",
      }}
    >
      <a
        href="/mentions-legales/"
        style={{ color: "#f0c679", textDecoration: "underline" }}
      >
        Mentions légales
      </a>
      <span aria-hidden="true"> · </span>
      <span>Interventions uniquement chez les clients — aucun accueil sur place</span>
    </div>
  );
}
