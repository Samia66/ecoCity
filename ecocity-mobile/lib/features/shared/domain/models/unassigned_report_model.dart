import 'package:freezed_annotation/freezed_annotation.dart';
import 'enums.dart';

part 'unassigned_report_model.freezed.dart';
part 'unassigned_report_model.g.dart';

/// Correspond à `UnassignedReportDto` renvoyé par
/// `GET /interventions/unassigned` — un signalement validé qui n'a pas
/// encore d'intervention/agent associé.
@freezed
class UnassignedReportModel with _$UnassignedReportModel {
  const factory UnassignedReportModel({
    required String reportId,
    required String title,
    required String category,
    required ReportPriority priority,
    required String address,
    required DateTime createdAt,
  }) = _UnassignedReportModel;

  factory UnassignedReportModel.fromJson(Map<String, dynamic> json) =>
      _$UnassignedReportModelFromJson(json);
}
