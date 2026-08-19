// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'create_report_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

/// @nodoc
mixin _$CreateReportDto {
  String get title => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  String get categoryId => throw _privateConstructorUsedError;
  String get priority =>
      throw _privateConstructorUsedError; // BASSE | MOYENNE | HAUTE | CRITIQUE
  double get latitude => throw _privateConstructorUsedError;
  double get longitude => throw _privateConstructorUsedError;
  String get address => throw _privateConstructorUsedError;
  File get photo => throw _privateConstructorUsedError;

  /// Create a copy of CreateReportDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CreateReportDtoCopyWith<CreateReportDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CreateReportDtoCopyWith<$Res> {
  factory $CreateReportDtoCopyWith(
    CreateReportDto value,
    $Res Function(CreateReportDto) then,
  ) = _$CreateReportDtoCopyWithImpl<$Res, CreateReportDto>;
  @useResult
  $Res call({
    String title,
    String description,
    String categoryId,
    String priority,
    double latitude,
    double longitude,
    String address,
    File photo,
  });
}

/// @nodoc
class _$CreateReportDtoCopyWithImpl<$Res, $Val extends CreateReportDto>
    implements $CreateReportDtoCopyWith<$Res> {
  _$CreateReportDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CreateReportDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? title = null,
    Object? description = null,
    Object? categoryId = null,
    Object? priority = null,
    Object? latitude = null,
    Object? longitude = null,
    Object? address = null,
    Object? photo = null,
  }) {
    return _then(
      _value.copyWith(
            title: null == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String,
            description: null == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String,
            categoryId: null == categoryId
                ? _value.categoryId
                : categoryId // ignore: cast_nullable_to_non_nullable
                      as String,
            priority: null == priority
                ? _value.priority
                : priority // ignore: cast_nullable_to_non_nullable
                      as String,
            latitude: null == latitude
                ? _value.latitude
                : latitude // ignore: cast_nullable_to_non_nullable
                      as double,
            longitude: null == longitude
                ? _value.longitude
                : longitude // ignore: cast_nullable_to_non_nullable
                      as double,
            address: null == address
                ? _value.address
                : address // ignore: cast_nullable_to_non_nullable
                      as String,
            photo: null == photo
                ? _value.photo
                : photo // ignore: cast_nullable_to_non_nullable
                      as File,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CreateReportDtoImplCopyWith<$Res>
    implements $CreateReportDtoCopyWith<$Res> {
  factory _$$CreateReportDtoImplCopyWith(
    _$CreateReportDtoImpl value,
    $Res Function(_$CreateReportDtoImpl) then,
  ) = __$$CreateReportDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String title,
    String description,
    String categoryId,
    String priority,
    double latitude,
    double longitude,
    String address,
    File photo,
  });
}

/// @nodoc
class __$$CreateReportDtoImplCopyWithImpl<$Res>
    extends _$CreateReportDtoCopyWithImpl<$Res, _$CreateReportDtoImpl>
    implements _$$CreateReportDtoImplCopyWith<$Res> {
  __$$CreateReportDtoImplCopyWithImpl(
    _$CreateReportDtoImpl _value,
    $Res Function(_$CreateReportDtoImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CreateReportDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? title = null,
    Object? description = null,
    Object? categoryId = null,
    Object? priority = null,
    Object? latitude = null,
    Object? longitude = null,
    Object? address = null,
    Object? photo = null,
  }) {
    return _then(
      _$CreateReportDtoImpl(
        title: null == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String,
        description: null == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String,
        categoryId: null == categoryId
            ? _value.categoryId
            : categoryId // ignore: cast_nullable_to_non_nullable
                  as String,
        priority: null == priority
            ? _value.priority
            : priority // ignore: cast_nullable_to_non_nullable
                  as String,
        latitude: null == latitude
            ? _value.latitude
            : latitude // ignore: cast_nullable_to_non_nullable
                  as double,
        longitude: null == longitude
            ? _value.longitude
            : longitude // ignore: cast_nullable_to_non_nullable
                  as double,
        address: null == address
            ? _value.address
            : address // ignore: cast_nullable_to_non_nullable
                  as String,
        photo: null == photo
            ? _value.photo
            : photo // ignore: cast_nullable_to_non_nullable
                  as File,
      ),
    );
  }
}

/// @nodoc

class _$CreateReportDtoImpl implements _CreateReportDto {
  const _$CreateReportDtoImpl({
    required this.title,
    required this.description,
    required this.categoryId,
    required this.priority,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.photo,
  });

  @override
  final String title;
  @override
  final String description;
  @override
  final String categoryId;
  @override
  final String priority;
  // BASSE | MOYENNE | HAUTE | CRITIQUE
  @override
  final double latitude;
  @override
  final double longitude;
  @override
  final String address;
  @override
  final File photo;

  @override
  String toString() {
    return 'CreateReportDto(title: $title, description: $description, categoryId: $categoryId, priority: $priority, latitude: $latitude, longitude: $longitude, address: $address, photo: $photo)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreateReportDtoImpl &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.categoryId, categoryId) ||
                other.categoryId == categoryId) &&
            (identical(other.priority, priority) ||
                other.priority == priority) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.photo, photo) || other.photo == photo));
  }

  @override
  int get hashCode => Object.hash(
    runtimeType,
    title,
    description,
    categoryId,
    priority,
    latitude,
    longitude,
    address,
    photo,
  );

  /// Create a copy of CreateReportDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CreateReportDtoImplCopyWith<_$CreateReportDtoImpl> get copyWith =>
      __$$CreateReportDtoImplCopyWithImpl<_$CreateReportDtoImpl>(
        this,
        _$identity,
      );
}

abstract class _CreateReportDto implements CreateReportDto {
  const factory _CreateReportDto({
    required final String title,
    required final String description,
    required final String categoryId,
    required final String priority,
    required final double latitude,
    required final double longitude,
    required final String address,
    required final File photo,
  }) = _$CreateReportDtoImpl;

  @override
  String get title;
  @override
  String get description;
  @override
  String get categoryId;
  @override
  String get priority; // BASSE | MOYENNE | HAUTE | CRITIQUE
  @override
  double get latitude;
  @override
  double get longitude;
  @override
  String get address;
  @override
  File get photo;

  /// Create a copy of CreateReportDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CreateReportDtoImplCopyWith<_$CreateReportDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
