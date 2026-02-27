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
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h1>{contact.title}</h1>
          <p>{contact.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <article className="card fade-in">
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

          <form
            className="card contact-form fade-in stagger-2"
            onSubmit={submitForm}
          >
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
