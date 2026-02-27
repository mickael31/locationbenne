# Location Benne Occitanie

Site React/Vite avec formulaire de contact envoi email via **EmailJS** (compatible hebergement statique IONOS).

## Prerequis

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Configuration utile

Copie `.env.example` vers `.env`.

Variables importantes pour le formulaire:

- `VITE_CONTACT_PROVIDER=emailjs`
- `VITE_EMAILJS_ENABLED=true`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`

Le projet est deja preconfigure avec:

- Service: `smtp_contact`
- Template: `template_full`
- Public key: `JZnrgJVTyt3Fy_rX7`

## Lancer en local (frontend)

```bash
npm run dev
```

Frontend: `http://localhost:5173`

## Build

```bash
npm run build
```

Le build genere `dist/` pour le deploiement statique.

## Formulaire

Variables envoyees au template EmailJS:

- `fullName`
- `phone`
- `email`
- `city`
- `benneType`
- `volume`
- `message`
- `sent_at`
- `page_url`
