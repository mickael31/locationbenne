# Location Benne Occitanie - React + Node

Ce projet contient:

- Frontend React/Vite (site public)
- Envoi formulaire possible en direct via EmailJS (compatible hebergement statique)
- Backend Node/Express (API contact + envoi email MailerSend/SMTP)

La partie admin a ete retiree.

## Prerequis

- Node.js 18+
- npm 9+

## Variables d'environnement

Copie `.env.example` vers `.env` puis adapte les valeurs.

Obligatoire:

- `APP_ENCRYPTION_KEY`: cle secrete utilisee pour chiffrer les donnees stockees cote serveur.

Recommande:

- `APP_DATA_DIR`: dossier persistant pour les donnees serveur (`state.json`).

Configuration email MailerSend (recommande):

- `MAILERSEND_ENABLED=true`
- `MAILERSEND_API_KEY`
- `MAILERSEND_TEMPLATE_ID`
- `MAILERSEND_FROM_EMAIL`
- `MAILERSEND_FROM_NAME`
- `MAILERSEND_RECIPIENTS` (emails separes par virgule)

Configuration EmailJS (mode statique IONOS recommande):

- `VITE_CONTACT_PROVIDER=emailjs`
- `VITE_EMAILJS_ENABLED=true`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_API_BASE_URL` (laisser vide pour mode 100% frontend)

Configuration email SMTP (fallback):

- `SMTP_PREFILL_ENABLED=true`
- `SMTP_PREFILL_HOST`
- `SMTP_PREFILL_PORT`
- `SMTP_PREFILL_SECURE`
- `SMTP_PREFILL_USERNAME`
- `SMTP_PREFILL_PASSWORD`
- `SMTP_PREFILL_FROM_EMAIL`
- `SMTP_PREFILL_RECIPIENTS` (emails separes par virgule)

## Developpement local

```bash
npm install
npm run dev:full
```

- Frontend: `http://localhost:5173`
- API backend: `http://localhost:3001`

## Build + production

```bash
npm run build
npm start
```

Le serveur Node:

- expose l'API sous `/api/*`
- sert le build frontend `dist/`
- gere les routes SPA

## Endpoint principal

- `POST /api/contact/submit`

Notes:

- Si `VITE_CONTACT_PROVIDER=emailjs` et que les IDs EmailJS sont renseignes, le formulaire envoie en direct via EmailJS.
- Si MailerSend est active et configure, l'API envoie via MailerSend.
- Si MailerSend echoue et que SMTP est configure, l'API tente SMTP en secours.
