import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../../shared/domain/dto/assign_intervention_dto.dart';
import '../../shared/domain/models/intervention_model.dart';
import '../domain/team_leader_dashboard_model.dart';

final teamLeaderDashboardRepositoryProvider = Provider((ref) {
  return TeamLeaderDashboardRepository(ref.watch(dioProvider));
});

class TeamLeaderDashboardRepository {
  TeamLeaderDashboardRepository(this._dio);
  final Dio _dio;

  /// GET /dashboard/team-leader
  Future<TeamLeaderDashboardModel> fetch() async {
    final response = await _dio.get(ApiEndpoints.teamLeaderStats);
    return TeamLeaderDashboardModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }
}

final teamLeaderDashboardProvider =
    FutureProvider.autoDispose<TeamLeaderDashboardModel>((ref) {
  return ref.watch(teamLeaderDashboardRepositoryProvider).fetch();
});

final teamRepositoryProvider = Provider((ref) {
  return TeamRepository(ref.watch(dioProvider));
});

class TeamRepository {
  TeamRepository(this._dio);
  final Dio _dio;

  /// GET /team/agents
  Future<List<AgentSummaryModel>> fetchAgents() async {
    final response = await _dio.get(ApiEndpoints.teamAgents);
    final list = response.data['data'] as List;
    return list.map((e) => AgentSummaryModel.fromJson(e as Map<String, dynamic>)).toList();
  }
}

final teamAgentsProvider = FutureProvider.autoDispose<List<AgentSummaryModel>>((ref) {
  return ref.watch(teamRepositoryProvider).fetchAgents();
});

/// Convenience wrapper so the "Interventions à affecter" screen can
/// (ré)affecter without importing the full InterventionRepository directly.
final assignInterventionActionProvider = Provider((ref) {
  return (String interventionId, String agentId) async {
    final dio = ref.read(dioProvider);
    await dio.post(
      ApiEndpoints.interventionAssign(interventionId),
      data: AssignInterventionDto(agentId: agentId).toJson(),
    );
  };
});
