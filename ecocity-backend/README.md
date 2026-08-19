# EcoCity — Backend NestJS + Prisma + PostgreSQL

API complète pour la plateforme **EcoCity** (gestion des signalements urbains),
conçue pour servir à la fois le **frontend Angular** (back-office municipal)
et l'**application mobile Flutter** (citoyens, agents, chefs d'équipe).

## Stack

- NestJS 11, TypeScript strict
- Prisma ORM + PostgreSQL
- JWT (access token 15 min) + refresh token opaque, haché, rotatif
- bcryptjs pour le hachage des mots de passe
- class-validator / class-transformer pour les DTO
- Repository Pattern : chaque module suit `controller → service → repository → mapper`

## Démarrage rapide

> **Note sur les fichiers `docker-compose.yml`** — le dépôt en contient deux :
> celui-ci (`ecocity-backend/docker-compose.yml`), qui ne lance que **Postgres**,
> est le seul actuellement utilisé par le code (voir `src/config/configuration.ts` :
> aucune variable Redis/MinIO/SMTP n'y est lue). Celui d'
> `infrastructure/docker/docker-compose.yml` (Postgres + Redis + MinIO + Mailpit)
> décrit l'infrastructure cible pour de futures fonctionnalités (cache, stockage
> objet des pièces jointes, emails transactionnels — cf. le `TODO(email)` dans
> `auth.service.ts`) mais n'est pas encore branché : ne le lancez pas tant que ces
> intégrations ne sont pas implémentées côté NestJS, il ne servirait à rien.

```bash
# 1. Base de données (Docker fourni, ou une instance Postgres existante)
docker compose up -d

# 2. Dépendances
npm install

# 3. Variables d'environnement
cp .env.example .env
# ajustez DATABASE_URL / JWT secrets / PUBLIC_URL si besoin

# 4. Génération du client Prisma + migration initiale
npx prisma generate
npx prisma migrate dev --name init

# 5. Données de départ (rôles, permissions, organisation, catégories, comptes de démo)
npm run prisma:seed

# 6. Lancement
npm run start:dev
```

L'API démarre sur `http://localhost:3000/api/v1` (configurable via `.env`).
Les fichiers uploadés (photos de signalements/interventions) sont servis sur
`http://localhost:3000/uploads/...`.

## Comptes de démonstration (après seed)

| Rôle | Email | Mot de passe |
|---|---|---|
| Super Admin | `admin@ecocity.app` (configurable via `SEED_SUPER_ADMIN_EMAIL`) | `EcoCity2026!` |
| Admin | `admin@cotonou.bj` | `Demo2026!` |
| Chef d'équipe | `chef.equipe@cotonou.bj` | `Demo2026!` |
| Agent | `agent@cotonou.bj` | `Demo2026!` |
| Agent | `agent2@cotonou.bj` | `Demo2026!` |
| Citoyen | `citoyen@example.com` | `Demo2026!` |

Le seed crée aussi une **Équipe Zongo** de démonstration (chef `chef.equipe@cotonou.bj`,
agents `agent@cotonou.bj` + `agent2@cotonou.bj`), affectée aux zones "Zongo Nord"
(collecte mercredi + samedi) et "Zongo Sud" (collecte lundi + jeudi) — voir
`GET /collections/today` une fois connecté avec l'un de ces comptes.

## Architecture

```
src/
├── common/          # constants, decorators, guards, filters, interceptors, utils, dto partagés
├── config/          # configuration typée (lecture des variables d'environnement)
├── prisma/          # PrismaService (singleton, hooks de cycle de vie)
└── modules/
    ├── auth/            # login, register, refresh, logout, forgot/reset password, verify-email
    ├── users/           # CRUD utilisateurs + création staff hiérarchique + team.controller.ts
    ├── organizations/
    ├── categories/
    ├── roles/           # CRUD rôles + matrice de permissions
    ├── permissions/
    ├── zones/           # découpage géographique, agents assignés
    ├── reports/         # signalements : création, statut, commentaires, pièces jointes
    ├── interventions/   # affectation, accepter/démarrer/résoudre, photos avant/après
    ├── dashboard/        # /dashboard/{citizen,agent,team-leader,overview}
    └── notifications/
```

Chaque module suit strictement : `*.controller.ts` → `*.service.ts` → `*.repository.ts`
(accès Prisma) → `*.mapper.ts` (Prisma → DTO exposé), avec les DTO de requête
sous `dto/`.

## Rôles et règles métier

| Rôle | Création | Mot de passe |
|---|---|---|
| `CITIZEN` | Inscription publique (`POST /auth/register`) | Choisi par l'utilisateur |
| `AGENT` | Par `ADMIN` ou `TEAM_LEADER` | Généré automatiquement, `mustChangePassword=true` |
| `TEAM_LEADER` | Par `ADMIN` | Généré automatiquement, `mustChangePassword=true` |
| `ADMIN` | Par `SUPER_ADMIN` | Généré automatiquement, `mustChangePassword=true` |

Le mot de passe temporaire est renvoyé **une seule fois**, dans la réponse de
`POST /users` (`{ user, temporaryPassword }`) — à communiquer manuellement à
l'utilisateur créé.

## Permissions dynamiques (RBAC)

Au-delà des 5 rôles système (qui pilotent les règles ci-dessus et les gardes
`@Roles(...)`), chaque rôle porte une liste de **permissions** éditable via
`PATCH /roles/:id/permissions` — c'est la matrice affichée dans l'écran
Angular `/roles/permissions`. Les routes sensibles sont protégées par
`@RequirePermissions(...)`.

## Enveloppe de réponse

Toutes les réponses non paginées sont enveloppées dans `{ data, success: true }`
(convention consommée nativement par l'app Flutter). Les endpoints paginés
renvoient directement `{ data: T[], meta }`, sans enveloppe supplémentaire —
c'est le contrat attendu par le frontend Angular (`PaginatedResponse<T>`).

## Contrat de données avec l'app Flutter

L'app Flutter fournie séparément (`ecocity-mobile.zip`) a été **adaptée pour
correspondre exactement à ce backend** : enums en français partout
(`ReportStatus`, `ReportPriority`, nouvel enum `InterventionStatus`),
structure plate des signalements/interventions (plus de `ReportModel`
imbriqué dans les interventions), noms de champs alignés (`message` au lieu
de `content`, `category` en chaîne plutôt qu'objet, etc.), et upload des
photos avant/après via les nouvelles routes multipart dédiées
(`/interventions/:id/photos/before|after`).

Pour rendre cela possible sans appauvrir l'interface mobile déjà construite
(dashboards riches par rôle, vue "mon équipe" avec charge de travail par
agent), **ce backend a lui-même été enrichi** au-delà du strict nécessaire
pour l'Angular :

- `/dashboard/citizen` renvoie aussi `lastReport` (dernier signalement complet)
- `/dashboard/agent` renvoie `urgentCount`, `resolvedTodayCount`,
  `averageResolutionMinutes`, ainsi que les listes `upcoming[]` /
  `recentUpdates[]` d'interventions
- `/dashboard/team-leader` renvoie `availableAgents`, `criticalCount`,
  `lateCount`, `resolutionRate`, `agentLoad[]` et `weeklyTrend[]`
- `/team/agents` renvoie, en plus des champs utilisateur standard, la charge
  de travail par agent (`assignedCount`, `inProgressCount`,
  `averageResolutionMinutes`)

**Limitation assumée** : `isOnline` (présence) est approximé par
`lastLoginAt < 15 min`, et la géolocalisation live des agents
(`latitude`/`longitude` sur `/team/agents`) n'est pas suivie par ce backend
(pas de table dédiée) — ces champs sont renvoyés `null`/best-effort plutôt
que fabriqués. Le brancher proprement nécessiterait une table de position
agent avec mise à jour périodique, hors du périmètre de cette génération.

Détail complet de l'adaptation mobile dans le README du projet
`ecocity-mobile`.

## Limitation de validation (environnement de génération)

Le téléchargement des moteurs Prisma (`binaries.prisma.sh`) est bloqué dans
le bac à sable où ce code a été écrit — je n'ai donc pas pu exécuter
`npx prisma generate` / `npx prisma migrate dev` moi-même pour une validation
de bout en bout. Le schéma et le code ont été relus et vérifiés statiquement
(résolution de tous les imports, cohérence des exports, wiring des modules)
sans erreur détectée, mais je vous recommande de lancer immédiatement
`npm run build` après `npx prisma generate` en local pour attraper toute
erreur de typage résiduelle — je corrigerai rapidement si vous en trouvez.

## Migrations Prisma

Aucun fichier de migration n'est pré-généré dans ce livrable : sur votre
machine (avec un accès réseau normal), lancez simplement :

```bash
npx prisma migrate dev --name init
```

Prisma génère alors la migration SQL à partir de `prisma/schema.prisma` de
façon fiable et automatique — c'est plus sûr que d'en fournir une écrite à la
main sans avoir pu la tester contre une vraie base.
