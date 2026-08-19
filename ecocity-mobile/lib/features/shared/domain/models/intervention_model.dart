import 'package:freezed_annotation/freezed_annotation.dart';
import 'enums.dart';

part 'intervention_model.freezed.dart';
part 'intervention_model.g.dart';

/// Correspond exactement à `InterventionDto` renvoyé par le backend
/// (`GET /interventions/me`, `GET /interventions/:id`, etc.) — structure
/// plate, pas de `ReportModel` imbriqué.
@freezed
class InterventionModel with _$InterventionModel {
  const factory InterventionModel({
    required String id,
    required String reportId,
    required String reportTitle,
    required ReportStatus reportStatus,
    required String category,
    required String assignedAgent,
    required String assignedAgentId,
    required InterventionStatus status,
    required String statusLabel,
    double? latitude,
    double? longitude,
    required String address,
    DateTime? startedAt,
    DateTime? completedAt,
    required DateTime createdAt,
    @Default([]) List<InterventionAttachment> attachments,
    @Default([]) List<InterventionComment> comments,
    @Default([]) List<InterventionHistoryEntry> history,
  }) = _InterventionModel;

  factory InterventionModel.fromJson(Map<String, dynamic> json) =>
      _$InterventionModelFromJson(json);
}

@freezed
class InterventionAttachment with _$InterventionAttachment {
  const factory InterventionAttachment({
    required String id,
    required String url,
    required String filename,
    required String phase, // AVANT | APRES
  }) = _InterventionAttachment;

  factory InterventionAttachment.fromJson(Map<String, dynamic> json) =>
      _$InterventionAttachmentFromJson(json);
}

@freezed
class InterventionComment with _$InterventionComment {
  const factory InterventionComment({
    required String id,
    required String author,
    required String message,
    required DateTime createdAt,
  }) = _InterventionComment;

  factory InterventionComment.fromJson(Map<String, dynamic> json) =>
      _$InterventionCommentFromJson(json);
}

@freezed
class InterventionHistoryEntry with _$InterventionHistoryEntry {
  const factory InterventionHistoryEntry({
    required InterventionStatus status,
    String? comment,
    required String changedBy,
    required DateTime changedAt,
  }) = _InterventionHistoryEntry;

  factory InterventionHistoryEntry.fromJson(Map<String, dynamic> json) =>
      _$InterventionHistoryEntryFromJson(json);
}

/// Vue légère d'un agent, utilisée par les écrans TEAM_LEADER
/// (`/team/agents`). Ne provient pas d'un seul endpoint unique : construite
/// côté app à partir de `UserItemDto` (backend) + charge de travail.
@freezed
class AgentSummaryModel with _$AgentSummaryModel {
  const factory AgentSummaryModel({
    required String id,
    required String firstName,
    required String lastName,
    @Default(true) bool isOnline,
    @Default(0) int assignedCount,
    @Default(0) int inProgressCount,
    @Default(0) double averageResolutionMinutes,
    double? latitude,
    double? longitude,
    String? phone,
  }) = _AgentSummaryModel;

  const AgentSummaryModel._();

  String get fullName => '$firstName $lastName';

  factory AgentSummaryModel.fromJson(Map<String, dynamic> json) =>
      _$AgentSummaryModelFromJson(json);
}
