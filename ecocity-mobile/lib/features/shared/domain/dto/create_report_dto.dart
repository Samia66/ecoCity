import 'dart:io';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'create_report_dto.freezed.dart';

/// Mirrors the backend's `CreateReportDto` exactly:
/// title, description, categoryId, priority, latitude, longitude, address,
/// photo (multipart file, champ "photo").
///
/// NOTE: `photo` est exclu de `toJson` — voir `toFormData` dans
/// `report_repository.dart`, qui construit la requête multipart/form-data.
@freezed
class CreateReportDto with _$CreateReportDto {
  const factory CreateReportDto({
    required String title,
    required String description,
    required String categoryId,
    required String priority, // BASSE | MOYENNE | HAUTE | CRITIQUE
    required double latitude,
    required double longitude,
    required String address,
    required File photo,
  }) = _CreateReportDto;
}
