// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'team_leader_dashboard_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

TeamLeaderDashboardModel _$TeamLeaderDashboardModelFromJson(
  Map<String, dynamic> json,
) {
  return _TeamLeaderDashboardModel.fromJson(json);
}

/// @nodoc
mixin _$TeamLeaderDashboardModel {
  int get activeAgents => throw _privateConstructorUsedError;
  int get availableAgents => throw _privateConstructorUsedError;
  int get unassignedCount => throw _privateConstructorUsedError;
  int get criticalCount => throw _privateConstructorUsedError;
  int get lateCount => throw _privateConstructorUsedError;
  double get resolutionRate => throw _privateConstructorUsedError; // 0..1
  List<StatusBreakdownEntry> get statusBreakdown =>
      throw _privateConstructorUsedError;
  List<AgentLoadEntry> get agentLoad => throw _privateConstructorUsedError;
  List<WeeklyTrendEntry> get weeklyTrend => throw _privateConstructorUsedError;

  /// Serializes this TeamLeaderDashboardModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of TeamLeaderDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TeamLeaderDashboardModelCopyWith<TeamLeaderDashboardModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TeamLeaderDashboardModelCopyWith<$Res> {
  factory $TeamLeaderDashboardModelCopyWith(
    TeamLeaderDashboardModel value,
    $Res Function(TeamLeaderDashboardModel) then,
  ) = _$TeamLeaderDashboardModelCopyWithImpl<$Res, TeamLeaderDashboardModel>;
  @useResult
  $Res call({
    int activeAgents,
    int availableAgents,
    int unassignedCount,
    int criticalCount,
    int lateCount,
    double resolutionRate,
    List<StatusBreakdownEntry> statusBreakdown,
    List<AgentLoadEntry> agentLoad,
    List<WeeklyTrendEntry> weeklyTrend,
  });
}

/// @nodoc
class _$TeamLeaderDashboardModelCopyWithImpl<
  $Res,
  $Val extends TeamLeaderDashboardModel
>
    implements $TeamLeaderDashboardModelCopyWith<$Res> {
  _$TeamLeaderDashboardModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TeamLeaderDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? activeAgents = null,
    Object? availableAgents = null,
    Object? unassignedCount = null,
    Object? criticalCount = null,
    Object? lateCount = null,
    Object? resolutionRate = null,
    Object? statusBreakdown = null,
    Object? agentLoad = null,
    Object? weeklyTrend = null,
  }) {
    return _then(
      _value.copyWith(
            activeAgents: null == activeAgents
                ? _value.activeAgents
                : activeAgents // ignore: cast_nullable_to_non_nullable
                      as int,
            availableAgents: null == availableAgents
                ? _value.availableAgents
                : availableAgents // ignore: cast_nullable_to_non_nullable
                      as int,
            unassignedCount: null == unassignedCount
                ? _value.unassignedCount
                : unassignedCount // ignore: cast_nullable_to_non_nullable
                      as int,
            criticalCount: null == criticalCount
                ? _value.criticalCount
                : criticalCount // ignore: cast_nullable_to_non_nullable
                      as int,
            lateCount: null == lateCount
                ? _value.lateCount
                : lateCount // ignore: cast_nullable_to_non_nullable
                      as int,
            resolutionRate: null == resolutionRate
                ? _value.resolutionRate
                : resolutionRate // ignore: cast_nullable_to_non_nullable
                      as double,
            statusBreakdown: null == statusBreakdown
                ? _value.statusBreakdown
                : statusBreakdown // ignore: cast_nullable_to_non_nullable
                      as List<StatusBreakdownEntry>,
            agentLoad: null == agentLoad
                ? _value.agentLoad
                : agentLoad // ignore: cast_nullable_to_non_nullable
                      as List<AgentLoadEntry>,
            weeklyTrend: null == weeklyTrend
                ? _value.weeklyTrend
                : weeklyTrend // ignore: cast_nullable_to_non_nullable
                      as List<WeeklyTrendEntry>,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$TeamLeaderDashboardModelImplCopyWith<$Res>
    implements $TeamLeaderDashboardModelCopyWith<$Res> {
  factory _$$TeamLeaderDashboardModelImplCopyWith(
    _$TeamLeaderDashboardModelImpl value,
    $Res Function(_$TeamLeaderDashboardModelImpl) then,
  ) = __$$TeamLeaderDashboardModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    int activeAgents,
    int availableAgents,
    int unassignedCount,
    int criticalCount,
    int lateCount,
    double resolutionRate,
    List<StatusBreakdownEntry> statusBreakdown,
    List<AgentLoadEntry> agentLoad,
    List<WeeklyTrendEntry> weeklyTrend,
  });
}

/// @nodoc
class __$$TeamLeaderDashboardModelImplCopyWithImpl<$Res>
    extends
        _$TeamLeaderDashboardModelCopyWithImpl<
          $Res,
          _$TeamLeaderDashboardModelImpl
        >
    implements _$$TeamLeaderDashboardModelImplCopyWith<$Res> {
  __$$TeamLeaderDashboardModelImplCopyWithImpl(
    _$TeamLeaderDashboardModelImpl _value,
    $Res Function(_$TeamLeaderDashboardModelImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of TeamLeaderDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? activeAgents = null,
    Object? availableAgents = null,
    Object? unassignedCount = null,
    Object? criticalCount = null,
    Object? lateCount = null,
    Object? resolutionRate = null,
    Object? statusBreakdown = null,
    Object? agentLoad = null,
    Object? weeklyTrend = null,
  }) {
    return _then(
      _$TeamLeaderDashboardModelImpl(
        activeAgents: null == activeAgents
            ? _value.activeAgents
            : activeAgents // ignore: cast_nullable_to_non_nullable
                  as int,
        availableAgents: null == availableAgents
            ? _value.availableAgents
            : availableAgents // ignore: cast_nullable_to_non_nullable
                  as int,
        unassignedCount: null == unassignedCount
            ? _value.unassignedCount
            : unassignedCount // ignore: cast_nullable_to_non_nullable
                  as int,
        criticalCount: null == criticalCount
            ? _value.criticalCount
            : criticalCount // ignore: cast_nullable_to_non_nullable
                  as int,
        lateCount: null == lateCount
            ? _value.lateCount
            : lateCount // ignore: cast_nullable_to_non_nullable
                  as int,
        resolutionRate: null == resolutionRate
            ? _value.resolutionRate
            : resolutionRate // ignore: cast_nullable_to_non_nullable
                  as double,
        statusBreakdown: null == statusBreakdown
            ? _value._statusBreakdown
            : statusBreakdown // ignore: cast_nullable_to_non_nullable
                  as List<StatusBreakdownEntry>,
        agentLoad: null == agentLoad
            ? _value._agentLoad
            : agentLoad // ignore: cast_nullable_to_non_nullable
                  as List<AgentLoadEntry>,
        weeklyTrend: null == weeklyTrend
            ? _value._weeklyTrend
            : weeklyTrend // ignore: cast_nullable_to_non_nullable
                  as List<WeeklyTrendEntry>,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$TeamLeaderDashboardModelImpl implements _TeamLeaderDashboardModel {
  const _$TeamLeaderDashboardModelImpl({
    required this.activeAgents,
    required this.availableAgents,
    required this.unassignedCount,
    required this.criticalCount,
    required this.lateCount,
    required this.resolutionRate,
    final List<StatusBreakdownEntry> statusBreakdown = const [],
    final List<AgentLoadEntry> agentLoad = const [],
    final List<WeeklyTrendEntry> weeklyTrend = const [],
  }) : _statusBreakdown = statusBreakdown,
       _agentLoad = agentLoad,
       _weeklyTrend = weeklyTrend;

  factory _$TeamLeaderDashboardModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$TeamLeaderDashboardModelImplFromJson(json);

  @override
  final int activeAgents;
  @override
  final int availableAgents;
  @override
  final int unassignedCount;
  @override
  final int criticalCount;
  @override
  final int lateCount;
  @override
  final double resolutionRate;
  // 0..1
  final List<StatusBreakdownEntry> _statusBreakdown;
  // 0..1
  @override
  @JsonKey()
  List<StatusBreakdownEntry> get statusBreakdown {
    if (_statusBreakdown is EqualUnmodifiableListView) return _statusBreakdown;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_statusBreakdown);
  }

  final List<AgentLoadEntry> _agentLoad;
  @override
  @JsonKey()
  List<AgentLoadEntry> get agentLoad {
    if (_agentLoad is EqualUnmodifiableListView) return _agentLoad;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_agentLoad);
  }

  final List<WeeklyTrendEntry> _weeklyTrend;
  @override
  @JsonKey()
  List<WeeklyTrendEntry> get weeklyTrend {
    if (_weeklyTrend is EqualUnmodifiableListView) return _weeklyTrend;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_weeklyTrend);
  }

  @override
  String toString() {
    return 'TeamLeaderDashboardModel(activeAgents: $activeAgents, availableAgents: $availableAgents, unassignedCount: $unassignedCount, criticalCount: $criticalCount, lateCount: $lateCount, resolutionRate: $resolutionRate, statusBreakdown: $statusBreakdown, agentLoad: $agentLoad, weeklyTrend: $weeklyTrend)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TeamLeaderDashboardModelImpl &&
            (identical(other.activeAgents, activeAgents) ||
                other.activeAgents == activeAgents) &&
            (identical(other.availableAgents, availableAgents) ||
                other.availableAgents == availableAgents) &&
            (identical(other.unassignedCount, unassignedCount) ||
                other.unassignedCount == unassignedCount) &&
            (identical(other.criticalCount, criticalCount) ||
                other.criticalCount == criticalCount) &&
            (identical(other.lateCount, lateCount) ||
                other.lateCount == lateCount) &&
            (identical(other.resolutionRate, resolutionRate) ||
                other.resolutionRate == resolutionRate) &&
            const DeepCollectionEquality().equals(
              other._statusBreakdown,
              _statusBreakdown,
            ) &&
            const DeepCollectionEquality().equals(
              other._agentLoad,
              _agentLoad,
            ) &&
            const DeepCollectionEquality().equals(
              other._weeklyTrend,
              _weeklyTrend,
            ));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    activeAgents,
    availableAgents,
    unassignedCount,
    criticalCount,
    lateCount,
    resolutionRate,
    const DeepCollectionEquality().hash(_statusBreakdown),
    const DeepCollectionEquality().hash(_agentLoad),
    const DeepCollectionEquality().hash(_weeklyTrend),
  );

  /// Create a copy of TeamLeaderDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TeamLeaderDashboardModelImplCopyWith<_$TeamLeaderDashboardModelImpl>
  get copyWith =>
      __$$TeamLeaderDashboardModelImplCopyWithImpl<
        _$TeamLeaderDashboardModelImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TeamLeaderDashboardModelImplToJson(this);
  }
}

abstract class _TeamLeaderDashboardModel implements TeamLeaderDashboardModel {
  const factory _TeamLeaderDashboardModel({
    required final int activeAgents,
    required final int availableAgents,
    required final int unassignedCount,
    required final int criticalCount,
    required final int lateCount,
    required final double resolutionRate,
    final List<StatusBreakdownEntry> statusBreakdown,
    final List<AgentLoadEntry> agentLoad,
    final List<WeeklyTrendEntry> weeklyTrend,
  }) = _$TeamLeaderDashboardModelImpl;

  factory _TeamLeaderDashboardModel.fromJson(Map<String, dynamic> json) =
      _$TeamLeaderDashboardModelImpl.fromJson;

  @override
  int get activeAgents;
  @override
  int get availableAgents;
  @override
  int get unassignedCount;
  @override
  int get criticalCount;
  @override
  int get lateCount;
  @override
  double get resolutionRate; // 0..1
  @override
  List<StatusBreakdownEntry> get statusBreakdown;
  @override
  List<AgentLoadEntry> get agentLoad;
  @override
  List<WeeklyTrendEntry> get weeklyTrend;

  /// Create a copy of TeamLeaderDashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TeamLeaderDashboardModelImplCopyWith<_$TeamLeaderDashboardModelImpl>
  get copyWith => throw _privateConstructorUsedError;
}

StatusBreakdownEntry _$StatusBreakdownEntryFromJson(Map<String, dynamic> json) {
  return _StatusBreakdownEntry.fromJson(json);
}

/// @nodoc
mixin _$StatusBreakdownEntry {
  String get status => throw _privateConstructorUsedError;
  int get count => throw _privateConstructorUsedError;

  /// Serializes this StatusBreakdownEntry to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of StatusBreakdownEntry
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $StatusBreakdownEntryCopyWith<StatusBreakdownEntry> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $StatusBreakdownEntryCopyWith<$Res> {
  factory $StatusBreakdownEntryCopyWith(
    StatusBreakdownEntry value,
    $Res Function(StatusBreakdownEntry) then,
  ) = _$StatusBreakdownEntryCopyWithImpl<$Res, StatusBreakdownEntry>;
  @useResult
  $Res call({String status, int count});
}

/// @nodoc
class _$StatusBreakdownEntryCopyWithImpl<
  $Res,
  $Val extends StatusBreakdownEntry
>
    implements $StatusBreakdownEntryCopyWith<$Res> {
  _$StatusBreakdownEntryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of StatusBreakdownEntry
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? status = null, Object? count = null}) {
    return _then(
      _value.copyWith(
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as String,
            count: null == count
                ? _value.count
                : count // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$StatusBreakdownEntryImplCopyWith<$Res>
    implements $StatusBreakdownEntryCopyWith<$Res> {
  factory _$$StatusBreakdownEntryImplCopyWith(
    _$StatusBreakdownEntryImpl value,
    $Res Function(_$StatusBreakdownEntryImpl) then,
  ) = __$$StatusBreakdownEntryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String status, int count});
}

/// @nodoc
class __$$StatusBreakdownEntryImplCopyWithImpl<$Res>
    extends _$StatusBreakdownEntryCopyWithImpl<$Res, _$StatusBreakdownEntryImpl>
    implements _$$StatusBreakdownEntryImplCopyWith<$Res> {
  __$$StatusBreakdownEntryImplCopyWithImpl(
    _$StatusBreakdownEntryImpl _value,
    $Res Function(_$StatusBreakdownEntryImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of StatusBreakdownEntry
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? status = null, Object? count = null}) {
    return _then(
      _$StatusBreakdownEntryImpl(
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as String,
        count: null == count
            ? _value.count
            : count // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$StatusBreakdownEntryImpl implements _StatusBreakdownEntry {
  const _$StatusBreakdownEntryImpl({required this.status, required this.count});

  factory _$StatusBreakdownEntryImpl.fromJson(Map<String, dynamic> json) =>
      _$$StatusBreakdownEntryImplFromJson(json);

  @override
  final String status;
  @override
  final int count;

  @override
  String toString() {
    return 'StatusBreakdownEntry(status: $status, count: $count)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$StatusBreakdownEntryImpl &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.count, count) || other.count == count));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, status, count);

  /// Create a copy of StatusBreakdownEntry
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$StatusBreakdownEntryImplCopyWith<_$StatusBreakdownEntryImpl>
  get copyWith =>
      __$$StatusBreakdownEntryImplCopyWithImpl<_$StatusBreakdownEntryImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$StatusBreakdownEntryImplToJson(this);
  }
}

abstract class _StatusBreakdownEntry implements StatusBreakdownEntry {
  const factory _StatusBreakdownEntry({
    required final String status,
    required final int count,
  }) = _$StatusBreakdownEntryImpl;

  factory _StatusBreakdownEntry.fromJson(Map<String, dynamic> json) =
      _$StatusBreakdownEntryImpl.fromJson;

  @override
  String get status;
  @override
  int get count;

  /// Create a copy of StatusBreakdownEntry
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$StatusBreakdownEntryImplCopyWith<_$StatusBreakdownEntryImpl>
  get copyWith => throw _privateConstructorUsedError;
}

AgentLoadEntry _$AgentLoadEntryFromJson(Map<String, dynamic> json) {
  return _AgentLoadEntry.fromJson(json);
}

/// @nodoc
mixin _$AgentLoadEntry {
  String get agentName => throw _privateConstructorUsedError;
  int get assignedCount => throw _privateConstructorUsedError;

  /// Serializes this AgentLoadEntry to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AgentLoadEntry
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AgentLoadEntryCopyWith<AgentLoadEntry> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AgentLoadEntryCopyWith<$Res> {
  factory $AgentLoadEntryCopyWith(
    AgentLoadEntry value,
    $Res Function(AgentLoadEntry) then,
  ) = _$AgentLoadEntryCopyWithImpl<$Res, AgentLoadEntry>;
  @useResult
  $Res call({String agentName, int assignedCount});
}

/// @nodoc
class _$AgentLoadEntryCopyWithImpl<$Res, $Val extends AgentLoadEntry>
    implements $AgentLoadEntryCopyWith<$Res> {
  _$AgentLoadEntryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AgentLoadEntry
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? agentName = null, Object? assignedCount = null}) {
    return _then(
      _value.copyWith(
            agentName: null == agentName
                ? _value.agentName
                : agentName // ignore: cast_nullable_to_non_nullable
                      as String,
            assignedCount: null == assignedCount
                ? _value.assignedCount
                : assignedCount // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AgentLoadEntryImplCopyWith<$Res>
    implements $AgentLoadEntryCopyWith<$Res> {
  factory _$$AgentLoadEntryImplCopyWith(
    _$AgentLoadEntryImpl value,
    $Res Function(_$AgentLoadEntryImpl) then,
  ) = __$$AgentLoadEntryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String agentName, int assignedCount});
}

/// @nodoc
class __$$AgentLoadEntryImplCopyWithImpl<$Res>
    extends _$AgentLoadEntryCopyWithImpl<$Res, _$AgentLoadEntryImpl>
    implements _$$AgentLoadEntryImplCopyWith<$Res> {
  __$$AgentLoadEntryImplCopyWithImpl(
    _$AgentLoadEntryImpl _value,
    $Res Function(_$AgentLoadEntryImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AgentLoadEntry
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? agentName = null, Object? assignedCount = null}) {
    return _then(
      _$AgentLoadEntryImpl(
        agentName: null == agentName
            ? _value.agentName
            : agentName // ignore: cast_nullable_to_non_nullable
                  as String,
        assignedCount: null == assignedCount
            ? _value.assignedCount
            : assignedCount // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AgentLoadEntryImpl implements _AgentLoadEntry {
  const _$AgentLoadEntryImpl({
    required this.agentName,
    required this.assignedCount,
  });

  factory _$AgentLoadEntryImpl.fromJson(Map<String, dynamic> json) =>
      _$$AgentLoadEntryImplFromJson(json);

  @override
  final String agentName;
  @override
  final int assignedCount;

  @override
  String toString() {
    return 'AgentLoadEntry(agentName: $agentName, assignedCount: $assignedCount)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AgentLoadEntryImpl &&
            (identical(other.agentName, agentName) ||
                other.agentName == agentName) &&
            (identical(other.assignedCount, assignedCount) ||
                other.assignedCount == assignedCount));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, agentName, assignedCount);

  /// Create a copy of AgentLoadEntry
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AgentLoadEntryImplCopyWith<_$AgentLoadEntryImpl> get copyWith =>
      __$$AgentLoadEntryImplCopyWithImpl<_$AgentLoadEntryImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$AgentLoadEntryImplToJson(this);
  }
}

abstract class _AgentLoadEntry implements AgentLoadEntry {
  const factory _AgentLoadEntry({
    required final String agentName,
    required final int assignedCount,
  }) = _$AgentLoadEntryImpl;

  factory _AgentLoadEntry.fromJson(Map<String, dynamic> json) =
      _$AgentLoadEntryImpl.fromJson;

  @override
  String get agentName;
  @override
  int get assignedCount;

  /// Create a copy of AgentLoadEntry
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AgentLoadEntryImplCopyWith<_$AgentLoadEntryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

WeeklyTrendEntry _$WeeklyTrendEntryFromJson(Map<String, dynamic> json) {
  return _WeeklyTrendEntry.fromJson(json);
}

/// @nodoc
mixin _$WeeklyTrendEntry {
  String get weekLabel => throw _privateConstructorUsedError;
  int get resolvedCount => throw _privateConstructorUsedError;

  /// Serializes this WeeklyTrendEntry to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of WeeklyTrendEntry
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $WeeklyTrendEntryCopyWith<WeeklyTrendEntry> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $WeeklyTrendEntryCopyWith<$Res> {
  factory $WeeklyTrendEntryCopyWith(
    WeeklyTrendEntry value,
    $Res Function(WeeklyTrendEntry) then,
  ) = _$WeeklyTrendEntryCopyWithImpl<$Res, WeeklyTrendEntry>;
  @useResult
  $Res call({String weekLabel, int resolvedCount});
}

/// @nodoc
class _$WeeklyTrendEntryCopyWithImpl<$Res, $Val extends WeeklyTrendEntry>
    implements $WeeklyTrendEntryCopyWith<$Res> {
  _$WeeklyTrendEntryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of WeeklyTrendEntry
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? weekLabel = null, Object? resolvedCount = null}) {
    return _then(
      _value.copyWith(
            weekLabel: null == weekLabel
                ? _value.weekLabel
                : weekLabel // ignore: cast_nullable_to_non_nullable
                      as String,
            resolvedCount: null == resolvedCount
                ? _value.resolvedCount
                : resolvedCount // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$WeeklyTrendEntryImplCopyWith<$Res>
    implements $WeeklyTrendEntryCopyWith<$Res> {
  factory _$$WeeklyTrendEntryImplCopyWith(
    _$WeeklyTrendEntryImpl value,
    $Res Function(_$WeeklyTrendEntryImpl) then,
  ) = __$$WeeklyTrendEntryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String weekLabel, int resolvedCount});
}

/// @nodoc
class __$$WeeklyTrendEntryImplCopyWithImpl<$Res>
    extends _$WeeklyTrendEntryCopyWithImpl<$Res, _$WeeklyTrendEntryImpl>
    implements _$$WeeklyTrendEntryImplCopyWith<$Res> {
  __$$WeeklyTrendEntryImplCopyWithImpl(
    _$WeeklyTrendEntryImpl _value,
    $Res Function(_$WeeklyTrendEntryImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of WeeklyTrendEntry
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? weekLabel = null, Object? resolvedCount = null}) {
    return _then(
      _$WeeklyTrendEntryImpl(
        weekLabel: null == weekLabel
            ? _value.weekLabel
            : weekLabel // ignore: cast_nullable_to_non_nullable
                  as String,
        resolvedCount: null == resolvedCount
            ? _value.resolvedCount
            : resolvedCount // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$WeeklyTrendEntryImpl implements _WeeklyTrendEntry {
  const _$WeeklyTrendEntryImpl({
    required this.weekLabel,
    required this.resolvedCount,
  });

  factory _$WeeklyTrendEntryImpl.fromJson(Map<String, dynamic> json) =>
      _$$WeeklyTrendEntryImplFromJson(json);

  @override
  final String weekLabel;
  @override
  final int resolvedCount;

  @override
  String toString() {
    return 'WeeklyTrendEntry(weekLabel: $weekLabel, resolvedCount: $resolvedCount)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$WeeklyTrendEntryImpl &&
            (identical(other.weekLabel, weekLabel) ||
                other.weekLabel == weekLabel) &&
            (identical(other.resolvedCount, resolvedCount) ||
                other.resolvedCount == resolvedCount));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, weekLabel, resolvedCount);

  /// Create a copy of WeeklyTrendEntry
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$WeeklyTrendEntryImplCopyWith<_$WeeklyTrendEntryImpl> get copyWith =>
      __$$WeeklyTrendEntryImplCopyWithImpl<_$WeeklyTrendEntryImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$WeeklyTrendEntryImplToJson(this);
  }
}

abstract class _WeeklyTrendEntry implements WeeklyTrendEntry {
  const factory _WeeklyTrendEntry({
    required final String weekLabel,
    required final int resolvedCount,
  }) = _$WeeklyTrendEntryImpl;

  factory _WeeklyTrendEntry.fromJson(Map<String, dynamic> json) =
      _$WeeklyTrendEntryImpl.fromJson;

  @override
  String get weekLabel;
  @override
  int get resolvedCount;

  /// Create a copy of WeeklyTrendEntry
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$WeeklyTrendEntryImplCopyWith<_$WeeklyTrendEntryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
