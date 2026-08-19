import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../auth/auth_provider.dart';
import '../auth/auth_state.dart';
import '../../features/auth/domain/models/user_role.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/splash_screen.dart';

import '../../features/citizen/presentation/shell/citizen_home_shell.dart';
import '../../features/citizen/presentation/screens/citizen_home_screen.dart';
import '../../features/citizen/presentation/screens/new_report_screen.dart';
import '../../features/citizen/presentation/screens/my_reports_screen.dart';
import '../../features/citizen/presentation/screens/report_detail_screen.dart';
import '../../features/citizen/presentation/screens/citizen_profile_screen.dart';

import '../../features/agent/presentation/shell/agent_home_shell.dart';
import '../../features/agent/presentation/screens/agent_dashboard_screen.dart';
import '../../features/agent/presentation/screens/intervention_list_screen.dart';
import '../../features/agent/presentation/screens/intervention_detail_screen.dart';
import '../../features/agent/presentation/screens/agent_map_screen.dart';
import '../../features/agent/presentation/screens/agent_profile_screen.dart';

import '../../features/team_leader/presentation/shell/team_leader_home_shell.dart';
import '../../features/team_leader/presentation/screens/team_leader_dashboard_screen.dart';
import '../../features/team_leader/presentation/screens/team_screen.dart';
import '../../features/team_leader/presentation/screens/interventions_to_assign_screen.dart';
import '../../features/team_leader/presentation/screens/team_leader_profile_screen.dart';

/// Routes de l'application EcoCity.
///
/// L'utilisateur ne choisit jamais manuellement son interface.
/// Le rôle retourné par le backend détermine automatiquement
/// le shell et les écrans accessibles.
abstract class AppRoutes {
  static const splash = '/';
  static const login = '/login';

  // ---------------------------------------------------------------------------
  // CITIZEN
  // ---------------------------------------------------------------------------

  static const citizenHome = '/citizen/home';
  static const citizenNewReport = '/citizen/new-report';
  static const citizenMyReports = '/citizen/my-reports';
  static const citizenReportDetail = '/citizen/reports/:id';
  static const citizenProfile = '/citizen/profile';

  // ---------------------------------------------------------------------------
  // AGENT
  // ---------------------------------------------------------------------------

  static const agentDashboard = '/agent/dashboard';
  static const agentInterventions = '/agent/interventions';
  static const agentInterventionDetail =
      '/agent/interventions/:id';
  static const agentMap = '/agent/map';
  static const agentProfile = '/agent/profile';

  // ---------------------------------------------------------------------------
  // TEAM LEADER
  // ---------------------------------------------------------------------------

  static const teamLeaderDashboard =
      '/team-leader/dashboard';

  static const teamLeaderTeam =
      '/team-leader/team';

  static const teamLeaderAssign =
      '/team-leader/interventions-to-assign';

  static const teamLeaderProfile =
      '/team-leader/profile';
}

/// Provider principal du router EcoCity.
final routerProvider = Provider<GoRouter>((ref) {
  final router = GoRouter(
    initialLocation: AppRoutes.splash,

    redirect: (context, state) {
      final authState = ref.read(authProvider);

      final loggingIn =
          state.matchedLocation == AppRoutes.login;

      final atSplash =
          state.matchedLocation == AppRoutes.splash;

      // -----------------------------------------------------------------------
      // SESSION EN COURS DE RESTAURATION
      // -----------------------------------------------------------------------

      if (authState.status == AuthStatus.unknown) {
        return atSplash ? null : AppRoutes.splash;
      }

      // -----------------------------------------------------------------------
      // UTILISATEUR NON CONNECTÉ
      // -----------------------------------------------------------------------

      if (authState.status == AuthStatus.unauthenticated ||
          authState.status == AuthStatus.authenticating) {
        return loggingIn ? null : AppRoutes.login;
      }

      // -----------------------------------------------------------------------
      // UTILISATEUR CONNECTÉ
      // -----------------------------------------------------------------------

      if (authState.status == AuthStatus.authenticated) {
        final user = authState.user;

        // Sécurité : état authenticated mais utilisateur absent.
        if (user == null) {
          return AppRoutes.login;
        }

        // L'utilisateur est connecté.
        // Il ne doit pas rester sur login ou splash.
        if (loggingIn || atSplash) {
          return _homeForRole(user.role);
        }

        // Empêche un utilisateur d'accéder à l'interface
        // d'un autre rôle.
        if (!_locationMatchesRole(
          state.matchedLocation,
          user.role,
        )) {
          return _homeForRole(user.role);
        }
      }

      return null;
    },

    routes: [
      // -----------------------------------------------------------------------
      // PUBLIC
      // -----------------------------------------------------------------------

      GoRoute(
        path: AppRoutes.splash,
        builder: (_, __) => const SplashScreen(),
      ),

      GoRoute(
        path: AppRoutes.login,
        builder: (_, __) => const LoginScreen(),
      ),

      // -----------------------------------------------------------------------
      // CITIZEN SHELL
      // -----------------------------------------------------------------------

      ShellRoute(
        builder: (context, state, child) {
          return CitizenHomeShell(
            child: child,
          );
        },
        routes: [
          GoRoute(
            path: AppRoutes.citizenHome,
            builder: (_, __) =>
                const CitizenHomeScreen(),
          ),

          GoRoute(
            path: AppRoutes.citizenNewReport,
            builder: (_, __) =>
                const NewReportScreen(),
          ),

          GoRoute(
            path: AppRoutes.citizenMyReports,
            builder: (_, __) =>
                const MyReportsScreen(),
          ),

          GoRoute(
            path: AppRoutes.citizenReportDetail,
            builder: (_, state) {
              final reportId =
                  state.pathParameters['id'];

              if (reportId == null ||
                  reportId.isEmpty) {
                return const Scaffold(
                  body: Center(
                    child: Text(
                      'Signalement introuvable',
                    ),
                  ),
                );
              }

              return ReportDetailScreen(
                reportId: reportId,
              );
            },
          ),

          GoRoute(
            path: AppRoutes.citizenProfile,
            builder: (_, __) =>
                const CitizenProfileScreen(),
          ),
        ],
      ),

      // -----------------------------------------------------------------------
      // AGENT SHELL
      // -----------------------------------------------------------------------

      ShellRoute(
        builder: (context, state, child) {
          return AgentHomeShell(
            child: child,
          );
        },
        routes: [
          GoRoute(
            path: AppRoutes.agentDashboard,
            builder: (_, __) =>
                const AgentDashboardScreen(),
          ),

          GoRoute(
            path: AppRoutes.agentInterventions,
            builder: (_, __) =>
                const InterventionListScreen(),
          ),

          GoRoute(
            path: AppRoutes.agentInterventionDetail,
            builder: (_, state) {
              final interventionId =
                  state.pathParameters['id'];

              if (interventionId == null ||
                  interventionId.isEmpty) {
                return const Scaffold(
                  body: Center(
                    child: Text(
                      'Intervention introuvable',
                    ),
                  ),
                );
              }

              return InterventionDetailScreen(
                interventionId: interventionId,
              );
            },
          ),

          GoRoute(
            path: AppRoutes.agentMap,
            builder: (_, __) =>
                const AgentMapScreen(),
          ),

          GoRoute(
            path: AppRoutes.agentProfile,
            builder: (_, __) =>
                const AgentProfileScreen(),
          ),
        ],
      ),

      // -----------------------------------------------------------------------
      // TEAM LEADER SHELL
      // -----------------------------------------------------------------------

      ShellRoute(
        builder: (context, state, child) {
          return TeamLeaderHomeShell(
            child: child,
          );
        },
        routes: [
          GoRoute(
            path: AppRoutes.teamLeaderDashboard,
            builder: (_, __) =>
                const TeamLeaderDashboardScreen(),
          ),

          GoRoute(
            path: AppRoutes.teamLeaderTeam,
            builder: (_, __) =>
                const TeamScreen(),
          ),

          GoRoute(
            path: AppRoutes.teamLeaderAssign,
            builder: (_, __) =>
                const InterventionsToAssignScreen(),
          ),

          GoRoute(
            path: AppRoutes.teamLeaderProfile,
            builder: (_, __) =>
                const TeamLeaderProfileScreen(),
          ),
        ],
      ),
    ],
  );

  // ---------------------------------------------------------------------------
  // RIVERPOD → GOROUTER
  // ---------------------------------------------------------------------------
  //
  // NotifierProvider n'expose pas `.stream`.
  //
  // On écoute directement authProvider et on demande à GoRouter
  // de réévaluer son redirect lorsque l'état d'authentification change.
  //
  ref.listen<AuthState>(
    authProvider,
    (previous, next) {
      if (previous?.status != next.status ||
          previous?.user != next.user) {
        router.refresh();
      }
    },
  );

  return router;
});

/// Retourne la page d'accueil correspondant au rôle connecté.
///
/// Le rôle vient du backend et l'utilisateur ne choisit jamais
/// manuellement son interface.
String _homeForRole(UserRole role) {
  switch (role) {
    case UserRole.citizen:
      return AppRoutes.citizenHome;

    case UserRole.agent:
      return AppRoutes.agentDashboard;

    case UserRole.teamLeader:
      return AppRoutes.teamLeaderDashboard;
  }
}

/// Vérifie qu'un utilisateur reste dans les routes correspondant
/// à son rôle.
bool _locationMatchesRole(
  String location,
  UserRole role,
) {
  switch (role) {
    case UserRole.citizen:
      return location.startsWith('/citizen');

    case UserRole.agent:
      return location.startsWith('/agent');

    case UserRole.teamLeader:
      return location.startsWith('/team-leader');
  }
}