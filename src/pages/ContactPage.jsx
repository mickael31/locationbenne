import { useState } from "react";
import SectionCta from "../components/SectionCta";
import { company, contact } from "../data/content";

const defaultForm = {
  fullName: "",
  phone: "",
  email: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(defaultForm);
  const [sent, setSent] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitForm(event) {
    event.preventDefault();
    setSent(true);
    setForm(defaultForm);
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h1>{contact.title}</h1>
          <p>{contact.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <article className="card">
            <h2>{contact.sectionTitle}</h2>
            <p>
              <a href={`tel:${company.phoneRaw}`}>{company.phoneLocalDisplay}</a>
            </p>
            <p>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
            <p>{company.address}</p>
            <p>{contact.sectionSubtitle}</p>
          </article>

          <form className="card contact-form" onSubmit={submitForm}>
            <h2>{contact.formTitle}</h2>
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
              Numéro de téléphone (obligatoire)
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
                placeholder="Décrivez votre besoin de benne en Occitanie"
                value={form.message}
                onChange={updateField}
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Envoyer la demande
            </button>
            {sent ? (
              <p className="success">
                Merci pour votre demande de location ! Nous vous répondrons
                rapidement.
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <SectionCta />
    </>
  );
}
