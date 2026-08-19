// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'assign_intervention_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

AssignInterventionDto _$AssignInterventionDtoFromJson(
  Map<String, dynamic> json,
) {
  return _AssignInterventionDto.fromJson(json);
}

/// @nodoc
mixin _$AssignInterventionDto {
  String get agentId => throw _privateConstructorUsedError;

  /// Serializes this AssignInterventionDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AssignInterventionDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AssignInterventionDtoCopyWith<AssignInterventionDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AssignInterventionDtoCopyWith<$Res> {
  factory $AssignInterventionDtoCopyWith(
    AssignInterventionDto value,
    $Res Function(AssignInterventionDto) then,
  ) = _$AssignInterventionDtoCopyWithImpl<$Res, AssignInterventionDto>;
  @useResult
  $Res call({String agentId});
}

/// @nodoc
class _$AssignInterventionDtoCopyWithImpl<
  $Res,
  $Val extends AssignInterventionDto
>
    implements $AssignInterventionDtoCopyWith<$Res> {
  _$AssignInterventionDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AssignInterventionDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? agentId = null}) {
    return _then(
      _value.copyWith(
            agentId: null == agentId
                ? _value.agentId
                : agentId // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AssignInterventionDtoImplCopyWith<$Res>
    implements $AssignInterventionDtoCopyWith<$Res> {
  factory _$$AssignInterventionDtoImplCopyWith(
    _$AssignInterventionDtoImpl value,
    $Res Function(_$AssignInterventionDtoImpl) then,
  ) = __$$AssignInterventionDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String agentId});
}

/// @nodoc
class __$$AssignInterventionDtoImplCopyWithImpl<$Res>
    extends
        _$AssignInterventionDtoCopyWithImpl<$Res, _$AssignInterventionDtoImpl>
    implements _$$AssignInterventionDtoImplCopyWith<$Res> {
  __$$AssignInterventionDtoImplCopyWithImpl(
    _$AssignInterventionDtoImpl _value,
    $Res Function(_$AssignInterventionDtoImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AssignInterventionDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? agentId = null}) {
    return _then(
      _$AssignInterventionDtoImpl(
        agentId: null == agentId
            ? _value.agentId
            : agentId // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AssignInterventionDtoImpl implements _AssignInterventionDto {
  const _$AssignInterventionDtoImpl({required this.agentId});

  factory _$AssignInterventionDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$AssignInterventionDtoImplFromJson(json);

  @override
  final String agentId;

  @override
  String toString() {
    return 'AssignInterventionDto(agentId: $agentId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AssignInterventionDtoImpl &&
            (identical(other.agentId, agentId) || other.agentId == agentId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, agentId);

  /// Create a copy of AssignInterventionDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AssignInterventionDtoImplCopyWith<_$AssignInterventionDtoImpl>
  get copyWith =>
      __$$AssignInterventionDtoImplCopyWithImpl<_$AssignInterventionDtoImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$AssignInterventionDtoImplToJson(this);
  }
}

abstract class _AssignInterventionDto implements AssignInterventionDto {
  const factory _AssignInterventionDto({required final String agentId}) =
      _$AssignInterventionDtoImpl;

  factory _AssignInterventionDto.fromJson(Map<String, dynamic> json) =
      _$AssignInterventionDtoImpl.fromJson;

  @override
  String get agentId;

  /// Create a copy of AssignInterventionDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AssignInterventionDtoImplCopyWith<_$AssignInterventionDtoImpl>
  get copyWith => throw _privateConstructorUsedError;
}
