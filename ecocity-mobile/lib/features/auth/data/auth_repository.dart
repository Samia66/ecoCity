import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../domain/models/auth_response_model.dart';
import '../domain/models/user_model.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    dio: ref.watch(dioProvider),
    storage: ref.watch(secureStorageProvider),
  );
});

class AuthRepository {
  AuthRepository({required Dio dio, required SecureStorageService storage})
      : _dio = dio,
        _storage = storage;

  final Dio _dio;
  final SecureStorageService _storage;

  /// POST /auth/login → { data: { accessToken, refreshToken, user } }
  Future<UserModel> login({
    required String email,
    required String password,
  }) async {
    final response = await _dio.post(
      ApiEndpoints.login,
      data: {'email': email, 'password': password},
    );

    final auth = AuthResponseModel.fromJson(
      response.data['data'] as Map<String, dynamic>,
    );

    await _storage.saveTokens(
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
    );

    return auth.user;
  }

  Future<UserModel?> tryRestoreSession() async {
    final token = await _storage.accessToken;
    if (token == null) return null;

    try {
      final response = await _dio.get(ApiEndpoints.me);
      return UserModel.fromJson(response.data['data'] as Map<String, dynamic>);
    } on DioException {
      await _storage.clear();
      return null;
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post(ApiEndpoints.logout);
    } catch (_) {
      // best-effort — always clear locally regardless of server response
    }
    await _storage.clear();
  }
}
