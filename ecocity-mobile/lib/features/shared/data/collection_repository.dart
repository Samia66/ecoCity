import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../domain/dto/complete_collection_dto.dart';
import '../domain/dto/report_collection_problem_dto.dart';
import '../domain/models/collection_model.dart';
import '../domain/models/zone_model.dart';

final collectionRepositoryProvider = Provider<CollectionRepository>((ref) {
  return CollectionRepository(ref.watch(dioProvider));
});

class CollectionRepository {
  CollectionRepository(this._dio);
  final Dio _dio;

  /// GET /collections/today — scopé côté backend à l'équipe de l'appelant.
  Future<List<CollectionModel>> fetchToday() async {
    final response = await _dio.get(ApiEndpoints.todayCollections);
    final list = response.data['data'] as List;
    return list
        .map((e) => CollectionModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET /collections/my-team — historique complet de l'équipe (pas
  /// seulement aujourd'hui).
  Future<List<CollectionModel>> fetchMyTeam() async {
    final response = await _dio.get(ApiEndpoints.myTeamCollections);
    final list = response.data['data'] as List;
    return list
        .map((e) => CollectionModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET /collections/:id
  Future<CollectionModel> fetchDetail(String id) async {
    final response = await _dio.get(ApiEndpoints.collectionById(id));
    return CollectionModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  /// GET /team/zones — zones affectées à l'équipe de l'appelant.
  Future<List<ZoneModel>> fetchMyZones() async {
    final response = await _dio.get(ApiEndpoints.myZones);
    final list = response.data['data'] as List;
    return list.map((e) => ZoneModel.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// POST /collections/:id/start
  Future<void> start(String id) async {
    await _dio.post(ApiEndpoints.startCollection(id));
  }

  /// POST /collections/:id/complete
  Future<void> complete(String id, CompleteCollectionDto dto) async {
    await _dio.post(ApiEndpoints.completeCollection(id), data: dto.toJson());
  }

  /// POST /collections/:id/problem
  Future<void> reportProblem(String id, ReportCollectionProblemDto dto) async {
    await _dio.post(ApiEndpoints.collectionProblem(id), data: dto.toJson());
  }
}

final todayCollectionsProvider =
    FutureProvider.autoDispose<List<CollectionModel>>((ref) {
  return ref.watch(collectionRepositoryProvider).fetchToday();
});

final myTeamCollectionsProvider =
    FutureProvider.autoDispose<List<CollectionModel>>((ref) {
  return ref.watch(collectionRepositoryProvider).fetchMyTeam();
});

final collectionDetailProvider =
    FutureProvider.autoDispose.family<CollectionModel, String>((ref, id) {
  return ref.watch(collectionRepositoryProvider).fetchDetail(id);
});

final myZonesProvider = FutureProvider.autoDispose<List<ZoneModel>>((ref) {
  return ref.watch(collectionRepositoryProvider).fetchMyZones();
});
