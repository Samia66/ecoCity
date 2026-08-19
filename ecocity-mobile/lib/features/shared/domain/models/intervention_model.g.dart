// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'intervention_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$InterventionModelImpl _$$InterventionModelImplFromJson(
  Map<String, dynamic> json,
) => _$InterventionModelImpl(
  id: json['id'] as String,
  reportId: json['reportId'] as String,
  reportTitle: json['reportTitle'] as String,
  reportStatus: $enumDecode(_$ReportStatusEnumMap, json['reportStatus']),
  category: json['category'] as String,
  assignedAgent: json['assignedAgent'] as String,
  assignedAgentId: json['assignedAgentId'] as String,
  status: $enumDecode(_$InterventionStatusEnumMap, json['status']),
  statusLabel: json['statusLabel'] as String,
  latitude: (json['latitude'] as num?)?.toDouble(),
  longitude: (json['longitude'] as num?)?.toDouble(),
  address: json['address'] as String,
  startedAt: json['startedAt'] == null
      ? null
      : DateTime.parse(json['startedAt'] as String),
  completedAt: json['completedAt'] == null
      ? null
      : DateTime.parse(json['completedAt'] as String),
  createdAt: DateTime.parse(json['createdAt'] as String),
  attachments:
      (json['attachments'] as List<dynamic>?)
          ?.map(
            (e) => InterventionAttachment.fromJson(e as Map<String, dynamic>),
          )
          .toList() ??
      const [],
  comments:
      (json['comments'] as List<dynamic>?)
          ?.map((e) => InterventionComment.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  history:
      (json['history'] as List<dynamic>?)
          ?.map(
            (e) => InterventionHistoryEntry.fromJson(e as Map<String, dynamic>),
          )
          .toList() ??
      const [],
);

Map<String, dynamic> _$$InterventionModelImplToJson(
  _$InterventionModelImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'reportId': instance.reportId,
  'reportTitle': instance.reportTitle,
  'reportStatus': _$ReportStatusEnumMap[instance.reportStatus]!,
  'category': instance.category,
  'assignedAgent': instance.assignedAgent,
  'assignedAgentId': instance.assignedAgentId,
  'status': _$InterventionStatusEnumMap[instance.status]!,
  'statusLabel': instance.statusLabel,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
  'address': instance.address,
  'startedAt': instance.startedAt?.toIso8601String(),
  'completedAt': instance.completedAt?.toIso8601String(),
  'createdAt': instance.createdAt.toIso8601String(),
  'attachments': instance.attachments,
  'comments': instance.comments,
  'history': instance.history,
};

const _$ReportStatusEnumMap = {
  ReportStatus.nouveau: 'NOUVEAU',
  ReportStatus.enAttente: 'EN_ATTENTE',
  ReportStatus.valide: 'VALIDE',
  ReportStatus.assigne: 'ASSIGNE',
  ReportStatus.enCours: 'EN_COURS',
  ReportStatus.resolu: 'RESOLU',
  ReportStatus.rejete: 'REJETE',
  ReportStatus.archive: 'ARCHIVE',
};

const _$InterventionStatusEnumMap = {
  InterventionStatus.assignee: 'ASSIGNEE',
  InterventionStatus.acceptee: 'ACCEPTEE',
  InterventionStatus.enCours: 'EN_COURS',
  InterventionStatus.terminee: 'TERMINEE',
  InterventionStatus.rejetee: 'REJETEE',
  InterventionStatus.annulee: 'ANNULEE',
};

_$InterventionAttachmentImpl _$$InterventionAttachmentImplFromJson(
  Map<String, dynamic> json,
) => _$InterventionAttachmentImpl(
  id: json['id'] as String,
  url: json['url'] as String,
  filename: json['filename'] as String,
  phase: json['phase'] as String,
);

Map<String, dynamic> _$$InterventionAttachmentImplToJson(
  _$InterventionAttachmentImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'url': instance.url,
  'filename': instance.filename,
  'phase': instance.phase,
};

_$InterventionCommentImpl _$$InterventionCommentImplFromJson(
  Map<String, dynamic> json,
) => _$InterventionCommentImpl(
  id: json['id'] as String,
  author: json['author'] as String,
  message: json['message'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$$InterventionCommentImplToJson(
  _$InterventionCommentImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'author': instance.author,
  'message': instance.message,
  'createdAt': instance.createdAt.toIso8601String(),
};

_$InterventionHistoryEntryImpl _$$InterventionHistoryEntryImplFromJson(
  Map<String, dynamic> json,
) => _$InterventionHistoryEntryImpl(
  status: $enumDecode(_$InterventionStatusEnumMap, json['status']),
  comment: json['comment'] as String?,
  changedBy: json['changedBy'] as String,
  changedAt: DateTime.parse(json['changedAt'] as String),
);

Map<String, dynamic> _$$InterventionHistoryEntryImplToJson(
  _$InterventionHistoryEntryImpl instance,
) => <String, dynamic>{
  'status': _$InterventionStatusEnumMap[instance.status]!,
  'comment': instance.comment,
  'changedBy': instance.changedBy,
  'changedAt': instance.changedAt.toIso8601String(),
};

_$AgentSummaryModelImpl _$$AgentSummaryModelImplFromJson(
  Map<String, dynamic> json,
) => _$AgentSummaryModelImpl(
  id: json['id'] as String,
  firstName: json['firstName'] as String,
  lastName: json['lastName'] as String,
  isOnline: json['isOnline'] as bool? ?? true,
  assignedCount: (json['assignedCount'] as num?)?.toInt() ?? 0,
  inProgressCount: (json['inProgressCount'] as num?)?.toInt() ?? 0,
  averageResolutionMinutes:
      (json['averageResolutionMinutes'] as num?)?.toDouble() ?? 0,
  latitude: (json['latitude'] as num?)?.toDouble(),
  longitude: (json['longitude'] as num?)?.toDouble(),
  phone: json['phone'] as String?,
);

Map<String, dynamic> _$$AgentSummaryModelImplToJson(
  _$AgentSummaryModelImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'firstName': instance.firstName,
  'lastName': instance.lastName,
  'isOnline': instance.isOnline,
  'assignedCount': instance.assignedCount,
  'inProgressCount': instance.inProgressCount,
  'averageResolutionMinutes': instance.averageResolutionMinutes,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
  'phone': instance.phone,
};
