import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../domain/agent_dashboard_model.dart';

final agentDashboardRepositoryProvider = Provider((ref) {
  return AgentDashboardRepository(ref.watch(dioProvider));
});

class AgentDashboardRepository {
  AgentDashboardRepository(this._dio);
  final Dio _dio;

  /// GET /dashboard/agent
  Future<AgentDashboardModel> fetch() async {
    final response = await _dio.get(ApiEndpoints.agentStats);
    return AgentDashboardModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }
}

final agentDashboardProvider = FutureProvider.autoDispose<AgentDashboardModel>((ref) {
  return ref.watch(agentDashboardRepositoryProvider).fetch();
});
