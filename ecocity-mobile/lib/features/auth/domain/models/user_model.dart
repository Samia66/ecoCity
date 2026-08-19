import 'package:freezed_annotation/freezed_annotation.dart';
import 'user_role.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

/// Matches the `user` object nested inside the backend login response:
/// { id, firstName, lastName, email, role }
@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String firstName,
    required String lastName,
    required String email,
    required UserRole role,
    String? phone,
    String? avatarUrl,
  }) = _UserModel;

  const UserModel._();

  String get fullName => '$firstName $lastName';

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}
