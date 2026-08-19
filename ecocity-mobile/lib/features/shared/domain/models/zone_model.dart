import 'package:freezed_annotation/freezed_annotation.dart';

part 'zone_model.freezed.dart';
part 'zone_model.g.dart';

/// Correspond à `TeamZoneDto` renvoyé par `GET /team/zones` — zone de
/// collecte affectée à l'équipe de l'utilisateur connecté (chef ou agent).
@freezed
class ZoneModel with _$ZoneModel {
  const factory ZoneModel({
    required String id,
    required String name,
    String? description,
  }) = _ZoneModel;

  factory ZoneModel.fromJson(Map<String, dynamic> json) =>
      _$ZoneModelFromJson(json);
}
