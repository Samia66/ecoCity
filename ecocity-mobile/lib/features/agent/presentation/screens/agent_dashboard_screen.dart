import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../core/auth/auth_provider.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/widgets/stats_card.dart';
import '../../../../core/widgets/recent_report_card.dart';
import '../../data/agent_dashboard_repository.dart';

class AgentDashboardScreen extends ConsumerWidget {
  const AgentDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;
    final dashboardAsync = ref.watch(agentDashboardProvider);

    return RefreshIndicator(
      onRefresh: () => ref.refresh(agentDashboardProvider.future),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Bonjour, ${user?.firstName ?? ''}',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          Text('Voici votre activité du jour', style: Theme.of(context).textTheme.bodyMedium),
          const SizedBox(height: 16),

          dashboardAsync.when(
            data: (d) => StatsGrid(
              children: [
                StatsCard(label: 'Assignées', value: '${d.assignedCount}', icon: Icons.assignment_outlined),
                StatsCard(label: 'En cours', value: '${d.inProgressCount}', icon: Icons.autorenew, color: Colors.blue),
                StatsCard(label: 'Urgentes', value: '${d.urgentCount}', icon: Icons.priority_high, color: Colors.red),
                StatsCard(label: 'Terminées aujourd\'hui', value: '${d.resolvedTodayCount}', icon: Icons.check_circle_outline, color: Colors.green),
              ],
            ),
            loading: () => Shimmer.fromColors(
              baseColor: Colors.grey.shade300,
              highlightColor: Colors.grey.shade100,
              child: StatsGrid(
                children: List.generate(
                  4,
                  (_) => Container(
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),
            ),
            error: (e, _) => const Text('Impossible de charger le dashboard.'),
          ),

          const SizedBox(height: 12),
          dashboardAsync.maybeWhen(
            data: (d) => Card(
              child: ListTile(
                leading: const Icon(Icons.timer_outlined),
                title: const Text('Temps moyen de résolution'),
                trailing: Text(
                  '${d.averageResolutionMinutes.toStringAsFixed(0)} min',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
            orElse: () => const SizedBox.shrink(),
          ),

          const SizedBox(height: 20),
          OutlinedButton.icon(
            onPressed: () => context.go(AppRoutes.agentMap),
            icon: const Icon(Icons.map_outlined),
            label: const Text('Voir sur la carte'),
          ),

          const SizedBox(height: 24),
          Text('Prochaines interventions', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 10),
          dashboardAsync.when(
            data: (d) => d.upcoming.isEmpty
                ? const Text('Aucune intervention à venir.')
                : Column(
                    children: d.upcoming
                        .map((i) => Padding(
                              padding: const EdgeInsets.only(bottom: 10),
                              child: RecentReportCard(
                                title: i.reportTitle,
                                category: i.category,
                                statusValue: i.status.value,
                                statusLabel: i.statusLabel,
                                date: i.createdAt,
                                photoUrl: i.attachments.isEmpty ? null : i.attachments.first.url,
                                onTap: () => context.push('/agent/interventions/${i.id}'),
                              ),
                            ))
                        .toList(),
                  ),
            loading: () => const SizedBox(height: 60, child: Center(child: CircularProgressIndicator())),
            error: (e, _) => const SizedBox.shrink(),
          ),

          const SizedBox(height: 24),
          Text('Dernières mises à jour', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 10),
          dashboardAsync.when(
            data: (d) => d.recentUpdates.isEmpty
                ? const Text('Aucune mise à jour récente.')
                : Column(
                    children: d.recentUpdates
                        .map((i) => Padding(
                              padding: const EdgeInsets.only(bottom: 10),
                              child: RecentReportCard(
                                title: i.reportTitle,
                                category: i.category,
                                statusValue: i.status.value,
                                statusLabel: i.statusLabel,
                                date: i.createdAt,
                                photoUrl: i.attachments.isEmpty ? null : i.attachments.first.url,
                                onTap: () => context.push('/agent/interventions/${i.id}'),
                              ),
                            ))
                        .toList(),
                  ),
            loading: () => const SizedBox.shrink(),
            error: (e, _) => const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}
