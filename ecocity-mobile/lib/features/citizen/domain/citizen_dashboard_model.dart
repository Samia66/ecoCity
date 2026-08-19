import 'package:freezed_annotation/freezed_annotation.dart';
import '../../shared/domain/models/report_model.dart';

part 'citizen_dashboard_model.freezed.dart';
part 'citizen_dashboard_model.g.dart';

/// Matches GET /dashboard/citizen
@freezed
class CitizenDashboardModel with _$CitizenDashboardModel {
  const factory CitizenDashboardModel({
    required int total,
    required int pending,
    required int inProgress,
    required int resolved,
    ReportModel? lastReport,
  }) = _CitizenDashboardModel;

  factory CitizenDashboardModel.fromJson(Map<String, dynamic> json) =>
      _$CitizenDashboardModelFromJson(json);
}
