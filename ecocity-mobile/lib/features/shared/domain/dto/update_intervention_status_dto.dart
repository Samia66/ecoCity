import 'package:freezed_annotation/freezed_annotation.dart';

part 'update_intervention_status_dto.freezed.dart';
part 'update_intervention_status_dto.g.dart';

/// Mirrors backend `UpdateInterventionStatusDto`.
/// Utilisé pour les actions AGENT : Accepter / Démarrer / Rejeter / Résoudre
/// (chaque action correspond à une valeur `status` différente, via le même
/// endpoint PATCH /interventions/:id/status).
///
/// Les photos avant/après ne transitent PAS par ce DTO : elles sont
/// envoyées séparément en multipart via
/// `POST /interventions/:id/photos/before` et `.../photos/after`
/// (voir `InterventionRepository.uploadPhoto`).
@freezed
class UpdateInterventionStatusDto with _$UpdateInterventionStatusDto {
  const factory UpdateInterventionStatusDto({
    required String status, // ASSIGNEE | ACCEPTEE | EN_COURS | TERMINEE | REJETEE | ANNULEE
    String? comment,
  }) = _UpdateInterventionStatusDto;

  factory UpdateInterventionStatusDto.fromJson(Map<String, dynamic> json) =>
      _$UpdateInterventionStatusDtoFromJson(json);
}
