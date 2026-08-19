// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'add_comment_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

AddCommentDto _$AddCommentDtoFromJson(Map<String, dynamic> json) {
  return _AddCommentDto.fromJson(json);
}

/// @nodoc
mixin _$AddCommentDto {
  String get message => throw _privateConstructorUsedError;

  /// Serializes this AddCommentDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AddCommentDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AddCommentDtoCopyWith<AddCommentDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AddCommentDtoCopyWith<$Res> {
  factory $AddCommentDtoCopyWith(
    AddCommentDto value,
    $Res Function(AddCommentDto) then,
  ) = _$AddCommentDtoCopyWithImpl<$Res, AddCommentDto>;
  @useResult
  $Res call({String message});
}

/// @nodoc
class _$AddCommentDtoCopyWithImpl<$Res, $Val extends AddCommentDto>
    implements $AddCommentDtoCopyWith<$Res> {
  _$AddCommentDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AddCommentDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? message = null}) {
    return _then(
      _value.copyWith(
            message: null == message
                ? _value.message
                : message // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AddCommentDtoImplCopyWith<$Res>
    implements $AddCommentDtoCopyWith<$Res> {
  factory _$$AddCommentDtoImplCopyWith(
    _$AddCommentDtoImpl value,
    $Res Function(_$AddCommentDtoImpl) then,
  ) = __$$AddCommentDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String message});
}

/// @nodoc
class __$$AddCommentDtoImplCopyWithImpl<$Res>
    extends _$AddCommentDtoCopyWithImpl<$Res, _$AddCommentDtoImpl>
    implements _$$AddCommentDtoImplCopyWith<$Res> {
  __$$AddCommentDtoImplCopyWithImpl(
    _$AddCommentDtoImpl _value,
    $Res Function(_$AddCommentDtoImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AddCommentDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? message = null}) {
    return _then(
      _$AddCommentDtoImpl(
        message: null == message
            ? _value.message
            : message // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AddCommentDtoImpl implements _AddCommentDto {
  const _$AddCommentDtoImpl({required this.message});

  factory _$AddCommentDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$AddCommentDtoImplFromJson(json);

  @override
  final String message;

  @override
  String toString() {
    return 'AddCommentDto(message: $message)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AddCommentDtoImpl &&
            (identical(other.message, message) || other.message == message));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, message);

  /// Create a copy of AddCommentDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AddCommentDtoImplCopyWith<_$AddCommentDtoImpl> get copyWith =>
      __$$AddCommentDtoImplCopyWithImpl<_$AddCommentDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AddCommentDtoImplToJson(this);
  }
}

abstract class _AddCommentDto implements AddCommentDto {
  const factory _AddCommentDto({required final String message}) =
      _$AddCommentDtoImpl;

  factory _AddCommentDto.fromJson(Map<String, dynamic> json) =
      _$AddCommentDtoImpl.fromJson;

  @override
  String get message;

  /// Create a copy of AddCommentDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AddCommentDtoImplCopyWith<_$AddCommentDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
