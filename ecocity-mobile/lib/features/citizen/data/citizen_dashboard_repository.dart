import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../domain/citizen_dashboard_model.dart';

final citizenDashboardRepositoryProvider = Provider((ref) {
  return CitizenDashboardRepository(ref.watch(dioProvider));
});

class CitizenDashboardRepository {
  CitizenDashboardRepository(this._dio);
  final Dio _dio;

  /// GET /dashboard/citizen
  Future<CitizenDashboardModel> fetch() async {
    final response = await _dio.get(ApiEndpoints.citizenStats);
    return CitizenDashboardModel.fromJson(
      response.data['data'] as Map<String, dynamic>,
    );
  }
}

final citizenDashboardProvider =
    FutureProvider.autoDispose<CitizenDashboardModel>((ref) {
  return ref.watch(citizenDashboardRepositoryProvider).fetch();
});
