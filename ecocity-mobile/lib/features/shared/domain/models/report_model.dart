import 'package:freezed_annotation/freezed_annotation.dart';
import 'enums.dart';

part 'report_model.freezed.dart';
part 'report_model.g.dart';

/// Correspond exactement à `ReportDto` renvoyé par le backend
/// (`GET /reports/me`, `GET /reports/:id`, etc.).
@freezed
class ReportModel with _$ReportModel {
  const factory ReportModel({
    required String id,
    required String title,
    required String description,
    required String category,
    required String categoryId,
    required ReportPriority priority,
    required ReportStatus status,
    required String address,
    double? latitude,
    double? longitude,
    @Default([]) List<ReportAttachment> attachments,
    required String createdBy,
    required DateTime createdAt,
    required DateTime updatedAt,
    @Default([]) List<ReportHistoryEntry> history,
    @Default([]) List<ReportComment> comments,
    String? interventionId,
    String? assignedTo,
    String? assignedToId,
    String? zoneId,
  }) = _ReportModel;

  const ReportModel._();

  /// Photo de couverture — première pièce jointe, s'il y en a une.
  String? get photoUrl => attachments.isEmpty ? null : attachments.first.url;

  factory ReportModel.fromJson(Map<String, dynamic> json) =>
      _$ReportModelFromJson(json);
}

@freezed
class ReportAttachment with _$ReportAttachment {
  const factory ReportAttachment({
    required String id,
    required String url,
    required String filename,
  }) = _ReportAttachment;

  factory ReportAttachment.fromJson(Map<String, dynamic> json) =>
      _$ReportAttachmentFromJson(json);
}

@freezed
class ReportHistoryEntry with _$ReportHistoryEntry {
  const factory ReportHistoryEntry({
    required ReportStatus status,
    String? comment,
    required String changedBy,
    required DateTime changedAt,
  }) = _ReportHistoryEntry;

  factory ReportHistoryEntry.fromJson(Map<String, dynamic> json) =>
      _$ReportHistoryEntryFromJson(json);
}

@freezed
class ReportComment with _$ReportComment {
  const factory ReportComment({
    required String id,
    required String author,
    required String message,
    required DateTime createdAt,
  }) = _ReportComment;

  factory ReportComment.fromJson(Map<String, dynamic> json) =>
      _$ReportCommentFromJson(json);
}
