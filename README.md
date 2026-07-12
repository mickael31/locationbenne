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

Le build genere `dist/` pour le deploiement statique. Il prerend chaque route
indexable, puis regenere le sitemap, le fichier robots, la page 404 et les
redirections historiques.

## Verification avant deploiement

```bash
npm test
```

Cette commande effectue un build unique puis verifie les routes prerendues,
les metadonnees, les URL canoniques, le JSON-LD, le sitemap, les images
responsives, les redirections et l'API locale. Les workflows GitHub Pages et
IONOS utilisent la meme commande avant publication.

`npm run test:coverage` impose au moins 80 % de lignes, branches, fonctions et
instructions sur les modules JavaScript SEO, donnees et fournisseur de contact
charges directement par le runner Node. Les
composants JSX prerendus et le serveur lance en sous-processus restent valides
par les tests d'integration et de build, mais ne sont pas inclus dans ce rapport
de couverture natif.

## Maintenance SEO

- Les routes, titres, descriptions, canonicals et donnees structurees sont
  centralises dans `src/seo/seoConfig.js`. Les dates `lastmod` des pages locales
  suivent leur contenu dans `src/data/locationPages.js`.
- Les liens internes utilisent toujours l'URL canonique avec slash final.
- `lastmod` ne doit etre change qu'apres une modification significative du
  contenu, des donnees structurees ou du maillage de la page.
- Les images editoriales gardent un PNG de repli et possedent des variantes
  AVIF/WebP en 480 px, 768 px et largeur originale. `SiteImage` genere les
  `srcset` correspondants.
- Toute nouvelle route indexable doit etre ajoutee au routeur, au registre SEO
  et aux tests de build dans le meme changement.

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
