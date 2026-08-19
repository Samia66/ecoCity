import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../shared/data/intervention_repository.dart';
import '../../../shared/domain/models/unassigned_report_model.dart';
import '../../data/team_leader_repository.dart';

/// Le TEAM_LEADER peut voir les interventions sans agent, sélectionner un
/// agent puis affecter/réaffecter — utilise AssignInterventionDto via
/// InterventionRepository.assign (même DTO que pour une réaffectation).
class InterventionsToAssignScreen extends ConsumerWidget {
  const InterventionsToAssignScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final unassignedAsync = ref.watch(unassignedInterventionsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Interventions à affecter')),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(unassignedInterventionsProvider.future),
        child: unassignedAsync.when(
          data: (items) {
            if (items.isEmpty) {
              return ListView(
                children: const [
                  SizedBox(height: 80),
                  Center(child: Text('Toutes les interventions sont affectées 🎉')),
                ],
              );
            }
            return ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, i) => _UnassignedTile(item: items[i]),
            );
          },
          loading: () => Shimmer.fromColors(
            baseColor: Colors.grey.shade300,
            highlightColor: Colors.grey.shade100,
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: 5,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (_, __) => Container(
                height: 96,
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
              ),
            ),
          ),
          error: (e, _) => const Center(child: Text('Erreur de chargement.')),
        ),
      ),
    );
  }
}

class _UnassignedTile extends ConsumerWidget {
  const _UnassignedTile({required this.item});
  final UnassignedReportModel item;

  Future<void> _openAssignSheet(BuildContext context, WidgetRef ref) async {
    final agentsAsync = ref.read(teamAgentsProvider);

    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (sheetContext) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Affecter à un agent', style: Theme.of(sheetContext).textTheme.titleLarge),
                const SizedBox(height: 12),
                agentsAsync.when(
                  data: (agents) => Column(
                    mainAxisSize: MainAxisSize.min,
                    children: agents
                        .map((agent) => ListTile(
                              leading: CircleAvatar(child: Text(agent.firstName[0])),
                              title: Text(agent.fullName),
                              subtitle: Text('${agent.assignedCount} interventions en cours'),
                              onTap: () async {
                                Navigator.pop(sheetContext);
                                try {
                                  await ref.read(assignInterventionActionProvider)(
                                    item.reportId,
                                    agent.id,
                                  );
                                  ref.invalidate(unassignedInterventionsProvider);
                                  if (context.mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(content: Text('Affecté à ${agent.fullName}.')),
                                    );
                                  }
                                } catch (_) {
                                  if (context.mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text("Échec de l'affectation.")),
                                    );
                                  }
                                }
                              },
                            ))
                        .toList(),
                  ),
                  loading: () => const Padding(
                    padding: EdgeInsets.all(20),
                    child: Center(child: CircularProgressIndicator()),
                  ),
                  error: (e, _) => const Text('Impossible de charger les agents.'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(child: Text(item.title, style: const TextStyle(fontWeight: FontWeight.w600))),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: priorityColor(item.priority.value).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    item.priority.value,
                    style: TextStyle(color: priorityColor(item.priority.value), fontSize: 11, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(item.address, style: Theme.of(context).textTheme.bodySmall),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _openAssignSheet(context, ref),
                icon: const Icon(Icons.person_add_alt_outlined),
                label: const Text('Affecter à un agent'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
