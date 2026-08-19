import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../domain/dto/create_report_dto.dart';
import '../domain/models/report_model.dart';

final reportRepositoryProvider = Provider<ReportRepository>((ref) {
  return ReportRepository(ref.watch(dioProvider));
});

class ReportRepository {
  ReportRepository(this._dio);
  final Dio _dio;

  /// POST /reports (multipart/form-data) — field names below MUST match
  /// `CreateReportDto` on the backend exactly.
  Future<ReportModel> createReport(
    CreateReportDto dto, {
    void Function(int sent, int total)? onProgress,
  }) async {
    final formData = FormData.fromMap({
      'title': dto.title,
      'description': dto.description,
      'categoryId': dto.categoryId,
      'priority': dto.priority,
      'latitude': dto.latitude,
      'longitude': dto.longitude,
      'address': dto.address,
      'photo': await MultipartFile.fromFile(
        dto.photo.path,
        filename: dto.photo.path.split('/').last,
      ),
    });

    final response = await _dio.post(
      ApiEndpoints.reports,
      data: formData,
      onSendProgress: onProgress,
    );

    return ReportModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  /// GET /reports/me
  Future<List<ReportModel>> fetchMyReports() async {
    final response = await _dio.get(ApiEndpoints.myReports);
    final list = response.data['data'] as List;
    return list
        .map((e) => ReportModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET /reports/:id
  Future<ReportModel> fetchReportDetail(String id) async {
    final response = await _dio.get(ApiEndpoints.reportById(id));
    return ReportModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }
}

final myReportsProvider = FutureProvider.autoDispose<List<ReportModel>>((ref) {
  return ref.watch(reportRepositoryProvider).fetchMyReports();
});

final reportDetailProvider =
    FutureProvider.autoDispose.family<ReportModel, String>((ref, id) {
  return ref.watch(reportRepositoryProvider).fetchReportDetail(id);
});
