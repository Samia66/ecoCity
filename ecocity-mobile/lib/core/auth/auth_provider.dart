import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/auth/data/auth_repository.dart';
import 'auth_state.dart';

final authProvider = NotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);

/// Single source of truth for the current session.
///
/// [AppRouter] listens to this via `authProvider.notifier.stream` to decide
/// which shell to load — CitizenHomeShell / AgentHomeShell /
/// TeamLeaderHomeShell — purely from `user.role`. The user never picks
/// their interface manually.
class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    _restoreSession();
    return const AuthState(status: AuthStatus.unknown);
  }

  Future<void> _restoreSession() async {
    final repo = ref.read(authRepositoryProvider);
    final user = await repo.tryRestoreSession();
    state = user != null
        ? AuthState(status: AuthStatus.authenticated, user: user)
        : const AuthState(status: AuthStatus.unauthenticated);
  }

  Future<void> login({required String email, required String password}) async {
    state = state.copyWith(status: AuthStatus.authenticating, errorMessage: null);
    try {
      final repo = ref.read(authRepositoryProvider);
      final user = await repo.login(email: email, password: password);
      state = AuthState(status: AuthStatus.authenticated, user: user);
    } catch (e) {
      state = AuthState(
        status: AuthStatus.unauthenticated,
        errorMessage: 'Identifiants invalides. Veuillez réessayer.',
      );
    }
  }

  Future<void> logout() async {
    final repo = ref.read(authRepositoryProvider);
    await repo.logout();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }
}
