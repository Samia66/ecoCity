import 'package:json_annotation/json_annotation.dart';

/// Mirrors the `role` string returned by the backend exactly.
/// Only these three roles are ever routed to the mobile app;
/// SUPER_ADMIN / ADMIN belong to the Angular admin console.
@JsonEnum(valueField: 'value')
enum UserRole {
  citizen('CITIZEN'),
  agent('AGENT'),
  teamLeader('TEAM_LEADER');

  const UserRole(this.value);
  final String value;

  static UserRole fromString(String raw) {
    return UserRole.values.firstWhere(
      (r) => r.value == raw,
      orElse: () => throw ArgumentError('Unknown role: $raw'),
    );
  }
}
