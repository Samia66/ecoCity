// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'unassigned_report_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UnassignedReportModelImpl _$$UnassignedReportModelImplFromJson(
  Map<String, dynamic> json,
) => _$UnassignedReportModelImpl(
  reportId: json['reportId'] as String,
  title: json['title'] as String,
  category: json['category'] as String,
  priority: $enumDecode(_$ReportPriorityEnumMap, json['priority']),
  address: json['address'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$$UnassignedReportModelImplToJson(
  _$UnassignedReportModelImpl instance,
) => <String, dynamic>{
  'reportId': instance.reportId,
  'title': instance.title,
  'category': instance.category,
  'priority': _$ReportPriorityEnumMap[instance.priority]!,
  'address': instance.address,
  'createdAt': instance.createdAt.toIso8601String(),
};

const _$ReportPriorityEnumMap = {
  ReportPriority.basse: 'BASSE',
  ReportPriority.moyenne: 'MOYENNE',
  ReportPriority.haute: 'HAUTE',
  ReportPriority.critique: 'CRITIQUE',
};
