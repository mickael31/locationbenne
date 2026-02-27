# Location Benne Occitanie - Full Stack (React + Node)

Ce projet contient maintenant:

- Frontend React/Vite (site public + `/admin`)
- Backend Node/Express (API, auth admin, SMTP, stockage chiffre des demandes)

Le backend et le frontend se deploient ensemble dans le meme projet.

## Prerequis

- Node.js 18+
- npm 9+

## Variables d'environnement

Copie `.env.example` vers `.env` puis adapte les valeurs.

Variable obligatoire en production:

- `APP_ENCRYPTION_KEY`: cle secrete utilisee pour chiffrer les donnees stockees par le serveur.

## Developpement local

Installer les dependances:

```bash
npm install
```

Lancer frontend + backend:

```bash
npm run dev:full
```

- Frontend: `http://localhost:5173`
- API backend: `http://localhost:3001`

Le proxy Vite redirige `/api` vers le backend.

## Build + lancement production

```bash
npm run build
npm start
```

Le serveur Node:

- expose les endpoints API sous `/api/*`
- sert automatiquement le build frontend `dist/`
- gere aussi les routes SPA (`/admin`, `/contact`, etc.)

## Mise en route admin

1. Ouvre `/admin`
2. Si non configure, cree le compte admin
3. Connecte-toi
4. Configure SMTP dans l'admin:
   - host, port, secure
   - username/password SMTP
   - from email
   - destinataires (un ou plusieurs)
5. Envoie un test SMTP

Ensuite, chaque nouvelle demande depuis le formulaire contact:

- est stockee cote serveur de maniere chiffree
- declenche un email admin automatique (si SMTP actif)

## Endpoints principaux

- `POST /api/contact/submit`
- `GET /api/admin/bootstrap`
- `POST /api/admin/bootstrap`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `POST /api/admin/change-password`
- `GET /api/admin/submissions`
- `PATCH /api/admin/submissions/:id/status`
- `DELETE /api/admin/submissions/:id`
- `GET /api/admin/smtp-config`
- `PUT /api/admin/smtp-config`
- `POST /api/admin/smtp-test`
