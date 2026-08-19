import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../core/auth/auth_provider.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/widgets/quick_action_button.dart';
import '../../../../core/widgets/recent_report_card.dart';
import '../../../../core/widgets/stats_card.dart';
import '../../data/citizen_dashboard_repository.dart';

class CitizenHomeScreen extends ConsumerWidget {
  const CitizenHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;
    final dashboardAsync = ref.watch(citizenDashboardProvider);

    return RefreshIndicator(
      onRefresh: () => ref.refresh(citizenDashboardProvider.future),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Carte de bienvenue
          Card(
            color: Theme.of(context).colorScheme.primary,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 26,
                    backgroundColor: Colors.white.withValues(alpha: 0.2),
                    child: Text(
                      (user?.firstName.isNotEmpty ?? false)
                          ? user!.firstName[0].toUpperCase()
                          : '?',
                      style: const TextStyle(
                          color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Bonjour 👋',
                            style: TextStyle(color: Colors.white70, fontSize: 13)),
                        Text(
                          user?.firstName ?? '',
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          QuickActionButton(
            label: 'Nouveau signalement',
            icon: Icons.add_a_photo_outlined,
            onTap: () => context.go(AppRoutes.citizenNewReport),
          ),
          const SizedBox(height: 20),

          dashboardAsync.when(
            data: (dashboard) => StatsGrid(
              children: [
                StatsCard(
                  label: 'Total signalements',
                  value: '${dashboard.total}',
                  icon: Icons.list_alt,
                ),
                StatsCard(
                  label: 'En attente',
                  value: '${dashboard.pending}',
                  icon: Icons.hourglass_empty,
                  color: Colors.orange,
                ),
                StatsCard(
                  label: 'En cours',
                  value: '${dashboard.inProgress}',
                  icon: Icons.autorenew,
                  color: Colors.blue,
                ),
                StatsCard(
                  label: 'Résolus',
                  value: '${dashboard.resolved}',
                  icon: Icons.check_circle_outline,
                  color: Colors.green,
                ),
              ],
            ),
            loading: () => Shimmer.fromColors(
              baseColor: Colors.grey.shade300,
              highlightColor: Colors.grey.shade100,
              child: StatsGrid(
                children: List.generate(
                  4,
                  (_) => Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ),
            ),
            error: (e, _) => const Text('Impossible de charger les statistiques.'),
          ),

          const SizedBox(height: 24),
          Text('Dernier signalement', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 10),
          dashboardAsync.when(
            data: (dashboard) => dashboard.lastReport == null
                ? const Text('Aucun signalement pour le moment.')
                : RecentReportCard(
                    title: dashboard.lastReport!.title,
                    category: dashboard.lastReport!.category,
                    statusValue: dashboard.lastReport!.status.value,
                    statusLabel: dashboard.lastReport!.status.label,
                    date: dashboard.lastReport!.createdAt,
                    photoUrl: dashboard.lastReport!.photoUrl,
                    onTap: () => context.push(
                      '/citizen/reports/${dashboard.lastReport!.id}',
                    ),
                  ),
            loading: () => const SizedBox(
              height: 80,
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (e, _) => const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}
