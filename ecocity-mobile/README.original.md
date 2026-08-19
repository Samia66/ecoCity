# EcoCity — Application Mobile Flutter

Client Flutter officiel du projet EcoCity, connecté au backend NestJS + Prisma
existant. Ce dépôt ne contient **aucun backend** — uniquement le client
mobile CITIZEN / AGENT / TEAM_LEADER.

## Démarrage

```bash
flutter pub get
dart run build_runner build --delete-conflicting-outputs   # génère les .freezed.dart et .g.dart
flutter run --dart-define=ENV=dev     # http://localhost:3001/api/v1
flutter run --dart-define=ENV=prod    # https://api.ecocity.app/api/v1
```

## Ce qui est déjà en place

| Zone | Contenu |
|---|---|
| `lib/core/api` | `AppConfig` (URLs dev/prod), `ApiEndpoints` (routes REST) |
| `lib/core/network` | Client Dio (intercepteur JWT + refresh automatique), connectivité |
| `lib/core/auth` | `AuthState`, `AuthNotifier` (source de vérité de la session) |
| `lib/core/router` | GoRouter — redirection **automatique** vers le bon shell selon `user.role` |
| `lib/core/theme` | Thème clair/sombre, couleurs de statut/priorité |
| `lib/core/widgets` | `StatsCard`, `RecentReportCard`, `QuickActionButton`, service de géolocalisation |
| `lib/features/auth` | `UserModel`, `UserRole`, login, splash, repository |
| `lib/features/shared/domain` | `CategoryModel`, `ReportModel`, `InterventionModel`, `AgentSummaryModel` + les 4 DTO demandés (`CreateReportDto`, `AssignInterventionDto`, `UpdateInterventionStatusDto`, `AddCommentDto`) |
| `lib/features/shared/data` | Repositories catégories / signalements / interventions |
| `lib/features/citizen` | Shell + 4 écrans (Accueil, Nouveau signalement, Mes signalements, Détail, Profil) |
| `lib/features/agent` | Shell + 4 écrans (Dashboard, Interventions, Détail avec les 5 actions, Carte, Profil) |
| `lib/features/team_leader` | Shell + 4 écrans (Dashboard avec graphiques, Équipe, Affectation, Profil) |

## ⚠️ Points à vérifier avec le backend réel avant la mise en prod

Le cahier des charges ne donnant pas le détail exact de chaque route, j'ai
dû nommer certains endpoints par convention REST. **Vérifie/adapte
uniquement `lib/core/api/api_endpoints.dart`** si le backend utilise des
chemins différents — aucun autre fichier n'a besoin de changer, car tous
les repositories importent leurs URLs depuis ce fichier unique :

- `GET /categories`
- `GET /reports/me`, `POST /reports` (multipart), `GET /reports/:id`
- `GET /interventions/me`, `GET /interventions/unassigned`, `GET /interventions/:id`
- `POST /interventions/:id/assign`, `PATCH /interventions/:id/status`, `POST /interventions/:id/comments`
- `GET /team/agents`
- `GET /dashboard/citizen`, `GET /dashboard/agent`, `GET /dashboard/team-leader`

De même, les modèles de réponse des 3 endpoints `/dashboard/*` et de
`/team/agents` sont déduits du cahier des charges (indicateurs demandés) —
aligne les noms de champs JSON dans
`lib/features/*/domain/*_dashboard_model.dart` sur la forme réelle
renvoyée par NestJS si elle diffère.

Le champ `afterPhotoUrl` de `UpdateInterventionStatusDto` suppose qu'une
route d'upload dédiée (ex: `POST /uploads`) existe côté backend pour
obtenir l'URL avant d'envoyer le statut `RESOLVED` — à brancher dans
`intervention_detail_screen.dart` (`_openResolveDialog`) une fois l'URL
de cette route confirmée.

## Mode hors-ligne

`connectivity_plus` est intégré (`core/network/connectivity_provider.dart`).
La création de signalement est le seul flux marqué "critique" par le
cahier des charges ; brancher une file d'attente locale (ex: Hive/Isar)
sur `ReportRepository.createReport` est le point d'extension recommandé
pour la synchronisation différée.
