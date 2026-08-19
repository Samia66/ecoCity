import 'package:freezed_annotation/freezed_annotation.dart';

part 'team_leader_dashboard_model.freezed.dart';
part 'team_leader_dashboard_model.g.dart';

/// Matches GET /dashboard/team-leader
@freezed
class TeamLeaderDashboardModel with _$TeamLeaderDashboardModel {
  const factory TeamLeaderDashboardModel({
    required int activeAgents,
    required int availableAgents,
    required int unassignedCount,
    required int criticalCount,
    required int lateCount,
    required double resolutionRate, // 0..1
    @Default([]) List<StatusBreakdownEntry> statusBreakdown,
    @Default([]) List<AgentLoadEntry> agentLoad,
    @Default([]) List<WeeklyTrendEntry> weeklyTrend,
  }) = _TeamLeaderDashboardModel;

  factory TeamLeaderDashboardModel.fromJson(Map<String, dynamic> json) =>
      _$TeamLeaderDashboardModelFromJson(json);
}

@freezed
class StatusBreakdownEntry with _$StatusBreakdownEntry {
  const factory StatusBreakdownEntry({
    required String status,
    required int count,
  }) = _StatusBreakdownEntry;

  factory StatusBreakdownEntry.fromJson(Map<String, dynamic> json) =>
      _$StatusBreakdownEntryFromJson(json);
}

@freezed
class AgentLoadEntry with _$AgentLoadEntry {
  const factory AgentLoadEntry({
    required String agentName,
    required int assignedCount,
  }) = _AgentLoadEntry;

  factory AgentLoadEntry.fromJson(Map<String, dynamic> json) =>
      _$AgentLoadEntryFromJson(json);
}

@freezed
class WeeklyTrendEntry with _$WeeklyTrendEntry {
  const factory WeeklyTrendEntry({
    required String weekLabel,
    required int resolvedCount,
  }) = _WeeklyTrendEntry;

  factory WeeklyTrendEntry.fromJson(Map<String, dynamic> json) =>
      _$WeeklyTrendEntryFromJson(json);
}
