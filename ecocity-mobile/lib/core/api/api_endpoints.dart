/// Central registry of the EcoCity backend REST routes.
///
/// ⚠️ Ces chemins doivent rester strictement identiques à ceux exposés par
/// le backend NestJS existant. Si une route diffère dans le backend réel,
/// corrige UNIQUEMENT cette constante — ne renomme jamais les DTO associés.
class ApiEndpoints {
  ApiEndpoints._();

  // ---- Auth --------------------------------------------------------------
  static const String login = '/auth/login';
  static const String refresh = '/auth/refresh';
  static const String logout = '/auth/logout';
  static const String me = '/auth/me';

  // ---- Categories ----------------------------------------------------------
  static const String categories = '/categories';

  // ---- Reports (CITIZEN) --------------------------------------------------
  static const String reports = '/reports';
  static String reportById(String id) => '/reports/$id';
  static String myReports = '/reports/me';
  static String reportComments(String reportId) => '/reports/$reportId/comments';

  // ---- Interventions (AGENT / TEAM_LEADER) --------------------------------
  static const String interventions = '/interventions';
  static String interventionById(String id) => '/interventions/$id';
  static String interventionAssign(String id) => '/interventions/$id/assign';
  static String interventionStatus(String id) => '/interventions/$id/status';
  static String interventionComments(String id) => '/interventions/$id/comments';
  static String interventionPhotoBefore(String id) => '/interventions/$id/photos/before';
  static String interventionPhotoAfter(String id) => '/interventions/$id/photos/after';
  static const String myInterventions = '/interventions/me';
  static const String unassignedInterventions = '/interventions/unassigned';

  // ---- Team (TEAM_LEADER) --------------------------------------------------
  static const String teamAgents = '/team/agents';
  static String agentById(String id) => '/team/agents/$id';
  static const String teamStats = '/team/stats';
  static const String myZones = '/team/zones';

  // ---- Collections (missions de collecte planifiées, AGENT / TEAM_LEADER) --
  static const String todayCollections = '/collections/today';
  static const String myTeamCollections = '/collections/my-team';
  static String collectionById(String id) => '/collections/$id';
  static String startCollection(String id) => '/collections/$id/start';
  static String completeCollection(String id) => '/collections/$id/complete';
  static String collectionProblem(String id) => '/collections/$id/problem';

  // ---- Dashboard -----------------------------------------------------------
  static const String citizenStats = '/dashboard/citizen';
  static const String agentStats = '/dashboard/agent';
  static const String teamLeaderStats = '/dashboard/team-leader';
}
