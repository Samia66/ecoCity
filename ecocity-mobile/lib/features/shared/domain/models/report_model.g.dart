// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'report_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ReportModelImpl _$$ReportModelImplFromJson(Map<String, dynamic> json) =>
    _$ReportModelImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      category: json['category'] as String,
      categoryId: json['categoryId'] as String,
      priority: $enumDecode(_$ReportPriorityEnumMap, json['priority']),
      status: $enumDecode(_$ReportStatusEnumMap, json['status']),
      address: json['address'] as String,
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      attachments:
          (json['attachments'] as List<dynamic>?)
              ?.map((e) => ReportAttachment.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      createdBy: json['createdBy'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      history:
          (json['history'] as List<dynamic>?)
              ?.map(
                (e) => ReportHistoryEntry.fromJson(e as Map<String, dynamic>),
              )
              .toList() ??
          const [],
      comments:
          (json['comments'] as List<dynamic>?)
              ?.map((e) => ReportComment.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      interventionId: json['interventionId'] as String?,
      assignedTo: json['assignedTo'] as String?,
      assignedToId: json['assignedToId'] as String?,
      zoneId: json['zoneId'] as String?,
    );

Map<String, dynamic> _$$ReportModelImplToJson(_$ReportModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'category': instance.category,
      'categoryId': instance.categoryId,
      'priority': _$ReportPriorityEnumMap[instance.priority]!,
      'status': _$ReportStatusEnumMap[instance.status]!,
      'address': instance.address,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'attachments': instance.attachments,
      'createdBy': instance.createdBy,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'history': instance.history,
      'comments': instance.comments,
      'interventionId': instance.interventionId,
      'assignedTo': instance.assignedTo,
      'assignedToId': instance.assignedToId,
      'zoneId': instance.zoneId,
    };

const _$ReportPriorityEnumMap = {
  ReportPriority.basse: 'BASSE',
  ReportPriority.moyenne: 'MOYENNE',
  ReportPriority.haute: 'HAUTE',
  ReportPriority.critique: 'CRITIQUE',
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

_$ReportAttachmentImpl _$$ReportAttachmentImplFromJson(
  Map<String, dynamic> json,
) => _$ReportAttachmentImpl(
  id: json['id'] as String,
  url: json['url'] as String,
  filename: json['filename'] as String,
);

Map<String, dynamic> _$$ReportAttachmentImplToJson(
  _$ReportAttachmentImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'url': instance.url,
  'filename': instance.filename,
};

_$ReportHistoryEntryImpl _$$ReportHistoryEntryImplFromJson(
  Map<String, dynamic> json,
) => _$ReportHistoryEntryImpl(
  status: $enumDecode(_$ReportStatusEnumMap, json['status']),
  comment: json['comment'] as String?,
  changedBy: json['changedBy'] as String,
  changedAt: DateTime.parse(json['changedAt'] as String),
);

Map<String, dynamic> _$$ReportHistoryEntryImplToJson(
  _$ReportHistoryEntryImpl instance,
) => <String, dynamic>{
  'status': _$ReportStatusEnumMap[instance.status]!,
  'comment': instance.comment,
  'changedBy': instance.changedBy,
  'changedAt': instance.changedAt.toIso8601String(),
};

_$ReportCommentImpl _$$ReportCommentImplFromJson(Map<String, dynamic> json) =>
    _$ReportCommentImpl(
      id: json['id'] as String,
      author: json['author'] as String,
      message: json['message'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$ReportCommentImplToJson(_$ReportCommentImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'author': instance.author,
      'message': instance.message,
      'createdAt': instance.createdAt.toIso8601String(),
    };
