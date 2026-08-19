import 'package:freezed_annotation/freezed_annotation.dart';

part 'assign_intervention_dto.freezed.dart';
part 'assign_intervention_dto.g.dart';

/// Mirrors backend `AssignInterventionDto`.
/// Used both for the initial affectation and for réaffectation by a
/// TEAM_LEADER (same DTO, same endpoint: POST /interventions/:id/assign).
@freezed
class AssignInterventionDto with _$AssignInterventionDto {
  const factory AssignInterventionDto({
    required String agentId,
  }) = _AssignInterventionDto;

  factory AssignInterventionDto.fromJson(Map<String, dynamic> json) =>
      _$AssignInterventionDtoFromJson(json);
}
