import 'package:freezed_annotation/freezed_annotation.dart';
import '../../features/auth/domain/models/user_model.dart';

part 'auth_state.freezed.dart';

enum AuthStatus { unknown, authenticating, authenticated, unauthenticated }

@freezed
class AuthState with _$AuthState {
  const factory AuthState({
    @Default(AuthStatus.unknown) AuthStatus status,
    UserModel? user,
    String? errorMessage,
  }) = _AuthState;
}
