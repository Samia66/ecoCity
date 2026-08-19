import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import 'package:logger/logger.dart';

import '../api/app_config.dart';
import '../api/api_endpoints.dart';
import '../storage/secure_storage_service.dart';

final loggerProvider = Provider<Logger>((ref) => Logger());

/// Provides a configured [Dio] instance wired to the EcoCity backend.
///
/// Attaches the Bearer access token to every request, and transparently
/// refreshes it via [ApiEndpoints.refresh] on a 401 before retrying once.
final dioProvider = Provider<Dio>((ref) {
  final storage = ref.watch(secureStorageProvider);
  final logger = ref.watch(loggerProvider);

  final dio = Dio(
    BaseOptions(
      baseUrl: AppConfig.baseUrl,
      connectTimeout: AppConfig.connectTimeout,
      receiveTimeout: AppConfig.receiveTimeout,
      headers: {'Content-Type': 'application/json'},
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await storage.accessToken;
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (DioException error, handler) async {
        final isUnauthorized = error.response?.statusCode == 401;
        final isRefreshCall = error.requestOptions.path == ApiEndpoints.refresh;

        if (isUnauthorized && !isRefreshCall) {
          final refreshed = await _tryRefreshToken(dio, storage, logger);
          if (refreshed != null) {
            final retryOptions = error.requestOptions;
            retryOptions.headers['Authorization'] = 'Bearer $refreshed';
            try {
              final response = await dio.fetch(retryOptions);
              return handler.resolve(response);
            } catch (_) {
              // fall through to reject below
            }
          } else {
            await storage.clear();
          }
        }
        handler.next(error);
      },
    ),
  );

  dio.interceptors.add(
    PrettyDioLogger(
      requestHeader: false,
      requestBody: true,
      responseBody: true,
      compact: true,
    ),
  );

  return dio;
});

Future<String?> _tryRefreshToken(
  Dio dio,
  SecureStorageService storage,
  Logger logger,
) async {
  try {
    final refreshToken = await storage.refreshToken;
    if (refreshToken == null) return null;

    final response = await dio.post(
      ApiEndpoints.refresh,
      data: {'refreshToken': refreshToken},
    );

    final data = response.data['data'];
    final newAccessToken = data['accessToken'] as String;
    final newRefreshToken = data['refreshToken'] as String;

    await storage.saveTokens(
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    );
    return newAccessToken;
  } catch (e) {
    logger.w('Token refresh failed: $e');
    return null;
  }
}
