// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'citizen_dashboard_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CitizenDashboardModelImpl _$$CitizenDashboardModelImplFromJson(
  Map<String, dynamic> json,
) => _$CitizenDashboardModelImpl(
  total: (json['total'] as num).toInt(),
  pending: (json['pending'] as num).toInt(),
  inProgress: (json['inProgress'] as num).toInt(),
  resolved: (json['resolved'] as num).toInt(),
  lastReport: json['lastReport'] == null
      ? null
      : ReportModel.fromJson(json['lastReport'] as Map<String, dynamic>),
);

Map<String, dynamic> _$$CitizenDashboardModelImplToJson(
  _$CitizenDashboardModelImpl instance,
) => <String, dynamic>{
  'total': instance.total,
  'pending': instance.pending,
  'inProgress': instance.inProgress,
  'resolved': instance.resolved,
  'lastReport': instance.lastReport,
};
