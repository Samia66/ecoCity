/// Environment configuration for the EcoCity mobile client.
///
/// Switch [Environment.current] (or pass --dart-define=ENV=prod) to point
/// the app at the existing EcoCity NestJS backend. Nothing here invents new
/// routes — see [ApiEndpoints] for the exact paths consumed.
enum Environment { dev, prod }

class AppConfig {
  AppConfig._();

  static const Environment current = String.fromEnvironment('ENV') == 'prod'
      ? Environment.prod
      : Environment.dev;

  static const String _devBaseUrl = 'http://localhost:3000/api/v1';
  static const String _prodBaseUrl = 'https://api.ecocity.app/api/v1';

  static String get baseUrl =>
      current == Environment.prod ? _prodBaseUrl : _devBaseUrl;

  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 20);
}
