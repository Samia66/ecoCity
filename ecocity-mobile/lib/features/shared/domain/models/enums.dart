import 'package:json_annotation/json_annotation.dart';

/// ---------------------------------------------------------------------------
/// REPORT STATUS
/// ---------------------------------------------------------------------------

@JsonEnum(valueField: 'value')
enum ReportStatus {
  nouveau('NOUVEAU', 'Nouveau'),
  enAttente('EN_ATTENTE', 'En attente'),
  valide('VALIDE', 'Validé'),
  assigne('ASSIGNE', 'Assigné'),
  enCours('EN_COURS', 'En cours'),
  resolu('RESOLU', 'Résolu'),
  rejete('REJETE', 'Rejeté'),
  archive('ARCHIVE', 'Archivé');

  const ReportStatus(this.value, this.label);

  /// Valeur envoyée/reçue par l'API.
  final String value;

  /// Libellé affiché dans l'application.
  final String label;

  /// Libellé simplifié pour le citoyen.
  String get citizenLabel {
    switch (this) {
      case ReportStatus.nouveau:
      case ReportStatus.enAttente:
      case ReportStatus.valide:
        return 'En attente';

      case ReportStatus.assigne:
      case ReportStatus.enCours:
        return 'En cours';

      case ReportStatus.resolu:
        return 'Résolu';

      case ReportStatus.rejete:
        return 'Rejeté';

      case ReportStatus.archive:
        return 'Archivé';
    }
  }

  static ReportStatus fromString(String raw) {
    return ReportStatus.values.firstWhere(
      (status) => status.value == raw,
      orElse: () => ReportStatus.nouveau,
    );
  }
}

/// ---------------------------------------------------------------------------
/// REPORT PRIORITY
/// ---------------------------------------------------------------------------

@JsonEnum(valueField: 'value')
enum ReportPriority {
  basse('BASSE', 'Basse'),
  moyenne('MOYENNE', 'Moyenne'),
  haute('HAUTE', 'Haute'),
  critique('CRITIQUE', 'Critique');

  const ReportPriority(this.value, this.label);

  /// Valeur envoyée/reçue par l'API.
  final String value;

  /// Libellé affiché dans l'application.
  final String label;

  static ReportPriority fromString(String raw) {
    return ReportPriority.values.firstWhere(
      (priority) => priority.value == raw,
      orElse: () => ReportPriority.moyenne,
    );
  }
}

/// ---------------------------------------------------------------------------
/// INTERVENTION STATUS
/// ---------------------------------------------------------------------------

@JsonEnum(valueField: 'value')
enum InterventionStatus {
  assignee('ASSIGNEE', 'Assignée'),
  acceptee('ACCEPTEE', 'Acceptée'),
  enCours('EN_COURS', 'En cours'),
  terminee('TERMINEE', 'Terminée'),
  rejetee('REJETEE', 'Rejetée'),
  annulee('ANNULEE', 'Annulée');

  const InterventionStatus(this.value, this.label);

  /// Valeur envoyée/reçue par l'API.
  final String value;

  /// Libellé affiché dans l'application.
  final String label;

  static InterventionStatus fromString(String raw) {
    return InterventionStatus.values.firstWhere(
      (status) => status.value == raw,
      orElse: () => InterventionStatus.assignee,
    );
  }
}

/// ---------------------------------------------------------------------------
/// DAY OF WEEK (planning de collecte)
/// ---------------------------------------------------------------------------

@JsonEnum(valueField: 'value')
enum DayOfWeek {
  lundi('LUNDI', 'Lundi'),
  mardi('MARDI', 'Mardi'),
  mercredi('MERCREDI', 'Mercredi'),
  jeudi('JEUDI', 'Jeudi'),
  vendredi('VENDREDI', 'Vendredi'),
  samedi('SAMEDI', 'Samedi'),
  dimanche('DIMANCHE', 'Dimanche');

  const DayOfWeek(this.value, this.label);

  /// Valeur envoyée/reçue par l'API.
  final String value;

  /// Libellé affiché dans l'application.
  final String label;

  static DayOfWeek fromString(String raw) {
    return DayOfWeek.values.firstWhere(
      (day) => day.value == raw,
      orElse: () => DayOfWeek.lundi,
    );
  }
}

/// ---------------------------------------------------------------------------
/// COLLECTION STATUS (mission de collecte)
/// ---------------------------------------------------------------------------

@JsonEnum(valueField: 'value')
enum CollectionStatus {
  planifiee('PLANIFIEE', 'Planifiée'),
  enCours('EN_COURS', 'En cours'),
  terminee('TERMINEE', 'Terminée'),
  annulee('ANNULEE', 'Annulée'),
  nonEffectuee('NON_EFFECTUEE', 'Non effectuée');

  const CollectionStatus(this.value, this.label);

  /// Valeur envoyée/reçue par l'API.
  final String value;

  /// Libellé affiché dans l'application.
  final String label;

  static CollectionStatus fromString(String raw) {
    return CollectionStatus.values.firstWhere(
      (status) => status.value == raw,
      orElse: () => CollectionStatus.planifiee,
    );
  }
}