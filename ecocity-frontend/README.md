# EcoCity — Frontend Angular 20

Frontend SaaS complet pour **EcoCity**, plateforme de gestion des signalements urbains
(dépôts sauvages, éclairage public, nids-de-poule, etc.) destinée aux municipalités.

Ce dépôt contient **uniquement le frontend**. Le backend NestJS + Prisma + PostgreSQL
existe déjà et est attendu sur `http://localhost:3000/api/v1` (configurable dans
`src/environments/environment.ts`).

## Stack

- Angular 20 — Standalone Components uniquement
- TypeScript strict mode
- Angular Signals (état local, `AuthStore`)
- RxJS pour les appels HTTP
- Angular Material
- SCSS modulaire (`public/assets/styles`)
- Chart.js (`ng2-charts`) pour les graphiques du dashboard
- Leaflet pour la carte des incidents
- JWT (access + refresh token) avec interceptors dédiés

## Démarrage

```bash
npm install
ng serve
```

L'application démarre sur `http://localhost:4200`.

> ⚠️ Sans backend actif, les pages de listes/détails retombent automatiquement sur des
> données de démonstration (mock) afin de pouvoir naviguer et visualiser l'UI.

## Architecture

```
src/app/
├── core/          # api, guards, interceptors, layout, services, constants
├── shared/        # composants UI réutilisables, pipes, directives, utils
├── features/      # auth, dashboard, reports, interventions, users,
│                  # organizations, categories, roles, permissions, settings
├── app.routes.ts  # routes racine, lazy-loaded par feature
├── app.component.ts
└── app.config.ts  # providers globaux (HttpClient, interceptors, charts, router)
```

Chaque feature suit la structure `pages/ · components/ · services/ · models/ · routes.ts`.

## Styles

Le design system vit dans `public/assets/styles/` (abstracts, base, components, themes)
et est importé sans chemins relatifs grâce à `stylePreprocessorOptions.includePaths`
défini dans `angular.json`. Exemple dans un composant :

```scss
@use "abstracts/colors" as *;
```

## Comptes de démonstration

Le backend gère l'authentification réelle. Pendant le développement, l'écran de
connexion appelle `/auth/login`; en cas d'échec réseau, naviguer directement vers
`/dashboard` reste possible car les pages exposent des données mock de secours.
