# Location Benne Occitanie

Site React/Vite avec formulaire de contact EmailJS, compatible avec l'hebergement statique IONOS. Une API Express locale reste disponible en option.

## Prerequis

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
```

## Configuration utile

Copie `.env.example` vers `.env`.

Par defaut, le formulaire utilise EmailJS avec la configuration du site. Vous pouvez remplacer ces valeurs dans `.env` si besoin:

- `VITE_CONTACT_PROVIDER=emailjs`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`

Pour utiliser l'API Express en local ou sur un serveur, configurez:

- `VITE_CONTACT_PROVIDER=api`
- `VITE_API_BASE_URL` peut pointer vers un serveur separe

Pour un serveur en production, le bootstrap administrateur HTTP est desactive par defaut. Cree le premier compte avec `AUTO_BOOTSTRAP_ADMIN=true`, `DEFAULT_ADMIN_USERNAME` et un `DEFAULT_ADMIN_PASSWORD` robuste, puis desactive ces variables apres le premier demarrage.

## Lancer en local

```bash
npm run dev:full
```

Application: `http://localhost:5173`
API: `http://localhost:3001`

`npm run dev` suffit pour tester le formulaire EmailJS. Utilisez `npm run dev:full` lorsque `VITE_CONTACT_PROVIDER=api`.

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
