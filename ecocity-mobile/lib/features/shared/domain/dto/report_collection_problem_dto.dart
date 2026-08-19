import 'package:freezed_annotation/freezed_annotation.dart';

part 'report_collection_problem_dto.freezed.dart';
part 'report_collection_problem_dto.g.dart';

/// Mirrors backend `ReportProblemDto` — POST /collections/:id/problem.
@freezed
class ReportCollectionProblemDto with _$ReportCollectionProblemDto {
  const factory ReportCollectionProblemDto({
    required String problemDescription,
  }) = _ReportCollectionProblemDto;

  factory ReportCollectionProblemDto.fromJson(Map<String, dynamic> json) =>
      _$ReportCollectionProblemDtoFromJson(json);
}
