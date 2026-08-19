import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shimmer/shimmer.dart';

import '../../data/team_leader_repository.dart';
import '../../../shared/domain/models/intervention_model.dart';
import '../../../shared/data/collection_repository.dart';

class TeamScreen extends ConsumerWidget {
  const TeamScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final agentsAsync = ref.watch(teamAgentsProvider);
    final zonesAsync = ref.watch(myZonesProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Équipe')),
      body: RefreshIndicator(
        onRefresh: () => Future.wait([
          ref.refresh(teamAgentsProvider.future),
          ref.refresh(myZonesProvider.future),
        ]),
        child: agentsAsync.when(
          data: (agents) {
            return ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text('Zones couvertes', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                zonesAsync.when(
                  data: (zones) => zones.isEmpty
                      ? const Text('Aucune zone affectée à votre équipe.')
                      : Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: zones.map((z) => Chip(label: Text(z.name))).toList(),
                        ),
                  loading: () => const SizedBox(height: 32, child: LinearProgressIndicator()),
                  error: (e, _) => const Text('Impossible de charger les zones.'),
                ),
                const SizedBox(height: 20),
                Text('Membres de l\'équipe', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                if (agents.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 24),
                    child: Center(child: Text('Aucun agent.')),
                  )
                else
                  ...agents.map(
                    (agent) => Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: _AgentCard(agent: agent),
                    ),
                  ),
              ],
            );
          },
          loading: () => Shimmer.fromColors(
            baseColor: Colors.grey.shade300,
            highlightColor: Colors.grey.shade100,
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: 6,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (_, __) => Container(
                height: 100,
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

class _AgentCard extends StatelessWidget {
  const _AgentCard({required this.agent});
  final AgentSummaryModel agent;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(child: Text(agent.firstName.isNotEmpty ? agent.firstName[0] : '?')),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(agent.fullName, style: const TextStyle(fontWeight: FontWeight.w600)),
                      Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: agent.isOnline ? Colors.green : Colors.grey,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(agent.isOnline ? 'En ligne' : 'Hors ligne',
                              style: Theme.of(context).textTheme.bodySmall),
                        ],
                      ),
                    ],
                  ),
                ),
                if (agent.phone != null)
                  IconButton(
                    icon: const Icon(Icons.call_outlined),
                    onPressed: () => launchUrl(Uri.parse('tel:${agent.phone}')),
                  ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                _MiniStat(label: 'Assignées', value: '${agent.assignedCount}'),
                const SizedBox(width: 16),
                _MiniStat(label: 'En cours', value: '${agent.inProgressCount}'),
                const SizedBox(width: 16),
                _MiniStat(label: 'Temps moyen', value: '${agent.averageResolutionMinutes.toStringAsFixed(0)} min'),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _showAgentInterventionsSheet(context, agent),
                    child: const Text('Ses interventions'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _showAgentDetailSheet(context, agent),
                    child: const Text('Détail'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showAgentDetailSheet(BuildContext context, AgentSummaryModel agent) {
    showModalBottomSheet(
      context: context,
      builder: (_) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(agent.fullName, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            Text('Statut : ${agent.isOnline ? "En ligne" : "Hors ligne"}'),
            if (agent.phone != null) Text('Téléphone : ${agent.phone}'),
            if (agent.latitude != null && agent.longitude != null)
              Text('Position approximative : ${agent.latitude!.toStringAsFixed(3)}, ${agent.longitude!.toStringAsFixed(3)}'),
          ],
        ),
      ),
    );
  }

  void _showAgentInterventionsSheet(BuildContext context, AgentSummaryModel agent) {
    // Réutilise l'InterventionRepository via un provider dédié pourrait
    // être branché ici (GET /interventions?agentId=) — placeholder UI prête.
    showModalBottomSheet<List<InterventionModel>>(
      context: context,
      builder: (_) => Padding(
        padding: const EdgeInsets.all(20),
        child: Text(
          "Interventions de ${agent.fullName} — brancher sur l'endpoint filtré côté backend.",
        ),
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  const _MiniStat({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }
}
