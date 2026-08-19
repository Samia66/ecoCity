import 'package:freezed_annotation/freezed_annotation.dart';
import '../../shared/domain/models/intervention_model.dart';

part 'agent_dashboard_model.freezed.dart';
part 'agent_dashboard_model.g.dart';

/// Matches GET /dashboard/agent
@freezed
class AgentDashboardModel with _$AgentDashboardModel {
  const factory AgentDashboardModel({
    required int assignedCount,
    required int inProgressCount,
    required int urgentCount,
    required int resolvedTodayCount,
    required double averageResolutionMinutes,
    @Default([]) List<InterventionModel> upcoming,
    @Default([]) List<InterventionModel> recentUpdates,
  }) = _AgentDashboardModel;

  factory AgentDashboardModel.fromJson(Map<String, dynamic> json) =>
      _$AgentDashboardModelFromJson(json);
}
