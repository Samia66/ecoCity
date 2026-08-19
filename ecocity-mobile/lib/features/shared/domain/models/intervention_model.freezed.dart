// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'intervention_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

InterventionModel _$InterventionModelFromJson(Map<String, dynamic> json) {
  return _InterventionModel.fromJson(json);
}

/// @nodoc
mixin _$InterventionModel {
  String get id => throw _privateConstructorUsedError;
  String get reportId => throw _privateConstructorUsedError;
  String get reportTitle => throw _privateConstructorUsedError;
  ReportStatus get reportStatus => throw _privateConstructorUsedError;
  String get category => throw _privateConstructorUsedError;
  String get assignedAgent => throw _privateConstructorUsedError;
  String get assignedAgentId => throw _privateConstructorUsedError;
  InterventionStatus get status => throw _privateConstructorUsedError;
  String get statusLabel => throw _privateConstructorUsedError;
  double? get latitude => throw _privateConstructorUsedError;
  double? get longitude => throw _privateConstructorUsedError;
  String get address => throw _privateConstructorUsedError;
  DateTime? get startedAt => throw _privateConstructorUsedError;
  DateTime? get completedAt => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  List<InterventionAttachment> get attachments =>
      throw _privateConstructorUsedError;
  List<InterventionComment> get comments => throw _privateConstructorUsedError;
  List<InterventionHistoryEntry> get history =>
      throw _privateConstructorUsedError;

  /// Serializes this InterventionModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InterventionModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InterventionModelCopyWith<InterventionModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InterventionModelCopyWith<$Res> {
  factory $InterventionModelCopyWith(
    InterventionModel value,
    $Res Function(InterventionModel) then,
  ) = _$InterventionModelCopyWithImpl<$Res, InterventionModel>;
  @useResult
  $Res call({
    String id,
    String reportId,
    String reportTitle,
    ReportStatus reportStatus,
    String category,
    String assignedAgent,
    String assignedAgentId,
    InterventionStatus status,
    String statusLabel,
    double? latitude,
    double? longitude,
    String address,
    DateTime? startedAt,
    DateTime? completedAt,
    DateTime createdAt,
    List<InterventionAttachment> attachments,
    List<InterventionComment> comments,
    List<InterventionHistoryEntry> history,
  });
}

/// @nodoc
class _$InterventionModelCopyWithImpl<$Res, $Val extends InterventionModel>
    implements $InterventionModelCopyWith<$Res> {
  _$InterventionModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InterventionModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? reportId = null,
    Object? reportTitle = null,
    Object? reportStatus = null,
    Object? category = null,
    Object? assignedAgent = null,
    Object? assignedAgentId = null,
    Object? status = null,
    Object? statusLabel = null,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? address = null,
    Object? startedAt = freezed,
    Object? completedAt = freezed,
    Object? createdAt = null,
    Object? attachments = null,
    Object? comments = null,
    Object? history = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            reportId: null == reportId
                ? _value.reportId
                : reportId // ignore: cast_nullable_to_non_nullable
                      as String,
            reportTitle: null == reportTitle
                ? _value.reportTitle
                : reportTitle // ignore: cast_nullable_to_non_nullable
                      as String,
            reportStatus: null == reportStatus
                ? _value.reportStatus
                : reportStatus // ignore: cast_nullable_to_non_nullable
                      as ReportStatus,
            category: null == category
                ? _value.category
                : category // ignore: cast_nullable_to_non_nullable
                      as String,
            assignedAgent: null == assignedAgent
                ? _value.assignedAgent
                : assignedAgent // ignore: cast_nullable_to_non_nullable
                      as String,
            assignedAgentId: null == assignedAgentId
                ? _value.assignedAgentId
                : assignedAgentId // ignore: cast_nullable_to_non_nullable
                      as String,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as InterventionStatus,
            statusLabel: null == statusLabel
                ? _value.statusLabel
                : statusLabel // ignore: cast_nullable_to_non_nullable
                      as String,
            latitude: freezed == latitude
                ? _value.latitude
                : latitude // ignore: cast_nullable_to_non_nullable
                      as double?,
            longitude: freezed == longitude
                ? _value.longitude
                : longitude // ignore: cast_nullable_to_non_nullable
                      as double?,
            address: null == address
                ? _value.address
                : address // ignore: cast_nullable_to_non_nullable
                      as String,
            startedAt: freezed == startedAt
                ? _value.startedAt
                : startedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            completedAt: freezed == completedAt
                ? _value.completedAt
                : completedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            attachments: null == attachments
                ? _value.attachments
                : attachments // ignore: cast_nullable_to_non_nullable
                      as List<InterventionAttachment>,
            comments: null == comments
                ? _value.comments
                : comments // ignore: cast_nullable_to_non_nullable
                      as List<InterventionComment>,
            history: null == history
                ? _value.history
                : history // ignore: cast_nullable_to_non_nullable
                      as List<InterventionHistoryEntry>,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$InterventionModelImplCopyWith<$Res>
    implements $InterventionModelCopyWith<$Res> {
  factory _$$InterventionModelImplCopyWith(
    _$InterventionModelImpl value,
    $Res Function(_$InterventionModelImpl) then,
  ) = __$$InterventionModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String reportId,
    String reportTitle,
    ReportStatus reportStatus,
    String category,
    String assignedAgent,
    String assignedAgentId,
    InterventionStatus status,
    String statusLabel,
    double? latitude,
    double? longitude,
    String address,
    DateTime? startedAt,
    DateTime? completedAt,
    DateTime createdAt,
    List<InterventionAttachment> attachments,
    List<InterventionComment> comments,
    List<InterventionHistoryEntry> history,
  });
}

/// @nodoc
class __$$InterventionModelImplCopyWithImpl<$Res>
    extends _$InterventionModelCopyWithImpl<$Res, _$InterventionModelImpl>
    implements _$$InterventionModelImplCopyWith<$Res> {
  __$$InterventionModelImplCopyWithImpl(
    _$InterventionModelImpl _value,
    $Res Function(_$InterventionModelImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of InterventionModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? reportId = null,
    Object? reportTitle = null,
    Object? reportStatus = null,
    Object? category = null,
    Object? assignedAgent = null,
    Object? assignedAgentId = null,
    Object? status = null,
    Object? statusLabel = null,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? address = null,
    Object? startedAt = freezed,
    Object? completedAt = freezed,
    Object? createdAt = null,
    Object? attachments = null,
    Object? comments = null,
    Object? history = null,
  }) {
    return _then(
      _$InterventionModelImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        reportId: null == reportId
            ? _value.reportId
            : reportId // ignore: cast_nullable_to_non_nullable
                  as String,
        reportTitle: null == reportTitle
            ? _value.reportTitle
            : reportTitle // ignore: cast_nullable_to_non_nullable
                  as String,
        reportStatus: null == reportStatus
            ? _value.reportStatus
            : reportStatus // ignore: cast_nullable_to_non_nullable
                  as ReportStatus,
        category: null == category
            ? _value.category
            : category // ignore: cast_nullable_to_non_nullable
                  as String,
        assignedAgent: null == assignedAgent
            ? _value.assignedAgent
            : assignedAgent // ignore: cast_nullable_to_non_nullable
                  as String,
        assignedAgentId: null == assignedAgentId
            ? _value.assignedAgentId
            : assignedAgentId // ignore: cast_nullable_to_non_nullable
                  as String,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as InterventionStatus,
        statusLabel: null == statusLabel
            ? _value.statusLabel
            : statusLabel // ignore: cast_nullable_to_non_nullable
                  as String,
        latitude: freezed == latitude
            ? _value.latitude
            : latitude // ignore: cast_nullable_to_non_nullable
                  as double?,
        longitude: freezed == longitude
            ? _value.longitude
            : longitude // ignore: cast_nullable_to_non_nullable
                  as double?,
        address: null == address
            ? _value.address
            : address // ignore: cast_nullable_to_non_nullable
                  as String,
        startedAt: freezed == startedAt
            ? _value.startedAt
            : startedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        completedAt: freezed == completedAt
            ? _value.completedAt
            : completedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        attachments: null == attachments
            ? _value._attachments
            : attachments // ignore: cast_nullable_to_non_nullable
                  as List<InterventionAttachment>,
        comments: null == comments
            ? _value._comments
            : comments // ignore: cast_nullable_to_non_nullable
                  as List<InterventionComment>,
        history: null == history
            ? _value._history
            : history // ignore: cast_nullable_to_non_nullable
                  as List<InterventionHistoryEntry>,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$InterventionModelImpl implements _InterventionModel {
  const _$InterventionModelImpl({
    required this.id,
    required this.reportId,
    required this.reportTitle,
    required this.reportStatus,
    required this.category,
    required this.assignedAgent,
    required this.assignedAgentId,
    required this.status,
    required this.statusLabel,
    this.latitude,
    this.longitude,
    required this.address,
    this.startedAt,
    this.completedAt,
    required this.createdAt,
    final List<InterventionAttachment> attachments = const [],
    final List<InterventionComment> comments = const [],
    final List<InterventionHistoryEntry> history = const [],
  }) : _attachments = attachments,
       _comments = comments,
       _history = history;

  factory _$InterventionModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$InterventionModelImplFromJson(json);

  @override
  final String id;
  @override
  final String reportId;
  @override
  final String reportTitle;
  @override
  final ReportStatus reportStatus;
  @override
  final String category;
  @override
  final String assignedAgent;
  @override
  final String assignedAgentId;
  @override
  final InterventionStatus status;
  @override
  final String statusLabel;
  @override
  final double? latitude;
  @override
  final double? longitude;
  @override
  final String address;
  @override
  final DateTime? startedAt;
  @override
  final DateTime? completedAt;
  @override
  final DateTime createdAt;
  final List<InterventionAttachment> _attachments;
  @override
  @JsonKey()
  List<InterventionAttachment> get attachments {
    if (_attachments is EqualUnmodifiableListView) return _attachments;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_attachments);
  }

  final List<InterventionComment> _comments;
  @override
  @JsonKey()
  List<InterventionComment> get comments {
    if (_comments is EqualUnmodifiableListView) return _comments;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_comments);
  }

  final List<InterventionHistoryEntry> _history;
  @override
  @JsonKey()
  List<InterventionHistoryEntry> get history {
    if (_history is EqualUnmodifiableListView) return _history;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_history);
  }

  @override
  String toString() {
    return 'InterventionModel(id: $id, reportId: $reportId, reportTitle: $reportTitle, reportStatus: $reportStatus, category: $category, assignedAgent: $assignedAgent, assignedAgentId: $assignedAgentId, status: $status, statusLabel: $statusLabel, latitude: $latitude, longitude: $longitude, address: $address, startedAt: $startedAt, completedAt: $completedAt, createdAt: $createdAt, attachments: $attachments, comments: $comments, history: $history)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InterventionModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.reportId, reportId) ||
                other.reportId == reportId) &&
            (identical(other.reportTitle, reportTitle) ||
                other.reportTitle == reportTitle) &&
            (identical(other.reportStatus, reportStatus) ||
                other.reportStatus == reportStatus) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.assignedAgent, assignedAgent) ||
                other.assignedAgent == assignedAgent) &&
            (identical(other.assignedAgentId, assignedAgentId) ||
                other.assignedAgentId == assignedAgentId) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.statusLabel, statusLabel) ||
                other.statusLabel == statusLabel) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.startedAt, startedAt) ||
                other.startedAt == startedAt) &&
            (identical(other.completedAt, completedAt) ||
                other.completedAt == completedAt) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            const DeepCollectionEquality().equals(
              other._attachments,
              _attachments,
            ) &&
            const DeepCollectionEquality().equals(other._comments, _comments) &&
            const DeepCollectionEquality().equals(other._history, _history));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    reportId,
    reportTitle,
    reportStatus,
    category,
    assignedAgent,
    assignedAgentId,
    status,
    statusLabel,
    latitude,
    longitude,
    address,
    startedAt,
    completedAt,
    createdAt,
    const DeepCollectionEquality().hash(_attachments),
    const DeepCollectionEquality().hash(_comments),
    const DeepCollectionEquality().hash(_history),
  );

  /// Create a copy of InterventionModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InterventionModelImplCopyWith<_$InterventionModelImpl> get copyWith =>
      __$$InterventionModelImplCopyWithImpl<_$InterventionModelImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$InterventionModelImplToJson(this);
  }
}

abstract class _InterventionModel implements InterventionModel {
  const factory _InterventionModel({
    required final String id,
    required final String reportId,
    required final String reportTitle,
    required final ReportStatus reportStatus,
    required final String category,
    required final String assignedAgent,
    required final String assignedAgentId,
    required final InterventionStatus status,
    required final String statusLabel,
    final double? latitude,
    final double? longitude,
    required final String address,
    final DateTime? startedAt,
    final DateTime? completedAt,
    required final DateTime createdAt,
    final List<InterventionAttachment> attachments,
    final List<InterventionComment> comments,
    final List<InterventionHistoryEntry> history,
  }) = _$InterventionModelImpl;

  factory _InterventionModel.fromJson(Map<String, dynamic> json) =
      _$InterventionModelImpl.fromJson;

  @override
  String get id;
  @override
  String get reportId;
  @override
  String get reportTitle;
  @override
  ReportStatus get reportStatus;
  @override
  String get category;
  @override
  String get assignedAgent;
  @override
  String get assignedAgentId;
  @override
  InterventionStatus get status;
  @override
  String get statusLabel;
  @override
  double? get latitude;
  @override
  double? get longitude;
  @override
  String get address;
  @override
  DateTime? get startedAt;
  @override
  DateTime? get completedAt;
  @override
  DateTime get createdAt;
  @override
  List<InterventionAttachment> get attachments;
  @override
  List<InterventionComment> get comments;
  @override
  List<InterventionHistoryEntry> get history;

  /// Create a copy of InterventionModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InterventionModelImplCopyWith<_$InterventionModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

InterventionAttachment _$InterventionAttachmentFromJson(
  Map<String, dynamic> json,
) {
  return _InterventionAttachment.fromJson(json);
}

/// @nodoc
mixin _$InterventionAttachment {
  String get id => throw _privateConstructorUsedError;
  String get url => throw _privateConstructorUsedError;
  String get filename => throw _privateConstructorUsedError;
  String get phase => throw _privateConstructorUsedError;

  /// Serializes this InterventionAttachment to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InterventionAttachment
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InterventionAttachmentCopyWith<InterventionAttachment> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InterventionAttachmentCopyWith<$Res> {
  factory $InterventionAttachmentCopyWith(
    InterventionAttachment value,
    $Res Function(InterventionAttachment) then,
  ) = _$InterventionAttachmentCopyWithImpl<$Res, InterventionAttachment>;
  @useResult
  $Res call({String id, String url, String filename, String phase});
}

/// @nodoc
class _$InterventionAttachmentCopyWithImpl<
  $Res,
  $Val extends InterventionAttachment
>
    implements $InterventionAttachmentCopyWith<$Res> {
  _$InterventionAttachmentCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InterventionAttachment
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? url = null,
    Object? filename = null,
    Object? phase = null,
  }) {
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
            phase: null == phase
                ? _value.phase
                : phase // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$InterventionAttachmentImplCopyWith<$Res>
    implements $InterventionAttachmentCopyWith<$Res> {
  factory _$$InterventionAttachmentImplCopyWith(
    _$InterventionAttachmentImpl value,
    $Res Function(_$InterventionAttachmentImpl) then,
  ) = __$$InterventionAttachmentImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String url, String filename, String phase});
}

/// @nodoc
class __$$InterventionAttachmentImplCopyWithImpl<$Res>
    extends
        _$InterventionAttachmentCopyWithImpl<$Res, _$InterventionAttachmentImpl>
    implements _$$InterventionAttachmentImplCopyWith<$Res> {
  __$$InterventionAttachmentImplCopyWithImpl(
    _$InterventionAttachmentImpl _value,
    $Res Function(_$InterventionAttachmentImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of InterventionAttachment
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? url = null,
    Object? filename = null,
    Object? phase = null,
  }) {
    return _then(
      _$InterventionAttachmentImpl(
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
        phase: null == phase
            ? _value.phase
            : phase // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$InterventionAttachmentImpl implements _InterventionAttachment {
  const _$InterventionAttachmentImpl({
    required this.id,
    required this.url,
    required this.filename,
    required this.phase,
  });

  factory _$InterventionAttachmentImpl.fromJson(Map<String, dynamic> json) =>
      _$$InterventionAttachmentImplFromJson(json);

  @override
  final String id;
  @override
  final String url;
  @override
  final String filename;
  @override
  final String phase;

  @override
  String toString() {
    return 'InterventionAttachment(id: $id, url: $url, filename: $filename, phase: $phase)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InterventionAttachmentImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.url, url) || other.url == url) &&
            (identical(other.filename, filename) ||
                other.filename == filename) &&
            (identical(other.phase, phase) || other.phase == phase));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, url, filename, phase);

  /// Create a copy of InterventionAttachment
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InterventionAttachmentImplCopyWith<_$InterventionAttachmentImpl>
  get copyWith =>
      __$$InterventionAttachmentImplCopyWithImpl<_$InterventionAttachmentImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$InterventionAttachmentImplToJson(this);
  }
}

abstract class _InterventionAttachment implements InterventionAttachment {
  const factory _InterventionAttachment({
    required final String id,
    required final String url,
    required final String filename,
    required final String phase,
  }) = _$InterventionAttachmentImpl;

  factory _InterventionAttachment.fromJson(Map<String, dynamic> json) =
      _$InterventionAttachmentImpl.fromJson;

  @override
  String get id;
  @override
  String get url;
  @override
  String get filename;
  @override
  String get phase;

  /// Create a copy of InterventionAttachment
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InterventionAttachmentImplCopyWith<_$InterventionAttachmentImpl>
  get copyWith => throw _privateConstructorUsedError;
}

InterventionComment _$InterventionCommentFromJson(Map<String, dynamic> json) {
  return _InterventionComment.fromJson(json);
}

/// @nodoc
mixin _$InterventionComment {
  String get id => throw _privateConstructorUsedError;
  String get author => throw _privateConstructorUsedError;
  String get message => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;

  /// Serializes this InterventionComment to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InterventionComment
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InterventionCommentCopyWith<InterventionComment> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InterventionCommentCopyWith<$Res> {
  factory $InterventionCommentCopyWith(
    InterventionComment value,
    $Res Function(InterventionComment) then,
  ) = _$InterventionCommentCopyWithImpl<$Res, InterventionComment>;
  @useResult
  $Res call({String id, String author, String message, DateTime createdAt});
}

/// @nodoc
class _$InterventionCommentCopyWithImpl<$Res, $Val extends InterventionComment>
    implements $InterventionCommentCopyWith<$Res> {
  _$InterventionCommentCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InterventionComment
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
abstract class _$$InterventionCommentImplCopyWith<$Res>
    implements $InterventionCommentCopyWith<$Res> {
  factory _$$InterventionCommentImplCopyWith(
    _$InterventionCommentImpl value,
    $Res Function(_$InterventionCommentImpl) then,
  ) = __$$InterventionCommentImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String author, String message, DateTime createdAt});
}

/// @nodoc
class __$$InterventionCommentImplCopyWithImpl<$Res>
    extends _$InterventionCommentCopyWithImpl<$Res, _$InterventionCommentImpl>
    implements _$$InterventionCommentImplCopyWith<$Res> {
  __$$InterventionCommentImplCopyWithImpl(
    _$InterventionCommentImpl _value,
    $Res Function(_$InterventionCommentImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of InterventionComment
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
      _$InterventionCommentImpl(
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
class _$InterventionCommentImpl implements _InterventionComment {
  const _$InterventionCommentImpl({
    required this.id,
    required this.author,
    required this.message,
    required this.createdAt,
  });

  factory _$InterventionCommentImpl.fromJson(Map<String, dynamic> json) =>
      _$$InterventionCommentImplFromJson(json);

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
    return 'InterventionComment(id: $id, author: $author, message: $message, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InterventionCommentImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.author, author) || other.author == author) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, author, message, createdAt);

  /// Create a copy of InterventionComment
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InterventionCommentImplCopyWith<_$InterventionCommentImpl> get copyWith =>
      __$$InterventionCommentImplCopyWithImpl<_$InterventionCommentImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$InterventionCommentImplToJson(this);
  }
}

abstract class _InterventionComment implements InterventionComment {
  const factory _InterventionComment({
    required final String id,
    required final String author,
    required final String message,
    required final DateTime createdAt,
  }) = _$InterventionCommentImpl;

  factory _InterventionComment.fromJson(Map<String, dynamic> json) =
      _$InterventionCommentImpl.fromJson;

  @override
  String get id;
  @override
  String get author;
  @override
  String get message;
  @override
  DateTime get createdAt;

  /// Create a copy of InterventionComment
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InterventionCommentImplCopyWith<_$InterventionCommentImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

InterventionHistoryEntry _$InterventionHistoryEntryFromJson(
  Map<String, dynamic> json,
) {
  return _InterventionHistoryEntry.fromJson(json);
}

/// @nodoc
mixin _$InterventionHistoryEntry {
  InterventionStatus get status => throw _privateConstructorUsedError;
  String? get comment => throw _privateConstructorUsedError;
  String get changedBy => throw _privateConstructorUsedError;
  DateTime get changedAt => throw _privateConstructorUsedError;

  /// Serializes this InterventionHistoryEntry to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InterventionHistoryEntry
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InterventionHistoryEntryCopyWith<InterventionHistoryEntry> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InterventionHistoryEntryCopyWith<$Res> {
  factory $InterventionHistoryEntryCopyWith(
    InterventionHistoryEntry value,
    $Res Function(InterventionHistoryEntry) then,
  ) = _$InterventionHistoryEntryCopyWithImpl<$Res, InterventionHistoryEntry>;
  @useResult
  $Res call({
    InterventionStatus status,
    String? comment,
    String changedBy,
    DateTime changedAt,
  });
}

/// @nodoc
class _$InterventionHistoryEntryCopyWithImpl<
  $Res,
  $Val extends InterventionHistoryEntry
>
    implements $InterventionHistoryEntryCopyWith<$Res> {
  _$InterventionHistoryEntryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InterventionHistoryEntry
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
                      as InterventionStatus,
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
abstract class _$$InterventionHistoryEntryImplCopyWith<$Res>
    implements $InterventionHistoryEntryCopyWith<$Res> {
  factory _$$InterventionHistoryEntryImplCopyWith(
    _$InterventionHistoryEntryImpl value,
    $Res Function(_$InterventionHistoryEntryImpl) then,
  ) = __$$InterventionHistoryEntryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    InterventionStatus status,
    String? comment,
    String changedBy,
    DateTime changedAt,
  });
}

/// @nodoc
class __$$InterventionHistoryEntryImplCopyWithImpl<$Res>
    extends
        _$InterventionHistoryEntryCopyWithImpl<
          $Res,
          _$InterventionHistoryEntryImpl
        >
    implements _$$InterventionHistoryEntryImplCopyWith<$Res> {
  __$$InterventionHistoryEntryImplCopyWithImpl(
    _$InterventionHistoryEntryImpl _value,
    $Res Function(_$InterventionHistoryEntryImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of InterventionHistoryEntry
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
      _$InterventionHistoryEntryImpl(
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as InterventionStatus,
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
class _$InterventionHistoryEntryImpl implements _InterventionHistoryEntry {
  const _$InterventionHistoryEntryImpl({
    required this.status,
    this.comment,
    required this.changedBy,
    required this.changedAt,
  });

  factory _$InterventionHistoryEntryImpl.fromJson(Map<String, dynamic> json) =>
      _$$InterventionHistoryEntryImplFromJson(json);

  @override
  final InterventionStatus status;
  @override
  final String? comment;
  @override
  final String changedBy;
  @override
  final DateTime changedAt;

  @override
  String toString() {
    return 'InterventionHistoryEntry(status: $status, comment: $comment, changedBy: $changedBy, changedAt: $changedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InterventionHistoryEntryImpl &&
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

  /// Create a copy of InterventionHistoryEntry
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InterventionHistoryEntryImplCopyWith<_$InterventionHistoryEntryImpl>
  get copyWith =>
      __$$InterventionHistoryEntryImplCopyWithImpl<
        _$InterventionHistoryEntryImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$InterventionHistoryEntryImplToJson(this);
  }
}

abstract class _InterventionHistoryEntry implements InterventionHistoryEntry {
  const factory _InterventionHistoryEntry({
    required final InterventionStatus status,
    final String? comment,
    required final String changedBy,
    required final DateTime changedAt,
  }) = _$InterventionHistoryEntryImpl;

  factory _InterventionHistoryEntry.fromJson(Map<String, dynamic> json) =
      _$InterventionHistoryEntryImpl.fromJson;

  @override
  InterventionStatus get status;
  @override
  String? get comment;
  @override
  String get changedBy;
  @override
  DateTime get changedAt;

  /// Create a copy of InterventionHistoryEntry
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InterventionHistoryEntryImplCopyWith<_$InterventionHistoryEntryImpl>
  get copyWith => throw _privateConstructorUsedError;
}

AgentSummaryModel _$AgentSummaryModelFromJson(Map<String, dynamic> json) {
  return _AgentSummaryModel.fromJson(json);
}

/// @nodoc
mixin _$AgentSummaryModel {
  String get id => throw _privateConstructorUsedError;
  String get firstName => throw _privateConstructorUsedError;
  String get lastName => throw _privateConstructorUsedError;
  bool get isOnline => throw _privateConstructorUsedError;
  int get assignedCount => throw _privateConstructorUsedError;
  int get inProgressCount => throw _privateConstructorUsedError;
  double get averageResolutionMinutes => throw _privateConstructorUsedError;
  double? get latitude => throw _privateConstructorUsedError;
  double? get longitude => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;

  /// Serializes this AgentSummaryModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AgentSummaryModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AgentSummaryModelCopyWith<AgentSummaryModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AgentSummaryModelCopyWith<$Res> {
  factory $AgentSummaryModelCopyWith(
    AgentSummaryModel value,
    $Res Function(AgentSummaryModel) then,
  ) = _$AgentSummaryModelCopyWithImpl<$Res, AgentSummaryModel>;
  @useResult
  $Res call({
    String id,
    String firstName,
    String lastName,
    bool isOnline,
    int assignedCount,
    int inProgressCount,
    double averageResolutionMinutes,
    double? latitude,
    double? longitude,
    String? phone,
  });
}

/// @nodoc
class _$AgentSummaryModelCopyWithImpl<$Res, $Val extends AgentSummaryModel>
    implements $AgentSummaryModelCopyWith<$Res> {
  _$AgentSummaryModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AgentSummaryModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? firstName = null,
    Object? lastName = null,
    Object? isOnline = null,
    Object? assignedCount = null,
    Object? inProgressCount = null,
    Object? averageResolutionMinutes = null,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? phone = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            firstName: null == firstName
                ? _value.firstName
                : firstName // ignore: cast_nullable_to_non_nullable
                      as String,
            lastName: null == lastName
                ? _value.lastName
                : lastName // ignore: cast_nullable_to_non_nullable
                      as String,
            isOnline: null == isOnline
                ? _value.isOnline
                : isOnline // ignore: cast_nullable_to_non_nullable
                      as bool,
            assignedCount: null == assignedCount
                ? _value.assignedCount
                : assignedCount // ignore: cast_nullable_to_non_nullable
                      as int,
            inProgressCount: null == inProgressCount
                ? _value.inProgressCount
                : inProgressCount // ignore: cast_nullable_to_non_nullable
                      as int,
            averageResolutionMinutes: null == averageResolutionMinutes
                ? _value.averageResolutionMinutes
                : averageResolutionMinutes // ignore: cast_nullable_to_non_nullable
                      as double,
            latitude: freezed == latitude
                ? _value.latitude
                : latitude // ignore: cast_nullable_to_non_nullable
                      as double?,
            longitude: freezed == longitude
                ? _value.longitude
                : longitude // ignore: cast_nullable_to_non_nullable
                      as double?,
            phone: freezed == phone
                ? _value.phone
                : phone // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AgentSummaryModelImplCopyWith<$Res>
    implements $AgentSummaryModelCopyWith<$Res> {
  factory _$$AgentSummaryModelImplCopyWith(
    _$AgentSummaryModelImpl value,
    $Res Function(_$AgentSummaryModelImpl) then,
  ) = __$$AgentSummaryModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String firstName,
    String lastName,
    bool isOnline,
    int assignedCount,
    int inProgressCount,
    double averageResolutionMinutes,
    double? latitude,
    double? longitude,
    String? phone,
  });
}

/// @nodoc
class __$$AgentSummaryModelImplCopyWithImpl<$Res>
    extends _$AgentSummaryModelCopyWithImpl<$Res, _$AgentSummaryModelImpl>
    implements _$$AgentSummaryModelImplCopyWith<$Res> {
  __$$AgentSummaryModelImplCopyWithImpl(
    _$AgentSummaryModelImpl _value,
    $Res Function(_$AgentSummaryModelImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AgentSummaryModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? firstName = null,
    Object? lastName = null,
    Object? isOnline = null,
    Object? assignedCount = null,
    Object? inProgressCount = null,
    Object? averageResolutionMinutes = null,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? phone = freezed,
  }) {
    return _then(
      _$AgentSummaryModelImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        firstName: null == firstName
            ? _value.firstName
            : firstName // ignore: cast_nullable_to_non_nullable
                  as String,
        lastName: null == lastName
            ? _value.lastName
            : lastName // ignore: cast_nullable_to_non_nullable
                  as String,
        isOnline: null == isOnline
            ? _value.isOnline
            : isOnline // ignore: cast_nullable_to_non_nullable
                  as bool,
        assignedCount: null == assignedCount
            ? _value.assignedCount
            : assignedCount // ignore: cast_nullable_to_non_nullable
                  as int,
        inProgressCount: null == inProgressCount
            ? _value.inProgressCount
            : inProgressCount // ignore: cast_nullable_to_non_nullable
                  as int,
        averageResolutionMinutes: null == averageResolutionMinutes
            ? _value.averageResolutionMinutes
            : averageResolutionMinutes // ignore: cast_nullable_to_non_nullable
                  as double,
        latitude: freezed == latitude
            ? _value.latitude
            : latitude // ignore: cast_nullable_to_non_nullable
                  as double?,
        longitude: freezed == longitude
            ? _value.longitude
            : longitude // ignore: cast_nullable_to_non_nullable
                  as double?,
        phone: freezed == phone
            ? _value.phone
            : phone // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AgentSummaryModelImpl extends _AgentSummaryModel {
  const _$AgentSummaryModelImpl({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.isOnline = true,
    this.assignedCount = 0,
    this.inProgressCount = 0,
    this.averageResolutionMinutes = 0,
    this.latitude,
    this.longitude,
    this.phone,
  }) : super._();

  factory _$AgentSummaryModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$AgentSummaryModelImplFromJson(json);

  @override
  final String id;
  @override
  final String firstName;
  @override
  final String lastName;
  @override
  @JsonKey()
  final bool isOnline;
  @override
  @JsonKey()
  final int assignedCount;
  @override
  @JsonKey()
  final int inProgressCount;
  @override
  @JsonKey()
  final double averageResolutionMinutes;
  @override
  final double? latitude;
  @override
  final double? longitude;
  @override
  final String? phone;

  @override
  String toString() {
    return 'AgentSummaryModel(id: $id, firstName: $firstName, lastName: $lastName, isOnline: $isOnline, assignedCount: $assignedCount, inProgressCount: $inProgressCount, averageResolutionMinutes: $averageResolutionMinutes, latitude: $latitude, longitude: $longitude, phone: $phone)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AgentSummaryModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.firstName, firstName) ||
                other.firstName == firstName) &&
            (identical(other.lastName, lastName) ||
                other.lastName == lastName) &&
            (identical(other.isOnline, isOnline) ||
                other.isOnline == isOnline) &&
            (identical(other.assignedCount, assignedCount) ||
                other.assignedCount == assignedCount) &&
            (identical(other.inProgressCount, inProgressCount) ||
                other.inProgressCount == inProgressCount) &&
            (identical(
                  other.averageResolutionMinutes,
                  averageResolutionMinutes,
                ) ||
                other.averageResolutionMinutes == averageResolutionMinutes) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            (identical(other.phone, phone) || other.phone == phone));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    firstName,
    lastName,
    isOnline,
    assignedCount,
    inProgressCount,
    averageResolutionMinutes,
    latitude,
    longitude,
    phone,
  );

  /// Create a copy of AgentSummaryModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AgentSummaryModelImplCopyWith<_$AgentSummaryModelImpl> get copyWith =>
      __$$AgentSummaryModelImplCopyWithImpl<_$AgentSummaryModelImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$AgentSummaryModelImplToJson(this);
  }
}

abstract class _AgentSummaryModel extends AgentSummaryModel {
  const factory _AgentSummaryModel({
    required final String id,
    required final String firstName,
    required final String lastName,
    final bool isOnline,
    final int assignedCount,
    final int inProgressCount,
    final double averageResolutionMinutes,
    final double? latitude,
    final double? longitude,
    final String? phone,
  }) = _$AgentSummaryModelImpl;
  const _AgentSummaryModel._() : super._();

  factory _AgentSummaryModel.fromJson(Map<String, dynamic> json) =
      _$AgentSummaryModelImpl.fromJson;

  @override
  String get id;
  @override
  String get firstName;
  @override
  String get lastName;
  @override
  bool get isOnline;
  @override
  int get assignedCount;
  @override
  int get inProgressCount;
  @override
  double get averageResolutionMinutes;
  @override
  double? get latitude;
  @override
  double? get longitude;
  @override
  String? get phone;

  /// Create a copy of AgentSummaryModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AgentSummaryModelImplCopyWith<_$AgentSummaryModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
