// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'citizen_dashboard_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

CitizenDashboardModel _$CitizenDashboardModelFromJson(
  Map<String, dynamic> json,
) {
  return _CitizenDashboardModel.fromJson(json);
}

/// @nodoc
mixin _$CitizenDashboardModel {
  int get total => throw _privateConstructorUsedError;
  int get pending => throw _privateConstructorUsedError;
  int get inProgress => throw _privateConstructorUsedError;
  int get resolved => throw _privateConstructorUsedError;
  ReportModel? get lastReport => throw _privateConstructorUsedError;

  /// Serializes this CitizenDashboardModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CitizenDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CitizenDashboardModelCopyWith<CitizenDashboardModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CitizenDashboardModelCopyWith<$Res> {
  factory $CitizenDashboardModelCopyWith(
    CitizenDashboardModel value,
    $Res Function(CitizenDashboardModel) then,
  ) = _$CitizenDashboardModelCopyWithImpl<$Res, CitizenDashboardModel>;
  @useResult
  $Res call({
    int total,
    int pending,
    int inProgress,
    int resolved,
    ReportModel? lastReport,
  });

  $ReportModelCopyWith<$Res>? get lastReport;
}

/// @nodoc
class _$CitizenDashboardModelCopyWithImpl<
  $Res,
  $Val extends CitizenDashboardModel
>
    implements $CitizenDashboardModelCopyWith<$Res> {
  _$CitizenDashboardModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CitizenDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? total = null,
    Object? pending = null,
    Object? inProgress = null,
    Object? resolved = null,
    Object? lastReport = freezed,
  }) {
    return _then(
      _value.copyWith(
            total: null == total
                ? _value.total
                : total // ignore: cast_nullable_to_non_nullable
                      as int,
            pending: null == pending
                ? _value.pending
                : pending // ignore: cast_nullable_to_non_nullable
                      as int,
            inProgress: null == inProgress
                ? _value.inProgress
                : inProgress // ignore: cast_nullable_to_non_nullable
                      as int,
            resolved: null == resolved
                ? _value.resolved
                : resolved // ignore: cast_nullable_to_non_nullable
                      as int,
            lastReport: freezed == lastReport
                ? _value.lastReport
                : lastReport // ignore: cast_nullable_to_non_nullable
                      as ReportModel?,
          )
          as $Val,
    );
  }

  /// Create a copy of CitizenDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ReportModelCopyWith<$Res>? get lastReport {
    if (_value.lastReport == null) {
      return null;
    }

    return $ReportModelCopyWith<$Res>(_value.lastReport!, (value) {
      return _then(_value.copyWith(lastReport: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$CitizenDashboardModelImplCopyWith<$Res>
    implements $CitizenDashboardModelCopyWith<$Res> {
  factory _$$CitizenDashboardModelImplCopyWith(
    _$CitizenDashboardModelImpl value,
    $Res Function(_$CitizenDashboardModelImpl) then,
  ) = __$$CitizenDashboardModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    int total,
    int pending,
    int inProgress,
    int resolved,
    ReportModel? lastReport,
  });

  @override
  $ReportModelCopyWith<$Res>? get lastReport;
}

/// @nodoc
class __$$CitizenDashboardModelImplCopyWithImpl<$Res>
    extends
        _$CitizenDashboardModelCopyWithImpl<$Res, _$CitizenDashboardModelImpl>
    implements _$$CitizenDashboardModelImplCopyWith<$Res> {
  __$$CitizenDashboardModelImplCopyWithImpl(
    _$CitizenDashboardModelImpl _value,
    $Res Function(_$CitizenDashboardModelImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CitizenDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? total = null,
    Object? pending = null,
    Object? inProgress = null,
    Object? resolved = null,
    Object? lastReport = freezed,
  }) {
    return _then(
      _$CitizenDashboardModelImpl(
        total: null == total
            ? _value.total
            : total // ignore: cast_nullable_to_non_nullable
                  as int,
        pending: null == pending
            ? _value.pending
            : pending // ignore: cast_nullable_to_non_nullable
                  as int,
        inProgress: null == inProgress
            ? _value.inProgress
            : inProgress // ignore: cast_nullable_to_non_nullable
                  as int,
        resolved: null == resolved
            ? _value.resolved
            : resolved // ignore: cast_nullable_to_non_nullable
                  as int,
        lastReport: freezed == lastReport
            ? _value.lastReport
            : lastReport // ignore: cast_nullable_to_non_nullable
                  as ReportModel?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CitizenDashboardModelImpl implements _CitizenDashboardModel {
  const _$CitizenDashboardModelImpl({
    required this.total,
    required this.pending,
    required this.inProgress,
    required this.resolved,
    this.lastReport,
  });

  factory _$CitizenDashboardModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CitizenDashboardModelImplFromJson(json);

  @override
  final int total;
  @override
  final int pending;
  @override
  final int inProgress;
  @override
  final int resolved;
  @override
  final ReportModel? lastReport;

  @override
  String toString() {
    return 'CitizenDashboardModel(total: $total, pending: $pending, inProgress: $inProgress, resolved: $resolved, lastReport: $lastReport)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CitizenDashboardModelImpl &&
            (identical(other.total, total) || other.total == total) &&
            (identical(other.pending, pending) || other.pending == pending) &&
            (identical(other.inProgress, inProgress) ||
                other.inProgress == inProgress) &&
            (identical(other.resolved, resolved) ||
                other.resolved == resolved) &&
            (identical(other.lastReport, lastReport) ||
                other.lastReport == lastReport));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    total,
    pending,
    inProgress,
    resolved,
    lastReport,
  );

  /// Create a copy of CitizenDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CitizenDashboardModelImplCopyWith<_$CitizenDashboardModelImpl>
  get copyWith =>
      __$$CitizenDashboardModelImplCopyWithImpl<_$CitizenDashboardModelImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$CitizenDashboardModelImplToJson(this);
  }
}

abstract class _CitizenDashboardModel implements CitizenDashboardModel {
  const factory _CitizenDashboardModel({
    required final int total,
    required final int pending,
    required final int inProgress,
    required final int resolved,
    final ReportModel? lastReport,
  }) = _$CitizenDashboardModelImpl;

  factory _CitizenDashboardModel.fromJson(Map<String, dynamic> json) =
      _$CitizenDashboardModelImpl.fromJson;

  @override
  int get total;
  @override
  int get pending;
  @override
  int get inProgress;
  @override
  int get resolved;
  @override
  ReportModel? get lastReport;

  /// Create a copy of CitizenDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CitizenDashboardModelImplCopyWith<_$CitizenDashboardModelImpl>
  get copyWith => throw _privateConstructorUsedError;
}
