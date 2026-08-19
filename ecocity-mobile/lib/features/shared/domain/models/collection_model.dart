import 'package:freezed_annotation/freezed_annotation.dart';
import 'enums.dart';

part 'collection_model.freezed.dart';
part 'collection_model.g.dart';

/// Correspond exactement à `CollectionDto` renvoyé par le backend
/// (`GET /collections/today`, `GET /collections/my-team`, `GET /collections/:id`)
/// — une mission de collecte planifiée, appartenant à une équipe (pas à un
/// agent individuel).
@freezed
class CollectionModel with _$CollectionModel {
  const factory CollectionModel({
    required String id,
    required String teamId,
    required String teamName,
    required String zoneId,
    required String zoneName,
    required DateTime scheduledDate,
    required DayOfWeek dayOfWeek,
    required CollectionStatus status,
    required String statusLabel,
    DateTime? startedAt,
    DateTime? completedAt,
    String? comment,
    String? problemDescription,
    double? latitude,
    double? longitude,
    @Default([]) List<CollectionParticipant> participants,
    @Default([]) List<CollectionAttachment> attachments,
    @Default([]) List<CollectionHistoryEntry> history,
    required DateTime createdAt,
  }) = _CollectionModel;

  factory CollectionModel.fromJson(Map<String, dynamic> json) =>
      _$CollectionModelFromJson(json);
}

@freezed
class CollectionParticipant with _$CollectionParticipant {
  const factory CollectionParticipant({
    required String id,
    required String firstName,
    required String lastName,
    required String role, // LEADER | AGENT
  }) = _CollectionParticipant;

  const CollectionParticipant._();

  String get fullName => '$firstName $lastName';
  bool get isLeader => role == 'LEADER';

  factory CollectionParticipant.fromJson(Map<String, dynamic> json) =>
      _$CollectionParticipantFromJson(json);
}

@freezed
class CollectionAttachment with _$CollectionAttachment {
  const factory CollectionAttachment({
    required String id,
    required String url,
    required String filename,
  }) = _CollectionAttachment;

  factory CollectionAttachment.fromJson(Map<String, dynamic> json) =>
      _$CollectionAttachmentFromJson(json);
}

@freezed
class CollectionHistoryEntry with _$CollectionHistoryEntry {
  const factory CollectionHistoryEntry({
    required CollectionStatus status,
    String? comment,
    required String changedBy,
    required DateTime changedAt,
  }) = _CollectionHistoryEntry;

  factory CollectionHistoryEntry.fromJson(Map<String, dynamic> json) =>
      _$CollectionHistoryEntryFromJson(json);
}
