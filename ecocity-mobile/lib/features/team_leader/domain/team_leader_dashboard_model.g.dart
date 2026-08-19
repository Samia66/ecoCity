// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_leader_dashboard_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$TeamLeaderDashboardModelImpl _$$TeamLeaderDashboardModelImplFromJson(
  Map<String, dynamic> json,
) => _$TeamLeaderDashboardModelImpl(
  activeAgents: (json['activeAgents'] as num).toInt(),
  availableAgents: (json['availableAgents'] as num).toInt(),
  unassignedCount: (json['unassignedCount'] as num).toInt(),
  criticalCount: (json['criticalCount'] as num).toInt(),
  lateCount: (json['lateCount'] as num).toInt(),
  resolutionRate: (json['resolutionRate'] as num).toDouble(),
  statusBreakdown:
      (json['statusBreakdown'] as List<dynamic>?)
          ?.map((e) => StatusBreakdownEntry.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  agentLoad:
      (json['agentLoad'] as List<dynamic>?)
          ?.map((e) => AgentLoadEntry.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  weeklyTrend:
      (json['weeklyTrend'] as List<dynamic>?)
          ?.map((e) => WeeklyTrendEntry.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
);

Map<String, dynamic> _$$TeamLeaderDashboardModelImplToJson(
  _$TeamLeaderDashboardModelImpl instance,
) => <String, dynamic>{
  'activeAgents': instance.activeAgents,
  'availableAgents': instance.availableAgents,
  'unassignedCount': instance.unassignedCount,
  'criticalCount': instance.criticalCount,
  'lateCount': instance.lateCount,
  'resolutionRate': instance.resolutionRate,
  'statusBreakdown': instance.statusBreakdown,
  'agentLoad': instance.agentLoad,
  'weeklyTrend': instance.weeklyTrend,
};

_$StatusBreakdownEntryImpl _$$StatusBreakdownEntryImplFromJson(
  Map<String, dynamic> json,
) => _$StatusBreakdownEntryImpl(
  status: json['status'] as String,
  count: (json['count'] as num).toInt(),
);

Map<String, dynamic> _$$StatusBreakdownEntryImplToJson(
  _$StatusBreakdownEntryImpl instance,
) => <String, dynamic>{'status': instance.status, 'count': instance.count};

_$AgentLoadEntryImpl _$$AgentLoadEntryImplFromJson(Map<String, dynamic> json) =>
    _$AgentLoadEntryImpl(
      agentName: json['agentName'] as String,
      assignedCount: (json['assignedCount'] as num).toInt(),
    );

Map<String, dynamic> _$$AgentLoadEntryImplToJson(
  _$AgentLoadEntryImpl instance,
) => <String, dynamic>{
  'agentName': instance.agentName,
  'assignedCount': instance.assignedCount,
};

_$WeeklyTrendEntryImpl _$$WeeklyTrendEntryImplFromJson(
  Map<String, dynamic> json,
) => _$WeeklyTrendEntryImpl(
  weekLabel: json['weekLabel'] as String,
  resolvedCount: (json['resolvedCount'] as num).toInt(),
);

Map<String, dynamic> _$$WeeklyTrendEntryImplToJson(
  _$WeeklyTrendEntryImpl instance,
) => <String, dynamic>{
  'weekLabel': instance.weekLabel,
  'resolvedCount': instance.resolvedCount,
};
