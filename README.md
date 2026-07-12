# Location Benne Occitanie

Site React/Vite avec API Express pour les demandes de contact. Un mode EmailJS explicite reste disponible pour l'hebergement statique IONOS.

## Prerequis

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
```

## Configuration utile

Copie `.env.example` vers `.env`.

Par defaut, le formulaire utilise l'API du serveur:

- `VITE_CONTACT_PROVIDER=api`
- `VITE_API_BASE_URL` peut pointer vers un serveur separe

Pour un deploiement statique sans serveur, EmailJS doit etre active explicitement:

- `VITE_CONTACT_PROVIDER=emailjs`
- `VITE_EMAILJS_ENABLED=true`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`

Ces trois identifiants ne possedent aucune valeur par defaut dans le code. Le workflow IONOS les lit depuis les secrets GitHub du meme nom et bloque le build si la configuration est incomplete.

Pour un serveur en production, le bootstrap administrateur HTTP est desactive par defaut. Cree le premier compte avec `AUTO_BOOTSTRAP_ADMIN=true`, `DEFAULT_ADMIN_USERNAME` et un `DEFAULT_ADMIN_PASSWORD` robuste, puis desactive ces variables apres le premier demarrage.

## Lancer en local

```bash
npm run dev:full
```

Application: `http://localhost:5173`
API: `http://localhost:3001`

`npm run dev` lance uniquement le frontend et ne suffit pas pour tester le formulaire avec le provider `api`.

## Build

```bash
npm run build
```

Le build genere `dist/` pour le deploiement statique.

## Formulaire

Variables envoyees a l'API ou au template EmailJS explicitement configure:

- `fullName`
- `phone`
- `email`
- `city`
- `benneType`
- `volume`
- `message`
- `sent_at`
- `page_url`
