import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../shared/data/intervention_repository.dart';
import '../../../shared/domain/models/enums.dart';
import '../../../shared/domain/models/intervention_model.dart';

enum _StatusFilter { assigned, inProgress, resolved, rejected }
enum _SortBy { priority, date }

class InterventionListScreen extends ConsumerStatefulWidget {
  const InterventionListScreen({super.key});

  @override
  ConsumerState<InterventionListScreen> createState() => _InterventionListScreenState();
}

class _InterventionListScreenState extends ConsumerState<InterventionListScreen> {
  _StatusFilter _filter = _StatusFilter.assigned;
  _SortBy _sortBy = _SortBy.priority;

  List<InterventionModel> _applyFilterAndSort(List<InterventionModel> items) {
    final statusMap = {
      _StatusFilter.assigned: const [InterventionStatus.assignee, InterventionStatus.acceptee],
      _StatusFilter.inProgress: const [InterventionStatus.enCours],
      _StatusFilter.resolved: const [InterventionStatus.terminee],
      _StatusFilter.rejected: const [InterventionStatus.rejetee],
    };
    final allowedStatuses = statusMap[_filter]!;
    final filtered = items.where((i) => allowedStatuses.contains(i.status)).toList();

    switch (_sortBy) {
      case _SortBy.priority:
        // Le tri par priorité se fait via le libellé de statut du signalement
        // (la priorité elle-même n'est pas exposée sur InterventionModel :
        // seul le signalement source la porte). On trie par date à défaut.
        filtered.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        break;
      case _SortBy.date:
        filtered.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        break;
    }
    return filtered;
  }

  @override
  Widget build(BuildContext context) {
    final interventionsAsync = ref.watch(myInterventionsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Interventions'),
        actions: [
          PopupMenuButton<_SortBy>(
            icon: const Icon(Icons.sort),
            onSelected: (v) => setState(() => _sortBy = v),
            itemBuilder: (_) => const [
              PopupMenuItem(value: _SortBy.priority, child: Text('Trier par priorité')),
              PopupMenuItem(value: _SortBy.date, child: Text('Trier par date')),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _Chip(label: 'Assignées', selected: _filter == _StatusFilter.assigned, onTap: () => setState(() => _filter = _StatusFilter.assigned)),
                  const SizedBox(width: 8),
                  _Chip(label: 'En cours', selected: _filter == _StatusFilter.inProgress, onTap: () => setState(() => _filter = _StatusFilter.inProgress)),
                  const SizedBox(width: 8),
                  _Chip(label: 'Résolues', selected: _filter == _StatusFilter.resolved, onTap: () => setState(() => _filter = _StatusFilter.resolved)),
                  const SizedBox(width: 8),
                  _Chip(label: 'Rejetées', selected: _filter == _StatusFilter.rejected, onTap: () => setState(() => _filter = _StatusFilter.rejected)),
                ],
              ),
            ),
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => ref.refresh(myInterventionsProvider.future),
              child: interventionsAsync.when(
                data: (items) {
                  final filtered = _applyFilterAndSort(items);
                  if (filtered.isEmpty) {
                    return ListView(
                      children: const [SizedBox(height: 80), Center(child: Text('Aucune intervention.'))],
                    );
                  }
                  return ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, i) => _InterventionTile(
                      intervention: filtered[i],
                      onTap: () => context.push('/agent/interventions/${filtered[i].id}'),
                    ),
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
                      height: 96,
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
                    ),
                  ),
                ),
                error: (e, _) => const Center(child: Text('Erreur de chargement.')),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _InterventionTile extends StatelessWidget {
  const _InterventionTile({required this.intervention, required this.onTap});
  final InterventionModel intervention;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(intervention.reportTitle, style: const TextStyle(fontWeight: FontWeight.w600)),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: statusColor(intervention.status.value).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      intervention.statusLabel,
                      style: TextStyle(color: statusColor(intervention.status.value), fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(intervention.category, style: Theme.of(context).textTheme.bodySmall),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.location_on_outlined, size: 14, color: Colors.grey),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      intervention.address,
                      style: Theme.of(context).textTheme.bodySmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({required this.label, required this.selected, required this.onTap});
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ChoiceChip(label: Text(label), selected: selected, onSelected: (_) => onTap());
  }
}
