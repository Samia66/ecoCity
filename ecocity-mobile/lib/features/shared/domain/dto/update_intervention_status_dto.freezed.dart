// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'update_intervention_status_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

UpdateInterventionStatusDto _$UpdateInterventionStatusDtoFromJson(
  Map<String, dynamic> json,
) {
  return _UpdateInterventionStatusDto.fromJson(json);
}

/// @nodoc
mixin _$UpdateInterventionStatusDto {
  String get status =>
      throw _privateConstructorUsedError; // ASSIGNEE | ACCEPTEE | EN_COURS | TERMINEE | REJETEE | ANNULEE
  String? get comment => throw _privateConstructorUsedError;

  /// Serializes this UpdateInterventionStatusDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UpdateInterventionStatusDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UpdateInterventionStatusDtoCopyWith<UpdateInterventionStatusDto>
  get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UpdateInterventionStatusDtoCopyWith<$Res> {
  factory $UpdateInterventionStatusDtoCopyWith(
    UpdateInterventionStatusDto value,
    $Res Function(UpdateInterventionStatusDto) then,
  ) =
      _$UpdateInterventionStatusDtoCopyWithImpl<
        $Res,
        UpdateInterventionStatusDto
      >;
  @useResult
  $Res call({String status, String? comment});
}

/// @nodoc
class _$UpdateInterventionStatusDtoCopyWithImpl<
  $Res,
  $Val extends UpdateInterventionStatusDto
>
    implements $UpdateInterventionStatusDtoCopyWith<$Res> {
  _$UpdateInterventionStatusDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UpdateInterventionStatusDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? status = null, Object? comment = freezed}) {
    return _then(
      _value.copyWith(
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as String,
            comment: freezed == comment
                ? _value.comment
                : comment // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$UpdateInterventionStatusDtoImplCopyWith<$Res>
    implements $UpdateInterventionStatusDtoCopyWith<$Res> {
  factory _$$UpdateInterventionStatusDtoImplCopyWith(
    _$UpdateInterventionStatusDtoImpl value,
    $Res Function(_$UpdateInterventionStatusDtoImpl) then,
  ) = __$$UpdateInterventionStatusDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String status, String? comment});
}

/// @nodoc
class __$$UpdateInterventionStatusDtoImplCopyWithImpl<$Res>
    extends
        _$UpdateInterventionStatusDtoCopyWithImpl<
          $Res,
          _$UpdateInterventionStatusDtoImpl
        >
    implements _$$UpdateInterventionStatusDtoImplCopyWith<$Res> {
  __$$UpdateInterventionStatusDtoImplCopyWithImpl(
    _$UpdateInterventionStatusDtoImpl _value,
    $Res Function(_$UpdateInterventionStatusDtoImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of UpdateInterventionStatusDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? status = null, Object? comment = freezed}) {
    return _then(
      _$UpdateInterventionStatusDtoImpl(
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as String,
        comment: freezed == comment
            ? _value.comment
            : comment // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$UpdateInterventionStatusDtoImpl
    implements _UpdateInterventionStatusDto {
  const _$UpdateInterventionStatusDtoImpl({required this.status, this.comment});

  factory _$UpdateInterventionStatusDtoImpl.fromJson(
    Map<String, dynamic> json,
  ) => _$$UpdateInterventionStatusDtoImplFromJson(json);

  @override
  final String status;
  // ASSIGNEE | ACCEPTEE | EN_COURS | TERMINEE | REJETEE | ANNULEE
  @override
  final String? comment;

  @override
  String toString() {
    return 'UpdateInterventionStatusDto(status: $status, comment: $comment)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UpdateInterventionStatusDtoImpl &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.comment, comment) || other.comment == comment));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, status, comment);

  /// Create a copy of UpdateInterventionStatusDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UpdateInterventionStatusDtoImplCopyWith<_$UpdateInterventionStatusDtoImpl>
  get copyWith =>
      __$$UpdateInterventionStatusDtoImplCopyWithImpl<
        _$UpdateInterventionStatusDtoImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UpdateInterventionStatusDtoImplToJson(this);
  }
}

abstract class _UpdateInterventionStatusDto
    implements UpdateInterventionStatusDto {
  const factory _UpdateInterventionStatusDto({
    required final String status,
    final String? comment,
  }) = _$UpdateInterventionStatusDtoImpl;

  factory _UpdateInterventionStatusDto.fromJson(Map<String, dynamic> json) =
      _$UpdateInterventionStatusDtoImpl.fromJson;

  @override
  String get status; // ASSIGNEE | ACCEPTEE | EN_COURS | TERMINEE | REJETEE | ANNULEE
  @override
  String? get comment;

  /// Create a copy of UpdateInterventionStatusDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UpdateInterventionStatusDtoImplCopyWith<_$UpdateInterventionStatusDtoImpl>
  get copyWith => throw _privateConstructorUsedError;
}
