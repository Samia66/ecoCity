# EcoCity — Application mobile Flutter

Application mobile pour les citoyens, agents et chefs d'équipe de la
plateforme EcoCity. Ce projet a été **adapté pour correspondre exactement**
au backend NestJS fourni séparément (`ecocity-backend`).

> Le README d'origine (généré dans une session précédente) est conservé sous
> `README.original.md` pour référence.

## Démarrage

```bash
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter run
```

> Les fichiers générés (`*.freezed.dart`, `*.g.dart`) ne sont **pas** inclus
> dans ce livrable (comme dans le projet d'origine) — `build_runner` doit
> être lancé après `pub get`, avant tout `flutter run`.

Configurez l'URL du backend dans `lib/core/api/app_config.dart` (par défaut
`http://localhost:3000/api/v1`, à adapter pour un émulateur Android
— `http://10.0.2.2:3000/api/v1` — ou un appareil physique sur le même
réseau).

## Adaptation réalisée pour matcher le backend

Le backend NestJS implémente le contrat **français** du cahier des charges
métier (statuts `NOUVEAU/EN_ATTENTE/VALIDE/ASSIGNE/EN_COURS/RESOLU/REJETE/ARCHIVE`,
priorités `BASSE/MOYENNE/HAUTE/CRITIQUE`). Les fichiers suivants ont été
réécrits pour s'y aligner (ils utilisaient auparavant des enums en anglais
et une structure différente) :

| Fichier | Changement |
|---|---|
| `lib/features/shared/domain/models/enums.dart` | `ReportStatus` (8 valeurs FR), `ReportPriority` (4 valeurs FR), nouvel enum `InterventionStatus` (6 valeurs, avec `ACCEPTEE`) |
| `lib/features/shared/domain/models/report_model.dart` | Structure à plat : `category` en `String` (plus d'objet imbriqué), `createdBy`, `history[]`, `attachments[]`, `comments[].message`/`.author` |
| `lib/features/shared/domain/models/intervention_model.dart` | Structure à plat (`id, reportId, reportTitle, category, status, assignedAgent...`) — ne contient plus de `ReportModel` imbriqué ; ajout `attachments[]` (avec `phase: AVANT/APRES`), `comments[]`, `history[]` |
| `lib/features/shared/domain/models/category_model.dart` | Aligné sur `CategoryDto` (`id, name, icon, reportsCount`) |
| `lib/features/shared/domain/models/unassigned_report_model.dart` | **Nouveau** — `GET /interventions/unassigned` renvoie des signalements sans intervention, pas des `InterventionModel` |
| `lib/features/shared/domain/dto/add_comment_dto.dart` | Champ `content` → `message` |
| `lib/features/shared/domain/dto/create_report_dto.dart` | Commentaire de priorité mis à jour (`BASSE/MOYENNE/HAUTE/CRITIQUE`) |
| `lib/features/shared/domain/dto/update_intervention_status_dto.dart` | Valeurs de statut mises à jour ; `afterPhotoUrl` retiré (la photo passe désormais par un endpoint multipart dédié) |
| `lib/features/shared/data/intervention_repository.dart` | `fetchUnassigned()` retourne `List<UnassignedReportModel>` ; nouvelle méthode `uploadPhoto(id, file, isBefore)` |
| `lib/core/api/api_endpoints.dart` | Ajout `interventionPhotoBefore`/`interventionPhotoAfter` |
| `lib/core/theme/app_theme.dart` | `priorityColor()`/`statusColor()` mis à jour pour les valeurs françaises |
| Écrans agent/citoyen/chef d'équipe (`intervention_detail_screen.dart`, `intervention_list_screen.dart`, `agent_map_screen.dart`, `agent_dashboard_screen.dart`, `report_detail_screen.dart`, `my_reports_screen.dart`, `interventions_to_assign_screen.dart`, `new_report_screen.dart`) | Références de champs mises à jour pour la nouvelle structure |
| `lib/core/widgets/recent_report_card.dart` | Généralisé pour accepter des champs simples (réutilisable pour un signalement ou une intervention) plutôt qu'un `ReportModel` uniquement |

## Fonctionnalités retirées (non supportées par ce backend)

Pour rester honnête plutôt que de fabriquer des données, les éléments
suivants ont été retirés de l'UI (ils référençaient des champs que le
backend ne fournit pas) :

- **Notation de satisfaction citoyen** (`satisfactionRating`) sur l'écran de
  détail d'un signalement — pas d'endpoint de notation côté backend.
- **Date de résolution dédiée** (`resolvedAt`) — déductible via l'historique
  (`history[]`, dernier statut `RESOLU`) si besoin de la réafficher.
- **Tri par proximité** dans la liste des interventions agent
  (`distanceMeters`) — nécessiterait un suivi de position GPS live de
  l'agent, non implémenté côté backend.
- **Géolocalisation live des agents** sur l'écran "Équipe" — `latitude`/
  `longitude` sur `/team/agents` renvoient `null` (voir README backend).

## Backend enrichi en contrepartie

Plutôt que d'appauvrir les dashboards déjà construits (riches par rôle),
le backend a été enrichi pour fournir exactement les champs attendus par
`CitizenDashboardModel`, `AgentDashboardModel` et `TeamLeaderDashboardModel`
tels que définis dans ce projet mobile — voir le README backend, section
"Contrat de données avec l'app Flutter", pour le détail des agrégations
ajoutées (`resolutionRate`, `agentLoad[]`, `weeklyTrend[]`, etc.).

## Non validé dans cet environnement de génération

Aucun SDK Flutter/Dart n'était disponible dans le bac à sable où ce code a
été écrit — je n'ai donc pas pu exécuter `flutter pub get`, `build_runner`,
ni `flutter analyze` pour une validation de bout en bout. Le code a été
relu et vérifié statiquement (résolution de tous les imports relatifs,
cohérence des noms de classes/champs entre modèles et écrans) sans
problème détecté, mais lancez `flutter analyze` en local après
`build_runner` pour attraper toute erreur résiduelle — je corrigerai
rapidement si vous en trouvez.
