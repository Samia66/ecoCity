import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../core/theme/app_theme.dart';
import '../../data/collection_repository.dart';
import '../../domain/models/collection_model.dart';

/// Liste des collectes du jour de l'équipe de l'utilisateur connecté
/// (AGENT ou TEAM_LEADER — le backend scope automatiquement les résultats).
/// Route commune : `/agent/collections` et `/team-leader/collections`.
class CollectionListScreen extends ConsumerWidget {
  const CollectionListScreen({super.key, required this.detailRouteBase});

  /// Préfixe de route pour naviguer vers le détail, ex: `/agent/collections`.
  final String detailRouteBase;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final collectionsAsync = ref.watch(todayCollectionsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Collectes du jour')),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(todayCollectionsProvider.future),
        child: collectionsAsync.when(
          data: (items) {
            if (items.isEmpty) {
              return ListView(
                children: const [
                  SizedBox(height: 80),
                  Center(child: Text('Aucune collecte prévue aujourd\'hui.')),
                ],
              );
            }
            return ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, i) => _CollectionTile(
                collection: items[i],
                onTap: () => context.push('$detailRouteBase/${items[i].id}'),
              ),
            );
          },
          loading: () => Shimmer.fromColors(
            baseColor: Colors.grey.shade300,
            highlightColor: Colors.grey.shade100,
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: 4,
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

class _CollectionTile extends StatelessWidget {
  const _CollectionTile({required this.collection, required this.onTap});
  final CollectionModel collection;
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
                    child: Text(collection.zoneName, style: const TextStyle(fontWeight: FontWeight.w600)),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: statusColor(collection.status.value).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      collection.statusLabel,
                      style: TextStyle(color: statusColor(collection.status.value), fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(collection.teamName, style: Theme.of(context).textTheme.bodySmall),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.event, size: 14, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(collection.dayOfWeek.label, style: Theme.of(context).textTheme.bodySmall),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
