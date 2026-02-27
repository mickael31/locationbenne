# Location Benne Occitanie - React + Node

Ce projet contient:

- Frontend React/Vite (site public)
- Backend Node/Express (API contact + envoi email SMTP)

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

Configuration email SMTP (sans interface admin):

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
