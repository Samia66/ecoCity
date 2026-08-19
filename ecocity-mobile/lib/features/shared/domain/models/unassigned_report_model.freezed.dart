// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'unassigned_report_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

UnassignedReportModel _$UnassignedReportModelFromJson(
  Map<String, dynamic> json,
) {
  return _UnassignedReportModel.fromJson(json);
}

/// @nodoc
mixin _$UnassignedReportModel {
  String get reportId => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get category => throw _privateConstructorUsedError;
  ReportPriority get priority => throw _privateConstructorUsedError;
  String get address => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;

  /// Serializes this UnassignedReportModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UnassignedReportModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UnassignedReportModelCopyWith<UnassignedReportModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UnassignedReportModelCopyWith<$Res> {
  factory $UnassignedReportModelCopyWith(
    UnassignedReportModel value,
    $Res Function(UnassignedReportModel) then,
  ) = _$UnassignedReportModelCopyWithImpl<$Res, UnassignedReportModel>;
  @useResult
  $Res call({
    String reportId,
    String title,
    String category,
    ReportPriority priority,
    String address,
    DateTime createdAt,
  });
}

/// @nodoc
class _$UnassignedReportModelCopyWithImpl<
  $Res,
  $Val extends UnassignedReportModel
>
    implements $UnassignedReportModelCopyWith<$Res> {
  _$UnassignedReportModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UnassignedReportModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? reportId = null,
    Object? title = null,
    Object? category = null,
    Object? priority = null,
    Object? address = null,
    Object? createdAt = null,
  }) {
    return _then(
      _value.copyWith(
            reportId: null == reportId
                ? _value.reportId
                : reportId // ignore: cast_nullable_to_non_nullable
                      as String,
            title: null == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String,
            category: null == category
                ? _value.category
                : category // ignore: cast_nullable_to_non_nullable
                      as String,
            priority: null == priority
                ? _value.priority
                : priority // ignore: cast_nullable_to_non_nullable
                      as ReportPriority,
            address: null == address
                ? _value.address
                : address // ignore: cast_nullable_to_non_nullable
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
abstract class _$$UnassignedReportModelImplCopyWith<$Res>
    implements $UnassignedReportModelCopyWith<$Res> {
  factory _$$UnassignedReportModelImplCopyWith(
    _$UnassignedReportModelImpl value,
    $Res Function(_$UnassignedReportModelImpl) then,
  ) = __$$UnassignedReportModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String reportId,
    String title,
    String category,
    ReportPriority priority,
    String address,
    DateTime createdAt,
  });
}

/// @nodoc
class __$$UnassignedReportModelImplCopyWithImpl<$Res>
    extends
        _$UnassignedReportModelCopyWithImpl<$Res, _$UnassignedReportModelImpl>
    implements _$$UnassignedReportModelImplCopyWith<$Res> {
  __$$UnassignedReportModelImplCopyWithImpl(
    _$UnassignedReportModelImpl _value,
    $Res Function(_$UnassignedReportModelImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of UnassignedReportModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? reportId = null,
    Object? title = null,
    Object? category = null,
    Object? priority = null,
    Object? address = null,
    Object? createdAt = null,
  }) {
    return _then(
      _$UnassignedReportModelImpl(
        reportId: null == reportId
            ? _value.reportId
            : reportId // ignore: cast_nullable_to_non_nullable
                  as String,
        title: null == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String,
        category: null == category
            ? _value.category
            : category // ignore: cast_nullable_to_non_nullable
                  as String,
        priority: null == priority
            ? _value.priority
            : priority // ignore: cast_nullable_to_non_nullable
                  as ReportPriority,
        address: null == address
            ? _value.address
            : address // ignore: cast_nullable_to_non_nullable
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
class _$UnassignedReportModelImpl implements _UnassignedReportModel {
  const _$UnassignedReportModelImpl({
    required this.reportId,
    required this.title,
    required this.category,
    required this.priority,
    required this.address,
    required this.createdAt,
  });

  factory _$UnassignedReportModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$UnassignedReportModelImplFromJson(json);

  @override
  final String reportId;
  @override
  final String title;
  @override
  final String category;
  @override
  final ReportPriority priority;
  @override
  final String address;
  @override
  final DateTime createdAt;

  @override
  String toString() {
    return 'UnassignedReportModel(reportId: $reportId, title: $title, category: $category, priority: $priority, address: $address, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UnassignedReportModelImpl &&
            (identical(other.reportId, reportId) ||
                other.reportId == reportId) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.priority, priority) ||
                other.priority == priority) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    reportId,
    title,
    category,
    priority,
    address,
    createdAt,
  );

  /// Create a copy of UnassignedReportModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UnassignedReportModelImplCopyWith<_$UnassignedReportModelImpl>
  get copyWith =>
      __$$UnassignedReportModelImplCopyWithImpl<_$UnassignedReportModelImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$UnassignedReportModelImplToJson(this);
  }
}

abstract class _UnassignedReportModel implements UnassignedReportModel {
  const factory _UnassignedReportModel({
    required final String reportId,
    required final String title,
    required final String category,
    required final ReportPriority priority,
    required final String address,
    required final DateTime createdAt,
  }) = _$UnassignedReportModelImpl;

  factory _UnassignedReportModel.fromJson(Map<String, dynamic> json) =
      _$UnassignedReportModelImpl.fromJson;

  @override
  String get reportId;
  @override
  String get title;
  @override
  String get category;
  @override
  ReportPriority get priority;
  @override
  String get address;
  @override
  DateTime get createdAt;

  /// Create a copy of UnassignedReportModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UnassignedReportModelImplCopyWith<_$UnassignedReportModelImpl>
  get copyWith => throw _privateConstructorUsedError;
}
