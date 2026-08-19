import 'package:freezed_annotation/freezed_annotation.dart';

part 'complete_collection_dto.freezed.dart';
part 'complete_collection_dto.g.dart';

/// Mirrors backend `CompleteCollectionDto` — POST /collections/:id/complete.
@freezed
class CompleteCollectionDto with _$CompleteCollectionDto {
  const factory CompleteCollectionDto({
    String? comment,
  }) = _CompleteCollectionDto;

  factory CompleteCollectionDto.fromJson(Map<String, dynamic> json) =>
      _$CompleteCollectionDtoFromJson(json);
}
