import { useState } from "react";
import SectionCta from "../components/SectionCta";
import { company, contact } from "../data/content";
import useScrollReveal from "../hooks/useScrollReveal";
import { submitContactForm } from "../api/contactApi";

const defaultForm = {
  fullName: "",
  phone: "",
  email: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(defaultForm);
  const [submitStatus, setSubmitStatus] = useState("idle");
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

    try {
      const result = await submitContactForm(form);
      if (result.status === "stored" && result.notification === "failed") {
        setSubmitStatus("stored-notify-warning");
      } else if (result.status === "stored") {
        setSubmitStatus("stored");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      if (error.code === "too-many-requests") {
        setSubmitStatus("rate-limit");
      } else {
        setSubmitStatus("error");
      }
    }

    setForm(defaultForm);
  }

  return (
    <>
      <section className="page-hero page-hero-contact">
        <div className="container">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h1>{contact.title}</h1>
          <p className="contact-hero-lead">
            Une equipe locale disponible pour organiser votre location de benne
            sans perte de temps, du devis a l'enlevement.
          </p>
          <div className="services-hero-actions">
            <a href={`tel:${company.phoneRaw}`} className="btn btn-primary">
              Appeler {company.phoneLocalDisplay}
            </a>
            <a href={`mailto:${company.email}`} className="btn btn-light">
              Ecrire par email
            </a>
          </div>
        </div>
      </section>

      <section className="contact-highlights">
        <div className="container contact-highlights-grid">
          <article className="contact-highlight-item fade-in">Reponse rapide</article>
          <article className="contact-highlight-item fade-in stagger-1">
            Devis gratuit
          </article>
          <article className="contact-highlight-item fade-in stagger-2">
            Intervention Occitanie
          </article>
          <article className="contact-highlight-item fade-in stagger-3">
            Suivi de A a Z
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid contact-grid-pro">
          <article className="card contact-info-card fade-in">
            <p className="service-tag">Coordonnees</p>
            <h2>{contact.sectionTitle}</h2>
            <p className="contact-card-lead">{contact.sectionSubtitle}</p>
            <div className="contact-lines">
              <p>
                <span>Telephone</span>
                <a href={`tel:${company.phoneRaw}`}>{company.phoneLocalDisplay}</a>
              </p>
              <p>
                <span>Email</span>
                <a href={`mailto:${company.email}`}>{company.email}</a>
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
                <h3>Delais habituels</h3>
                <p>Livraison possible sous 24h a 48h selon disponibilite.</p>
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
                placeholder="Ex: Jean Dupont"
                value={form.fullName}
                onChange={updateField}
              />
            </label>
            <label>
              Numero de telephone (obligatoire)
              <input
                required
                type="tel"
                name="phone"
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
                placeholder="Ex: nom@exemple.com"
                value={form.email}
                onChange={updateField}
              />
            </label>
            <label>
              Description de la demande (obligatoire)
              <textarea
                required
                name="message"
                rows={6}
                placeholder="Decrivez votre besoin de benne en Occitanie"
                value={form.message}
                onChange={updateField}
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Envoyer la demande
            </button>

            {submitStatus === "stored" ? (
              <p className="success">
                Merci. Votre demande est bien enregistree.
              </p>
            ) : null}

            {submitStatus === "stored-notify-warning" ? (
              <p className="admin-lock">
                Demande enregistree, mais la notification email admin a echoue.
              </p>
            ) : null}

            {submitStatus === "rate-limit" ? (
              <p className="admin-lock">
                Trop de tentatives. Merci de patienter avant de renvoyer.
              </p>
            ) : null}

            {submitStatus === "error" ? (
              <p className="admin-error">
                Votre demande n&apos;a pas pu etre envoyee.
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <SectionCta />
    </>
  );
}
