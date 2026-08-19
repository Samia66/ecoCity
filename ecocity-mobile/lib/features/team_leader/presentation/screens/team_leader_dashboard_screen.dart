import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/stats_card.dart';
import '../../data/team_leader_repository.dart';

class TeamLeaderDashboardScreen extends ConsumerWidget {
  const TeamLeaderDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dashboardAsync = ref.watch(teamLeaderDashboardProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard équipe')),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(teamLeaderDashboardProvider.future),
        child: dashboardAsync.when(
          data: (d) => ListView(
            padding: const EdgeInsets.all(16),
            children: [
              StatsGrid(
                children: [
                  StatsCard(label: 'Agents actifs', value: '${d.activeAgents}', icon: Icons.groups_outlined),
                  StatsCard(label: 'Agents disponibles', value: '${d.availableAgents}', icon: Icons.person_pin_circle_outlined, color: Colors.blue),
                  StatsCard(label: 'Non assignées', value: '${d.unassignedCount}', icon: Icons.pending_actions_outlined, color: Colors.orange),
                  StatsCard(label: 'Critiques', value: '${d.criticalCount}', icon: Icons.warning_amber_outlined, color: Colors.red),
                ],
              ),
              const SizedBox(height: 12),
              Card(
                child: ListTile(
                  leading: const Icon(Icons.hourglass_bottom_outlined),
                  title: const Text('Interventions en retard'),
                  trailing: Text('${d.lateCount}', style: const TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              Card(
                child: ListTile(
                  leading: const Icon(Icons.trending_up_outlined),
                  title: const Text('Taux de résolution'),
                  trailing: Text(
                    '${(d.resolutionRate * 100).toStringAsFixed(0)}%',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              if (d.statusBreakdown.isNotEmpty) ...[
                Text('Répartition par statut', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 12),
                SizedBox(
                  height: 180,
                  child: PieChart(
                    PieChartData(
                      sections: d.statusBreakdown.map((e) {
                        return PieChartSectionData(
                          value: e.count.toDouble(),
                          title: '${e.count}',
                          color: statusColor(e.status),
                          radius: 60,
                          titleStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        );
                      }).toList(),
                      sectionsSpace: 2,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 12,
                  children: d.statusBreakdown
                      .map((e) => Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(width: 10, height: 10, color: statusColor(e.status)),
                              const SizedBox(width: 4),
                              Text(e.status, style: Theme.of(context).textTheme.bodySmall),
                            ],
                          ))
                      .toList(),
                ),
                const SizedBox(height: 24),
              ],

              if (d.agentLoad.isNotEmpty) ...[
                Text('Charge par agent', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 12),
                SizedBox(
                  height: 200,
                  child: BarChart(
                    BarChartData(
                      alignment: BarChartAlignment.spaceAround,
                      titlesData: FlTitlesData(
                        bottomTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            getTitlesWidget: (value, meta) {
                              final i = value.toInt();
                              if (i < 0 || i >= d.agentLoad.length) return const SizedBox.shrink();
                              return Padding(
                                padding: const EdgeInsets.only(top: 4),
                                child: Text(
                                  d.agentLoad[i].agentName.split(' ').first,
                                  style: const TextStyle(fontSize: 10),
                                ),
                              );
                            },
                          ),
                        ),
                        leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 28)),
                        topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                        rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      ),
                      borderData: FlBorderData(show: false),
                      barGroups: d.agentLoad.asMap().entries.map((entry) {
                        return BarChartGroupData(x: entry.key, barRods: [
                          BarChartRodData(
                            toY: entry.value.assignedCount.toDouble(),
                            color: Theme.of(context).colorScheme.primary,
                            width: 16,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ]);
                      }).toList(),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
              ],

              if (d.weeklyTrend.isNotEmpty) ...[
                Text('Évolution hebdomadaire', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 12),
                SizedBox(
                  height: 180,
                  child: LineChart(
                    LineChartData(
                      titlesData: FlTitlesData(
                        bottomTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            getTitlesWidget: (value, meta) {
                              final i = value.toInt();
                              if (i < 0 || i >= d.weeklyTrend.length) return const SizedBox.shrink();
                              return Text(d.weeklyTrend[i].weekLabel, style: const TextStyle(fontSize: 10));
                            },
                          ),
                        ),
                        leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 28)),
                        topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                        rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      ),
                      borderData: FlBorderData(show: false),
                      lineBarsData: [
                        LineChartBarData(
                          spots: d.weeklyTrend
                              .asMap()
                              .entries
                              .map((e) => FlSpot(e.key.toDouble(), e.value.resolvedCount.toDouble()))
                              .toList(),
                          isCurved: true,
                          color: Theme.of(context).colorScheme.primary,
                          barWidth: 3,
                          dotData: const FlDotData(show: true),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ],
          ),
          loading: () => Shimmer.fromColors(
            baseColor: Colors.grey.shade300,
            highlightColor: Colors.grey.shade100,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                StatsGrid(
                  children: List.generate(
                    4,
                    (_) => Container(decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16))),
                  ),
                ),
              ],
            ),
          ),
          error: (e, _) => const Center(child: Text('Impossible de charger le dashboard.')),
        ),
      ),
    );
  }
}
