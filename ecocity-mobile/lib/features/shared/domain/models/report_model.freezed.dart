// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'report_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

ReportModel _$ReportModelFromJson(Map<String, dynamic> json) {
  return _ReportModel.fromJson(json);
}

/// @nodoc
mixin _$ReportModel {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  String get category => throw _privateConstructorUsedError;
  String get categoryId => throw _privateConstructorUsedError;
  ReportPriority get priority => throw _privateConstructorUsedError;
  ReportStatus get status => throw _privateConstructorUsedError;
  String get address => throw _privateConstructorUsedError;
  double? get latitude => throw _privateConstructorUsedError;
  double? get longitude => throw _privateConstructorUsedError;
  List<ReportAttachment> get attachments => throw _privateConstructorUsedError;
  String get createdBy => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;
  List<ReportHistoryEntry> get history => throw _privateConstructorUsedError;
  List<ReportComment> get comments => throw _privateConstructorUsedError;
  String? get interventionId => throw _privateConstructorUsedError;
  String? get assignedTo => throw _privateConstructorUsedError;
  String? get assignedToId => throw _privateConstructorUsedError;
  String? get zoneId => throw _privateConstructorUsedError;

  /// Serializes this ReportModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ReportModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ReportModelCopyWith<ReportModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ReportModelCopyWith<$Res> {
  factory $ReportModelCopyWith(
    ReportModel value,
    $Res Function(ReportModel) then,
  ) = _$ReportModelCopyWithImpl<$Res, ReportModel>;
  @useResult
  $Res call({
    String id,
    String title,
    String description,
    String category,
    String categoryId,
    ReportPriority priority,
    ReportStatus status,
    String address,
    double? latitude,
    double? longitude,
    List<ReportAttachment> attachments,
    String createdBy,
    DateTime createdAt,
    DateTime updatedAt,
    List<ReportHistoryEntry> history,
    List<ReportComment> comments,
    String? interventionId,
    String? assignedTo,
    String? assignedToId,
    String? zoneId,
  });
}

/// @nodoc
class _$ReportModelCopyWithImpl<$Res, $Val extends ReportModel>
    implements $ReportModelCopyWith<$Res> {
  _$ReportModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ReportModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = null,
    Object? category = null,
    Object? categoryId = null,
    Object? priority = null,
    Object? status = null,
    Object? address = null,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? attachments = null,
    Object? createdBy = null,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? history = null,
    Object? comments = null,
    Object? interventionId = freezed,
    Object? assignedTo = freezed,
    Object? assignedToId = freezed,
    Object? zoneId = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            title: null == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String,
            description: null == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String,
            category: null == category
                ? _value.category
                : category // ignore: cast_nullable_to_non_nullable
                      as String,
            categoryId: null == categoryId
                ? _value.categoryId
                : categoryId // ignore: cast_nullable_to_non_nullable
                      as String,
            priority: null == priority
                ? _value.priority
                : priority // ignore: cast_nullable_to_non_nullable
                      as ReportPriority,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as ReportStatus,
            address: null == address
                ? _value.address
                : address // ignore: cast_nullable_to_non_nullable
                      as String,
            latitude: freezed == latitude
                ? _value.latitude
                : latitude // ignore: cast_nullable_to_non_nullable
                      as double?,
            longitude: freezed == longitude
                ? _value.longitude
                : longitude // ignore: cast_nullable_to_non_nullable
                      as double?,
            attachments: null == attachments
                ? _value.attachments
                : attachments // ignore: cast_nullable_to_non_nullable
                      as List<ReportAttachment>,
            createdBy: null == createdBy
                ? _value.createdBy
                : createdBy // ignore: cast_nullable_to_non_nullable
                      as String,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            updatedAt: null == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            history: null == history
                ? _value.history
                : history // ignore: cast_nullable_to_non_nullable
                      as List<ReportHistoryEntry>,
            comments: null == comments
                ? _value.comments
                : comments // ignore: cast_nullable_to_non_nullable
                      as List<ReportComment>,
            interventionId: freezed == interventionId
                ? _value.interventionId
                : interventionId // ignore: cast_nullable_to_non_nullable
                      as String?,
            assignedTo: freezed == assignedTo
                ? _value.assignedTo
                : assignedTo // ignore: cast_nullable_to_non_nullable
                      as String?,
            assignedToId: freezed == assignedToId
                ? _value.assignedToId
                : assignedToId // ignore: cast_nullable_to_non_nullable
                      as String?,
            zoneId: freezed == zoneId
                ? _value.zoneId
                : zoneId // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ReportModelImplCopyWith<$Res>
    implements $ReportModelCopyWith<$Res> {
  factory _$$ReportModelImplCopyWith(
    _$ReportModelImpl value,
    $Res Function(_$ReportModelImpl) then,
  ) = __$$ReportModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String title,
    String description,
    String category,
    String categoryId,
    ReportPriority priority,
    ReportStatus status,
    String address,
    double? latitude,
    double? longitude,
    List<ReportAttachment> attachments,
    String createdBy,
    DateTime createdAt,
    DateTime updatedAt,
    List<ReportHistoryEntry> history,
    List<ReportComment> comments,
    String? interventionId,
    String? assignedTo,
    String? assignedToId,
    String? zoneId,
  });
}

/// @nodoc
class __$$ReportModelImplCopyWithImpl<$Res>
    extends _$ReportModelCopyWithImpl<$Res, _$ReportModelImpl>
    implements _$$ReportModelImplCopyWith<$Res> {
  __$$ReportModelImplCopyWithImpl(
    _$ReportModelImpl _value,
    $Res Function(_$ReportModelImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ReportModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = null,
    Object? category = null,
    Object? categoryId = null,
    Object? priority = null,
    Object? status = null,
    Object? address = null,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? attachments = null,
    Object? createdBy = null,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? history = null,
    Object? comments = null,
    Object? interventionId = freezed,
    Object? assignedTo = freezed,
    Object? assignedToId = freezed,
    Object? zoneId = freezed,
  }) {
    return _then(
      _$ReportModelImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        title: null == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String,
        description: null == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String,
        category: null == category
            ? _value.category
            : category // ignore: cast_nullable_to_non_nullable
                  as String,
        categoryId: null == categoryId
            ? _value.categoryId
            : categoryId // ignore: cast_nullable_to_non_nullable
                  as String,
        priority: null == priority
            ? _value.priority
            : priority // ignore: cast_nullable_to_non_nullable
                  as ReportPriority,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as ReportStatus,
        address: null == address
            ? _value.address
            : address // ignore: cast_nullable_to_non_nullable
                  as String,
        latitude: freezed == latitude
            ? _value.latitude
            : latitude // ignore: cast_nullable_to_non_nullable
                  as double?,
        longitude: freezed == longitude
            ? _value.longitude
            : longitude // ignore: cast_nullable_to_non_nullable
                  as double?,
        attachments: null == attachments
            ? _value._attachments
            : attachments // ignore: cast_nullable_to_non_nullable
                  as List<ReportAttachment>,
        createdBy: null == createdBy
            ? _value.createdBy
            : createdBy // ignore: cast_nullable_to_non_nullable
                  as String,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        updatedAt: null == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        history: null == history
            ? _value._history
            : history // ignore: cast_nullable_to_non_nullable
                  as List<ReportHistoryEntry>,
        comments: null == comments
            ? _value._comments
            : comments // ignore: cast_nullable_to_non_nullable
                  as List<ReportComment>,
        interventionId: freezed == interventionId
            ? _value.interventionId
            : interventionId // ignore: cast_nullable_to_non_nullable
                  as String?,
        assignedTo: freezed == assignedTo
            ? _value.assignedTo
            : assignedTo // ignore: cast_nullable_to_non_nullable
                  as String?,
        assignedToId: freezed == assignedToId
            ? _value.assignedToId
            : assignedToId // ignore: cast_nullable_to_non_nullable
                  as String?,
        zoneId: freezed == zoneId
            ? _value.zoneId
            : zoneId // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ReportModelImpl extends _ReportModel {
  const _$ReportModelImpl({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.categoryId,
    required this.priority,
    required this.status,
    required this.address,
    this.latitude,
    this.longitude,
    final List<ReportAttachment> attachments = const [],
    required this.createdBy,
    required this.createdAt,
    required this.updatedAt,
    final List<ReportHistoryEntry> history = const [],
    final List<ReportComment> comments = const [],
    this.interventionId,
    this.assignedTo,
    this.assignedToId,
    this.zoneId,
  }) : _attachments = attachments,
       _history = history,
       _comments = comments,
       super._();

  factory _$ReportModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ReportModelImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String description;
  @override
  final String category;
  @override
  final String categoryId;
  @override
  final ReportPriority priority;
  @override
  final ReportStatus status;
  @override
  final String address;
  @override
  final double? latitude;
  @override
  final double? longitude;
  final List<ReportAttachment> _attachments;
  @override
  @JsonKey()
  List<ReportAttachment> get attachments {
    if (_attachments is EqualUnmodifiableListView) return _attachments;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_attachments);
  }

  @override
  final String createdBy;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;
  final List<ReportHistoryEntry> _history;
  @override
  @JsonKey()
  List<ReportHistoryEntry> get history {
    if (_history is EqualUnmodifiableListView) return _history;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_history);
  }

  final List<ReportComment> _comments;
  @override
  @JsonKey()
  List<ReportComment> get comments {
    if (_comments is EqualUnmodifiableListView) return _comments;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_comments);
  }

  @override
  final String? interventionId;
  @override
  final String? assignedTo;
  @override
  final String? assignedToId;
  @override
  final String? zoneId;

  @override
  String toString() {
    return 'ReportModel(id: $id, title: $title, description: $description, category: $category, categoryId: $categoryId, priority: $priority, status: $status, address: $address, latitude: $latitude, longitude: $longitude, attachments: $attachments, createdBy: $createdBy, createdAt: $createdAt, updatedAt: $updatedAt, history: $history, comments: $comments, interventionId: $interventionId, assignedTo: $assignedTo, assignedToId: $assignedToId, zoneId: $zoneId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ReportModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.categoryId, categoryId) ||
                other.categoryId == categoryId) &&
            (identical(other.priority, priority) ||
                other.priority == priority) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            const DeepCollectionEquality().equals(
              other._attachments,
              _attachments,
            ) &&
            (identical(other.createdBy, createdBy) ||
                other.createdBy == createdBy) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            const DeepCollectionEquality().equals(other._history, _history) &&
            const DeepCollectionEquality().equals(other._comments, _comments) &&
            (identical(other.interventionId, interventionId) ||
                other.interventionId == interventionId) &&
            (identical(other.assignedTo, assignedTo) ||
                other.assignedTo == assignedTo) &&
            (identical(other.assignedToId, assignedToId) ||
                other.assignedToId == assignedToId) &&
            (identical(other.zoneId, zoneId) || other.zoneId == zoneId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    title,
    description,
    category,
    categoryId,
    priority,
    status,
    address,
    latitude,
    longitude,
    const DeepCollectionEquality().hash(_attachments),
    createdBy,
    createdAt,
    updatedAt,
    const DeepCollectionEquality().hash(_history),
    const DeepCollectionEquality().hash(_comments),
    interventionId,
    assignedTo,
    assignedToId,
    zoneId,
  ]);

  /// Create a copy of ReportModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ReportModelImplCopyWith<_$ReportModelImpl> get copyWith =>
      __$$ReportModelImplCopyWithImpl<_$ReportModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ReportModelImplToJson(this);
  }
}

abstract class _ReportModel extends ReportModel {
  const factory _ReportModel({
    required final String id,
    required final String title,
    required final String description,
    required final String category,
    required final String categoryId,
    required final ReportPriority priority,
    required final ReportStatus status,
    required final String address,
    final double? latitude,
    final double? longitude,
    final List<ReportAttachment> attachments,
    required final String createdBy,
    required final DateTime createdAt,
    required final DateTime updatedAt,
    final List<ReportHistoryEntry> history,
    final List<ReportComment> comments,
    final String? interventionId,
    final String? assignedTo,
    final String? assignedToId,
    final String? zoneId,
  }) = _$ReportModelImpl;
  const _ReportModel._() : super._();

  factory _ReportModel.fromJson(Map<String, dynamic> json) =
      _$ReportModelImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String get description;
  @override
  String get category;
  @override
  String get categoryId;
  @override
  ReportPriority get priority;
  @override
  ReportStatus get status;
  @override
  String get address;
  @override
  double? get latitude;
  @override
  double? get longitude;
  @override
  List<ReportAttachment> get attachments;
  @override
  String get createdBy;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;
  @override
  List<ReportHistoryEntry> get history;
  @override
  List<ReportComment> get comments;
  @override
  String? get interventionId;
  @override
  String? get assignedTo;
  @override
  String? get assignedToId;
  @override
  String? get zoneId;

  /// Create a copy of ReportModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ReportModelImplCopyWith<_$ReportModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ReportAttachment _$ReportAttachmentFromJson(Map<String, dynamic> json) {
  return _ReportAttachment.fromJson(json);
}

/// @nodoc
mixin _$ReportAttachment {
  String get id => throw _privateConstructorUsedError;
  String get url => throw _privateConstructorUsedError;
  String get filename => throw _privateConstructorUsedError;

  /// Serializes this ReportAttachment to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ReportAttachment
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ReportAttachmentCopyWith<ReportAttachment> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ReportAttachmentCopyWith<$Res> {
  factory $ReportAttachmentCopyWith(
    ReportAttachment value,
    $Res Function(ReportAttachment) then,
  ) = _$ReportAttachmentCopyWithImpl<$Res, ReportAttachment>;
  @useResult
  $Res call({String id, String url, String filename});
}

/// @nodoc
class _$ReportAttachmentCopyWithImpl<$Res, $Val extends ReportAttachment>
    implements $ReportAttachmentCopyWith<$Res> {
  _$ReportAttachmentCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ReportAttachment
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? id = null, Object? url = null, Object? filename = null}) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            url: null == url
                ? _value.url
                : url // ignore: cast_nullable_to_non_nullable
                      as String,
            filename: null == filename
                ? _value.filename
                : filename // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ReportAttachmentImplCopyWith<$Res>
    implements $ReportAttachmentCopyWith<$Res> {
  factory _$$ReportAttachmentImplCopyWith(
    _$ReportAttachmentImpl value,
    $Res Function(_$ReportAttachmentImpl) then,
  ) = __$$ReportAttachmentImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String url, String filename});
}

/// @nodoc
class __$$ReportAttachmentImplCopyWithImpl<$Res>
    extends _$ReportAttachmentCopyWithImpl<$Res, _$ReportAttachmentImpl>
    implements _$$ReportAttachmentImplCopyWith<$Res> {
  __$$ReportAttachmentImplCopyWithImpl(
    _$ReportAttachmentImpl _value,
    $Res Function(_$ReportAttachmentImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ReportAttachment
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? id = null, Object? url = null, Object? filename = null}) {
    return _then(
      _$ReportAttachmentImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        url: null == url
            ? _value.url
            : url // ignore: cast_nullable_to_non_nullable
                  as String,
        filename: null == filename
            ? _value.filename
            : filename // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ReportAttachmentImpl implements _ReportAttachment {
  const _$ReportAttachmentImpl({
    required this.id,
    required this.url,
    required this.filename,
  });

  factory _$ReportAttachmentImpl.fromJson(Map<String, dynamic> json) =>
      _$$ReportAttachmentImplFromJson(json);

  @override
  final String id;
  @override
  final String url;
  @override
  final String filename;

  @override
  String toString() {
    return 'ReportAttachment(id: $id, url: $url, filename: $filename)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ReportAttachmentImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.url, url) || other.url == url) &&
            (identical(other.filename, filename) ||
                other.filename == filename));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, url, filename);

  /// Create a copy of ReportAttachment
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ReportAttachmentImplCopyWith<_$ReportAttachmentImpl> get copyWith =>
      __$$ReportAttachmentImplCopyWithImpl<_$ReportAttachmentImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$ReportAttachmentImplToJson(this);
  }
}

abstract class _ReportAttachment implements ReportAttachment {
  const factory _ReportAttachment({
    required final String id,
    required final String url,
    required final String filename,
  }) = _$ReportAttachmentImpl;

  factory _ReportAttachment.fromJson(Map<String, dynamic> json) =
      _$ReportAttachmentImpl.fromJson;

  @override
  String get id;
  @override
  String get url;
  @override
  String get filename;

  /// Create a copy of ReportAttachment
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ReportAttachmentImplCopyWith<_$ReportAttachmentImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ReportHistoryEntry _$ReportHistoryEntryFromJson(Map<String, dynamic> json) {
  return _ReportHistoryEntry.fromJson(json);
}

/// @nodoc
mixin _$ReportHistoryEntry {
  ReportStatus get status => throw _privateConstructorUsedError;
  String? get comment => throw _privateConstructorUsedError;
  String get changedBy => throw _privateConstructorUsedError;
  DateTime get changedAt => throw _privateConstructorUsedError;

  /// Serializes this ReportHistoryEntry to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ReportHistoryEntry
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ReportHistoryEntryCopyWith<ReportHistoryEntry> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ReportHistoryEntryCopyWith<$Res> {
  factory $ReportHistoryEntryCopyWith(
    ReportHistoryEntry value,
    $Res Function(ReportHistoryEntry) then,
  ) = _$ReportHistoryEntryCopyWithImpl<$Res, ReportHistoryEntry>;
  @useResult
  $Res call({
    ReportStatus status,
    String? comment,
    String changedBy,
    DateTime changedAt,
  });
}

/// @nodoc
class _$ReportHistoryEntryCopyWithImpl<$Res, $Val extends ReportHistoryEntry>
    implements $ReportHistoryEntryCopyWith<$Res> {
  _$ReportHistoryEntryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ReportHistoryEntry
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? status = null,
    Object? comment = freezed,
    Object? changedBy = null,
    Object? changedAt = null,
  }) {
    return _then(
      _value.copyWith(
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as ReportStatus,
            comment: freezed == comment
                ? _value.comment
                : comment // ignore: cast_nullable_to_non_nullable
                      as String?,
            changedBy: null == changedBy
                ? _value.changedBy
                : changedBy // ignore: cast_nullable_to_non_nullable
                      as String,
            changedAt: null == changedAt
                ? _value.changedAt
                : changedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ReportHistoryEntryImplCopyWith<$Res>
    implements $ReportHistoryEntryCopyWith<$Res> {
  factory _$$ReportHistoryEntryImplCopyWith(
    _$ReportHistoryEntryImpl value,
    $Res Function(_$ReportHistoryEntryImpl) then,
  ) = __$$ReportHistoryEntryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    ReportStatus status,
    String? comment,
    String changedBy,
    DateTime changedAt,
  });
}

/// @nodoc
class __$$ReportHistoryEntryImplCopyWithImpl<$Res>
    extends _$ReportHistoryEntryCopyWithImpl<$Res, _$ReportHistoryEntryImpl>
    implements _$$ReportHistoryEntryImplCopyWith<$Res> {
  __$$ReportHistoryEntryImplCopyWithImpl(
    _$ReportHistoryEntryImpl _value,
    $Res Function(_$ReportHistoryEntryImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ReportHistoryEntry
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? status = null,
    Object? comment = freezed,
    Object? changedBy = null,
    Object? changedAt = null,
  }) {
    return _then(
      _$ReportHistoryEntryImpl(
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as ReportStatus,
        comment: freezed == comment
            ? _value.comment
            : comment // ignore: cast_nullable_to_non_nullable
                  as String?,
        changedBy: null == changedBy
            ? _value.changedBy
            : changedBy // ignore: cast_nullable_to_non_nullable
                  as String,
        changedAt: null == changedAt
            ? _value.changedAt
            : changedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ReportHistoryEntryImpl implements _ReportHistoryEntry {
  const _$ReportHistoryEntryImpl({
    required this.status,
    this.comment,
    required this.changedBy,
    required this.changedAt,
  });

  factory _$ReportHistoryEntryImpl.fromJson(Map<String, dynamic> json) =>
      _$$ReportHistoryEntryImplFromJson(json);

  @override
  final ReportStatus status;
  @override
  final String? comment;
  @override
  final String changedBy;
  @override
  final DateTime changedAt;

  @override
  String toString() {
    return 'ReportHistoryEntry(status: $status, comment: $comment, changedBy: $changedBy, changedAt: $changedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ReportHistoryEntryImpl &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.comment, comment) || other.comment == comment) &&
            (identical(other.changedBy, changedBy) ||
                other.changedBy == changedBy) &&
            (identical(other.changedAt, changedAt) ||
                other.changedAt == changedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, status, comment, changedBy, changedAt);

  /// Create a copy of ReportHistoryEntry
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ReportHistoryEntryImplCopyWith<_$ReportHistoryEntryImpl> get copyWith =>
      __$$ReportHistoryEntryImplCopyWithImpl<_$ReportHistoryEntryImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$ReportHistoryEntryImplToJson(this);
  }
}

abstract class _ReportHistoryEntry implements ReportHistoryEntry {
  const factory _ReportHistoryEntry({
    required final ReportStatus status,
    final String? comment,
    required final String changedBy,
    required final DateTime changedAt,
  }) = _$ReportHistoryEntryImpl;

  factory _ReportHistoryEntry.fromJson(Map<String, dynamic> json) =
      _$ReportHistoryEntryImpl.fromJson;

  @override
  ReportStatus get status;
  @override
  String? get comment;
  @override
  String get changedBy;
  @override
  DateTime get changedAt;

  /// Create a copy of ReportHistoryEntry
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ReportHistoryEntryImplCopyWith<_$ReportHistoryEntryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ReportComment _$ReportCommentFromJson(Map<String, dynamic> json) {
  return _ReportComment.fromJson(json);
}

/// @nodoc
mixin _$ReportComment {
  String get id => throw _privateConstructorUsedError;
  String get author => throw _privateConstructorUsedError;
  String get message => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;

  /// Serializes this ReportComment to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ReportComment
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ReportCommentCopyWith<ReportComment> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ReportCommentCopyWith<$Res> {
  factory $ReportCommentCopyWith(
    ReportComment value,
    $Res Function(ReportComment) then,
  ) = _$ReportCommentCopyWithImpl<$Res, ReportComment>;
  @useResult
  $Res call({String id, String author, String message, DateTime createdAt});
}

/// @nodoc
class _$ReportCommentCopyWithImpl<$Res, $Val extends ReportComment>
    implements $ReportCommentCopyWith<$Res> {
  _$ReportCommentCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ReportComment
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? author = null,
    Object? message = null,
    Object? createdAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            author: null == author
                ? _value.author
                : author // ignore: cast_nullable_to_non_nullable
                      as String,
            message: null == message
                ? _value.message
                : message // ignore: cast_nullable_to_non_nullable
                      as String,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ReportCommentImplCopyWith<$Res>
    implements $ReportCommentCopyWith<$Res> {
  factory _$$ReportCommentImplCopyWith(
    _$ReportCommentImpl value,
    $Res Function(_$ReportCommentImpl) then,
  ) = __$$ReportCommentImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String author, String message, DateTime createdAt});
}

/// @nodoc
class __$$ReportCommentImplCopyWithImpl<$Res>
    extends _$ReportCommentCopyWithImpl<$Res, _$ReportCommentImpl>
    implements _$$ReportCommentImplCopyWith<$Res> {
  __$$ReportCommentImplCopyWithImpl(
    _$ReportCommentImpl _value,
    $Res Function(_$ReportCommentImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ReportComment
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? author = null,
    Object? message = null,
    Object? createdAt = null,
  }) {
    return _then(
      _$ReportCommentImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        author: null == author
            ? _value.author
            : author // ignore: cast_nullable_to_non_nullable
                  as String,
        message: null == message
            ? _value.message
            : message // ignore: cast_nullable_to_non_nullable
                  as String,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ReportCommentImpl implements _ReportComment {
  const _$ReportCommentImpl({
    required this.id,
    required this.author,
    required this.message,
    required this.createdAt,
  });

  factory _$ReportCommentImpl.fromJson(Map<String, dynamic> json) =>
      _$$ReportCommentImplFromJson(json);

  @override
  final String id;
  @override
  final String author;
  @override
  final String message;
  @override
  final DateTime createdAt;

  @override
  String toString() {
    return 'ReportComment(id: $id, author: $author, message: $message, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ReportCommentImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.author, author) || other.author == author) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, author, message, createdAt);

  /// Create a copy of ReportComment
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ReportCommentImplCopyWith<_$ReportCommentImpl> get copyWith =>
      __$$ReportCommentImplCopyWithImpl<_$ReportCommentImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ReportCommentImplToJson(this);
  }
}

abstract class _ReportComment implements ReportComment {
  const factory _ReportComment({
    required final String id,
    required final String author,
    required final String message,
    required final DateTime createdAt,
  }) = _$ReportCommentImpl;

  factory _ReportComment.fromJson(Map<String, dynamic> json) =
      _$ReportCommentImpl.fromJson;

  @override
  String get id;
  @override
  String get author;
  @override
  String get message;
  @override
  DateTime get createdAt;

  /// Create a copy of ReportComment
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ReportCommentImplCopyWith<_$ReportCommentImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
