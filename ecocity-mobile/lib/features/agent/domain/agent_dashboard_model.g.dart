// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'agent_dashboard_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AgentDashboardModelImpl _$$AgentDashboardModelImplFromJson(
  Map<String, dynamic> json,
) => _$AgentDashboardModelImpl(
  assignedCount: (json['assignedCount'] as num).toInt(),
  inProgressCount: (json['inProgressCount'] as num).toInt(),
  urgentCount: (json['urgentCount'] as num).toInt(),
  resolvedTodayCount: (json['resolvedTodayCount'] as num).toInt(),
  averageResolutionMinutes: (json['averageResolutionMinutes'] as num)
      .toDouble(),
  upcoming:
      (json['upcoming'] as List<dynamic>?)
          ?.map((e) => InterventionModel.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  recentUpdates:
      (json['recentUpdates'] as List<dynamic>?)
          ?.map((e) => InterventionModel.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
);

Map<String, dynamic> _$$AgentDashboardModelImplToJson(
  _$AgentDashboardModelImpl instance,
) => <String, dynamic>{
  'assignedCount': instance.assignedCount,
  'inProgressCount': instance.inProgressCount,
  'urgentCount': instance.urgentCount,
  'resolvedTodayCount': instance.resolvedTodayCount,
  'averageResolutionMinutes': instance.averageResolutionMinutes,
  'upcoming': instance.upcoming,
  'recentUpdates': instance.recentUpdates,
};
