import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../domain/dto/add_comment_dto.dart';
import '../domain/dto/assign_intervention_dto.dart';
import '../domain/dto/update_intervention_status_dto.dart';
import '../domain/models/intervention_model.dart';
import '../domain/models/unassigned_report_model.dart';

final interventionRepositoryProvider = Provider<InterventionRepository>((ref) {
  return InterventionRepository(ref.watch(dioProvider));
});

class InterventionRepository {
  InterventionRepository(this._dio);
  final Dio _dio;

  /// GET /interventions/me — filtered/sorted client-side by the caller.
  Future<List<InterventionModel>> fetchMyInterventions() async {
    final response = await _dio.get(ApiEndpoints.myInterventions);
    final list = response.data['data'] as List;
    return list
        .map((e) => InterventionModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET /interventions/unassigned — signalements en attente d'affectation
  /// (pas encore d'InterventionModel puisqu'aucune intervention n'existe).
  Future<List<UnassignedReportModel>> fetchUnassigned() async {
    final response = await _dio.get(ApiEndpoints.unassignedInterventions);
    final list = response.data['data'] as List;
    return list
        .map((e) => UnassignedReportModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET /interventions/:id
  Future<InterventionModel> fetchDetail(String id) async {
    final response = await _dio.get(ApiEndpoints.interventionById(id));
    return InterventionModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  /// POST /interventions/:id/assign — AssignInterventionDto.
  /// `id` accepte indifféremment un id de signalement (première affectation,
  /// cas de cet écran) ou un id d'intervention existante (réaffectation).
  Future<void> assign(String id, AssignInterventionDto dto) async {
    await _dio.post(
      ApiEndpoints.interventionAssign(id),
      data: dto.toJson(),
    );
  }

  /// PATCH /interventions/:id/status — UpdateInterventionStatusDto
  /// Drives Accepter / Démarrer / Rejeter / Résoudre.
  Future<void> updateStatus(String interventionId, UpdateInterventionStatusDto dto) async {
    await _dio.patch(
      ApiEndpoints.interventionStatus(interventionId),
      data: dto.toJson(),
    );
  }

  /// POST /interventions/:id/comments — AddCommentDto
  Future<void> addComment(String interventionId, AddCommentDto dto) async {
    await _dio.post(
      ApiEndpoints.interventionComments(interventionId),
      data: dto.toJson(),
    );
  }

  /// POST /interventions/:id/photos/before ou /photos/after — multipart.
  /// À appeler AVANT `updateStatus(..., status: 'TERMINEE')` pour la photo
  /// "après" : le backend n'accepte plus de photo directement dans le body
  /// de la mise à jour de statut.
  Future<void> uploadPhoto(String interventionId, File photo, {required bool isBefore}) async {
    final endpoint = isBefore
        ? ApiEndpoints.interventionPhotoBefore(interventionId)
        : ApiEndpoints.interventionPhotoAfter(interventionId);
    final formData = FormData.fromMap({
      'photo': await MultipartFile.fromFile(photo.path, filename: photo.path.split('/').last),
    });
    await _dio.post(endpoint, data: formData);
  }
}

final myInterventionsProvider =
    FutureProvider.autoDispose<List<InterventionModel>>((ref) {
  return ref.watch(interventionRepositoryProvider).fetchMyInterventions();
});

final unassignedInterventionsProvider =
    FutureProvider.autoDispose<List<UnassignedReportModel>>((ref) {
  return ref.watch(interventionRepositoryProvider).fetchUnassigned();
});

final interventionDetailProvider =
    FutureProvider.autoDispose.family<InterventionModel, String>((ref, id) {
  return ref.watch(interventionRepositoryProvider).fetchDetail(id);
});
