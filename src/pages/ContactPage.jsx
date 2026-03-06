import { useState } from "react";
import { getMailtoHref } from "../contactLinks";
import SectionCta from "../components/SectionCta";
import { company, contact } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";
import { submitContactForm } from "../api/contactApi";

const defaultForm = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  benneType: "",
  volume: "",
  message: "",
};

const benneTypeOptions = [
  "Gravats",
  "Déchets verts",
  "Débarras maison",
  "Déchets de chantier mélangés",
  "Encombrants",
];

const volumeOptions = ["3 m³", "7 m³", "10 m³", "15 m³"];

export default function ContactPage() {
  const [form, setForm] = useState(defaultForm);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useScrollReveal();

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
    }
  }

  async function submitForm(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(form);
      if (result.status === "stored" && result.notification === "failed") {
        setSubmitStatus("stored-notify-warning");
        setForm(defaultForm);
      } else if (result.status === "stored") {
        setSubmitStatus("stored");
        setForm(defaultForm);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      if (error.code === "too-many-requests") {
        setSubmitStatus("rate-limit");
      } else {
        setSubmitStatus("error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="page-hero page-hero-contact">
        <div className="container">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h1>{contact.title}</h1>
          <p className="contact-hero-lead">
            Une équipe locale disponible pour organiser votre location de benne
            sans perte de temps, du devis à l&apos;enlèvement.
          </p>
          <div className="services-hero-actions">
            <a href={`tel:${company.phoneRaw}`} className="btn btn-primary">
              Appeler {company.phoneLocalDisplay}
            </a>
            <a href={getMailtoHref()} className="btn btn-light">
              Écrire par email
            </a>
          </div>
        </div>
      </section>

      <section className="contact-highlights">
        <div className="container contact-highlights-grid">
          <article className="contact-highlight-item fade-in">Réponse rapide</article>
          <article className="contact-highlight-item fade-in stagger-1">
            Devis gratuit
          </article>
          <article className="contact-highlight-item fade-in stagger-2">
            Intervention Occitanie
          </article>
          <article className="contact-highlight-item fade-in stagger-3">
            Suivi de A à Z
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid contact-grid-pro">
          <article className="card contact-info-card fade-in">
            <p className="service-tag">Coordonnées</p>
            <h2>{contact.sectionTitle}</h2>
            <p className="contact-card-lead">{contact.sectionSubtitle}</p>
            <div className="contact-lines">
              <p>
                <span>Téléphone</span>
                <a href={`tel:${company.phoneRaw}`}>{company.phoneLocalDisplay}</a>
              </p>
              <p>
                <span>Email</span>
                <a href={getMailtoHref()}>{company.email}</a>
              </p>
              <p>
                <span>Adresse</span>
                {company.address}
              </p>
            </div>
            <div className="contact-meta-grid">
              <article>
                <h3>Zones couvertes</h3>
                <p>Montauban, Toulouse, Albi et alentours.</p>
              </article>
              <article>
                <h3>Délais habituels</h3>
                <p>Livraison possible sous 24h à 48h selon disponibilité.</p>
              </article>
            </div>
          </article>

          <form
            className="card contact-form contact-form-pro fade-in stagger-2"
            onSubmit={submitForm}
          >
              <h2>{contact.formTitle}</h2>
              <p className="contact-form-lead">
                Donnez-nous les infos principales de votre besoin et nous vous
                recontactons rapidement.
              </p>
              <label>
                Nom complet (obligatoire)
                <input
                  required
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  placeholder="Ex: Jean Dupont"
                  value={form.fullName}
                  onChange={updateField}
                />
              </label>
              <label>
                Numéro de téléphone (obligatoire)
                <input
                  required
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Ex: 0612345678"
                  value={form.phone}
                  onChange={updateField}
                />
              </label>
              <label>
                Email (obligatoire)
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Ex: contact@location-benne-occitanie.fr"
                  value={form.email}
                  onChange={updateField}
                />
              </label>
              <label>
                Ville (optionnel)
                <input
                  type="text"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="Ex: Montauban"
                  value={form.city}
                  onChange={updateField}
                />
              </label>
              <label>
                Type de benne (obligatoire)
                <select
                  required
                  name="benneType"
                  value={form.benneType}
                  onChange={updateField}
                >
                  <option value="" disabled>
                    Choisir un type
                  </option>
                  {benneTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Volume (obligatoire)
                <select
                  required
                  name="volume"
                  value={form.volume}
                  onChange={updateField}
                >
                  <option value="" disabled>
                    Choisir un volume
                  </option>
                  {volumeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Description de la demande (obligatoire)
                <textarea
                  required
                  name="message"
                  rows={6}
                  placeholder="Décrivez votre besoin de benne en Occitanie"
                  value={form.message}
                  onChange={updateField}
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
              </button>

              {submitStatus === "stored" ? (
                <p className="success" role="status" aria-live="polite">
                  Votre message a bien été envoyé. Nous vous recontactons rapidement.
                </p>
              ) : null}

              {submitStatus === "stored-notify-warning" ? (
                <p className="success" role="status" aria-live="polite">
                  Votre message a bien été enregistré. Nous revenons vers vous rapidement.
                </p>
              ) : null}

              {submitStatus === "rate-limit" ? (
                <p className="admin-lock" role="status" aria-live="polite">
                  Trop de tentatives. Merci de patienter avant de renvoyer.
                </p>
              ) : null}

              {submitStatus === "error" ? (
                <p className="admin-error" role="alert">
                  Votre demande n&apos;a pas pu être envoyée.
                </p>
              ) : null}
            </form>
        </div>
      </section>

      <SectionCta />
    </>
  );
}
