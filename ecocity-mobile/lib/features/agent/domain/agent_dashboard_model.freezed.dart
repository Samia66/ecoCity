// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'agent_dashboard_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

AgentDashboardModel _$AgentDashboardModelFromJson(Map<String, dynamic> json) {
  return _AgentDashboardModel.fromJson(json);
}

/// @nodoc
mixin _$AgentDashboardModel {
  int get assignedCount => throw _privateConstructorUsedError;
  int get inProgressCount => throw _privateConstructorUsedError;
  int get urgentCount => throw _privateConstructorUsedError;
  int get resolvedTodayCount => throw _privateConstructorUsedError;
  double get averageResolutionMinutes => throw _privateConstructorUsedError;
  List<InterventionModel> get upcoming => throw _privateConstructorUsedError;
  List<InterventionModel> get recentUpdates =>
      throw _privateConstructorUsedError;

  /// Serializes this AgentDashboardModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AgentDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AgentDashboardModelCopyWith<AgentDashboardModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AgentDashboardModelCopyWith<$Res> {
  factory $AgentDashboardModelCopyWith(
    AgentDashboardModel value,
    $Res Function(AgentDashboardModel) then,
  ) = _$AgentDashboardModelCopyWithImpl<$Res, AgentDashboardModel>;
  @useResult
  $Res call({
    int assignedCount,
    int inProgressCount,
    int urgentCount,
    int resolvedTodayCount,
    double averageResolutionMinutes,
    List<InterventionModel> upcoming,
    List<InterventionModel> recentUpdates,
  });
}

/// @nodoc
class _$AgentDashboardModelCopyWithImpl<$Res, $Val extends AgentDashboardModel>
    implements $AgentDashboardModelCopyWith<$Res> {
  _$AgentDashboardModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AgentDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? assignedCount = null,
    Object? inProgressCount = null,
    Object? urgentCount = null,
    Object? resolvedTodayCount = null,
    Object? averageResolutionMinutes = null,
    Object? upcoming = null,
    Object? recentUpdates = null,
  }) {
    return _then(
      _value.copyWith(
            assignedCount: null == assignedCount
                ? _value.assignedCount
                : assignedCount // ignore: cast_nullable_to_non_nullable
                      as int,
            inProgressCount: null == inProgressCount
                ? _value.inProgressCount
                : inProgressCount // ignore: cast_nullable_to_non_nullable
                      as int,
            urgentCount: null == urgentCount
                ? _value.urgentCount
                : urgentCount // ignore: cast_nullable_to_non_nullable
                      as int,
            resolvedTodayCount: null == resolvedTodayCount
                ? _value.resolvedTodayCount
                : resolvedTodayCount // ignore: cast_nullable_to_non_nullable
                      as int,
            averageResolutionMinutes: null == averageResolutionMinutes
                ? _value.averageResolutionMinutes
                : averageResolutionMinutes // ignore: cast_nullable_to_non_nullable
                      as double,
            upcoming: null == upcoming
                ? _value.upcoming
                : upcoming // ignore: cast_nullable_to_non_nullable
                      as List<InterventionModel>,
            recentUpdates: null == recentUpdates
                ? _value.recentUpdates
                : recentUpdates // ignore: cast_nullable_to_non_nullable
                      as List<InterventionModel>,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AgentDashboardModelImplCopyWith<$Res>
    implements $AgentDashboardModelCopyWith<$Res> {
  factory _$$AgentDashboardModelImplCopyWith(
    _$AgentDashboardModelImpl value,
    $Res Function(_$AgentDashboardModelImpl) then,
  ) = __$$AgentDashboardModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    int assignedCount,
    int inProgressCount,
    int urgentCount,
    int resolvedTodayCount,
    double averageResolutionMinutes,
    List<InterventionModel> upcoming,
    List<InterventionModel> recentUpdates,
  });
}

/// @nodoc
class __$$AgentDashboardModelImplCopyWithImpl<$Res>
    extends _$AgentDashboardModelCopyWithImpl<$Res, _$AgentDashboardModelImpl>
    implements _$$AgentDashboardModelImplCopyWith<$Res> {
  __$$AgentDashboardModelImplCopyWithImpl(
    _$AgentDashboardModelImpl _value,
    $Res Function(_$AgentDashboardModelImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AgentDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? assignedCount = null,
    Object? inProgressCount = null,
    Object? urgentCount = null,
    Object? resolvedTodayCount = null,
    Object? averageResolutionMinutes = null,
    Object? upcoming = null,
    Object? recentUpdates = null,
  }) {
    return _then(
      _$AgentDashboardModelImpl(
        assignedCount: null == assignedCount
            ? _value.assignedCount
            : assignedCount // ignore: cast_nullable_to_non_nullable
                  as int,
        inProgressCount: null == inProgressCount
            ? _value.inProgressCount
            : inProgressCount // ignore: cast_nullable_to_non_nullable
                  as int,
        urgentCount: null == urgentCount
            ? _value.urgentCount
            : urgentCount // ignore: cast_nullable_to_non_nullable
                  as int,
        resolvedTodayCount: null == resolvedTodayCount
            ? _value.resolvedTodayCount
            : resolvedTodayCount // ignore: cast_nullable_to_non_nullable
                  as int,
        averageResolutionMinutes: null == averageResolutionMinutes
            ? _value.averageResolutionMinutes
            : averageResolutionMinutes // ignore: cast_nullable_to_non_nullable
                  as double,
        upcoming: null == upcoming
            ? _value._upcoming
            : upcoming // ignore: cast_nullable_to_non_nullable
                  as List<InterventionModel>,
        recentUpdates: null == recentUpdates
            ? _value._recentUpdates
            : recentUpdates // ignore: cast_nullable_to_non_nullable
                  as List<InterventionModel>,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AgentDashboardModelImpl implements _AgentDashboardModel {
  const _$AgentDashboardModelImpl({
    required this.assignedCount,
    required this.inProgressCount,
    required this.urgentCount,
    required this.resolvedTodayCount,
    required this.averageResolutionMinutes,
    final List<InterventionModel> upcoming = const [],
    final List<InterventionModel> recentUpdates = const [],
  }) : _upcoming = upcoming,
       _recentUpdates = recentUpdates;

  factory _$AgentDashboardModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$AgentDashboardModelImplFromJson(json);

  @override
  final int assignedCount;
  @override
  final int inProgressCount;
  @override
  final int urgentCount;
  @override
  final int resolvedTodayCount;
  @override
  final double averageResolutionMinutes;
  final List<InterventionModel> _upcoming;
  @override
  @JsonKey()
  List<InterventionModel> get upcoming {
    if (_upcoming is EqualUnmodifiableListView) return _upcoming;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_upcoming);
  }

  final List<InterventionModel> _recentUpdates;
  @override
  @JsonKey()
  List<InterventionModel> get recentUpdates {
    if (_recentUpdates is EqualUnmodifiableListView) return _recentUpdates;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_recentUpdates);
  }

  @override
  String toString() {
    return 'AgentDashboardModel(assignedCount: $assignedCount, inProgressCount: $inProgressCount, urgentCount: $urgentCount, resolvedTodayCount: $resolvedTodayCount, averageResolutionMinutes: $averageResolutionMinutes, upcoming: $upcoming, recentUpdates: $recentUpdates)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AgentDashboardModelImpl &&
            (identical(other.assignedCount, assignedCount) ||
                other.assignedCount == assignedCount) &&
            (identical(other.inProgressCount, inProgressCount) ||
                other.inProgressCount == inProgressCount) &&
            (identical(other.urgentCount, urgentCount) ||
                other.urgentCount == urgentCount) &&
            (identical(other.resolvedTodayCount, resolvedTodayCount) ||
                other.resolvedTodayCount == resolvedTodayCount) &&
            (identical(
                  other.averageResolutionMinutes,
                  averageResolutionMinutes,
                ) ||
                other.averageResolutionMinutes == averageResolutionMinutes) &&
            const DeepCollectionEquality().equals(other._upcoming, _upcoming) &&
            const DeepCollectionEquality().equals(
              other._recentUpdates,
              _recentUpdates,
            ));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    assignedCount,
    inProgressCount,
    urgentCount,
    resolvedTodayCount,
    averageResolutionMinutes,
    const DeepCollectionEquality().hash(_upcoming),
    const DeepCollectionEquality().hash(_recentUpdates),
  );

  /// Create a copy of AgentDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AgentDashboardModelImplCopyWith<_$AgentDashboardModelImpl> get copyWith =>
      __$$AgentDashboardModelImplCopyWithImpl<_$AgentDashboardModelImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$AgentDashboardModelImplToJson(this);
  }
}

abstract class _AgentDashboardModel implements AgentDashboardModel {
  const factory _AgentDashboardModel({
    required final int assignedCount,
    required final int inProgressCount,
    required final int urgentCount,
    required final int resolvedTodayCount,
    required final double averageResolutionMinutes,
    final List<InterventionModel> upcoming,
    final List<InterventionModel> recentUpdates,
  }) = _$AgentDashboardModelImpl;

  factory _AgentDashboardModel.fromJson(Map<String, dynamic> json) =
      _$AgentDashboardModelImpl.fromJson;

  @override
  int get assignedCount;
  @override
  int get inProgressCount;
  @override
  int get urgentCount;
  @override
  int get resolvedTodayCount;
  @override
  double get averageResolutionMinutes;
  @override
  List<InterventionModel> get upcoming;
  @override
  List<InterventionModel> get recentUpdates;

  /// Create a copy of AgentDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AgentDashboardModelImplCopyWith<_$AgentDashboardModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
