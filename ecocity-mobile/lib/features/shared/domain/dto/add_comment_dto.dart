import 'package:freezed_annotation/freezed_annotation.dart';

part 'add_comment_dto.freezed.dart';
part 'add_comment_dto.g.dart';

/// Mirrors backend `AddCommentDto` / `AddInterventionCommentDto` — le champ
/// s'appelle `message`, pas `content`.
@freezed
class AddCommentDto with _$AddCommentDto {
  const factory AddCommentDto({
    required String message,
  }) = _AddCommentDto;

  factory AddCommentDto.fromJson(Map<String, dynamic> json) =>
      _$AddCommentDtoFromJson(json);
}
