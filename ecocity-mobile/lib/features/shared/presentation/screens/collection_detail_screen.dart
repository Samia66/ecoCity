import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/theme/app_theme.dart';
import '../../data/collection_repository.dart';
import '../../domain/dto/complete_collection_dto.dart';
import '../../domain/dto/report_collection_problem_dto.dart';
import '../../domain/models/collection_model.dart';

/// Détail d'une mission de collecte : zone, équipe, membres, statut,
/// historique, boutons Démarrer / Signaler un problème / Terminer.
class CollectionDetailScreen extends ConsumerWidget {
  const CollectionDetailScreen({super.key, required this.collectionId});
  final String collectionId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final collectionAsync = ref.watch(collectionDetailProvider(collectionId));

    return Scaffold(
      appBar: AppBar(title: const Text('Détail de la collecte')),
      body: collectionAsync.when(
        data: (collection) => _CollectionDetailBody(collection: collection),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => const Center(child: Text('Impossible de charger cette collecte.')),
      ),
    );
  }
}

class _CollectionDetailBody extends ConsumerStatefulWidget {
  const _CollectionDetailBody({required this.collection});
  final CollectionModel collection;

  @override
  ConsumerState<_CollectionDetailBody> createState() => _CollectionDetailBodyState();
}

class _CollectionDetailBodyState extends ConsumerState<_CollectionDetailBody> {
  bool _isSubmitting = false;

  CollectionModel get _collection => widget.collection;

  Future<void> _refresh() async {
    ref.invalidate(collectionDetailProvider(_collection.id));
    ref.invalidate(todayCollectionsProvider);
    ref.invalidate(myTeamCollectionsProvider);
  }

  Future<void> _start() async {
    setState(() => _isSubmitting = true);
    try {
      await ref.read(collectionRepositoryProvider).start(_collection.id);
      await _refresh();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Collecte démarrée.')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Échec du démarrage.')));
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  Future<void> _complete() async {
    final commentController = TextEditingController();
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Terminer la collecte'),
        content: TextField(
          controller: commentController,
          maxLines: 3,
          decoration: const InputDecoration(labelText: 'Commentaire (optionnel)'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Annuler')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Confirmer')),
        ],
      ),
    );
    if (confirmed != true) return;

    setState(() => _isSubmitting = true);
    try {
      await ref.read(collectionRepositoryProvider).complete(
            _collection.id,
            CompleteCollectionDto(comment: commentController.text.trim().isEmpty ? null : commentController.text.trim()),
          );
      await _refresh();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Collecte terminée.')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Échec de la clôture.')));
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  Future<void> _reportProblem() async {
    final descriptionController = TextEditingController();
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Signaler un problème'),
        content: TextField(
          controller: descriptionController,
          maxLines: 3,
          decoration: const InputDecoration(labelText: 'Décrivez le problème'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Annuler')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Envoyer')),
        ],
      ),
    );
    if (confirmed != true || descriptionController.text.trim().isEmpty) return;

    setState(() => _isSubmitting = true);
    try {
      await ref.read(collectionRepositoryProvider).reportProblem(
            _collection.id,
            ReportCollectionProblemDto(problemDescription: descriptionController.text.trim()),
          );
      await _refresh();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Problème signalé.')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Échec de l'envoi.")));
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final collection = _collection;

    return Stack(
      children: [
        ListView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
          children: [
            Row(
              children: [
                Expanded(child: Text(collection.zoneName, style: Theme.of(context).textTheme.titleLarge)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: statusColor(collection.status.value).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    collection.statusLabel,
                    style: TextStyle(color: statusColor(collection.status.value), fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text('${collection.teamName} — ${collection.dayOfWeek.label}', style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 20),

            if (collection.problemDescription != null) ...[
              Card(
                color: Colors.orange.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      const Icon(Icons.warning_amber_rounded, color: Colors.orange),
                      const SizedBox(width: 8),
                      Expanded(child: Text(collection.problemDescription!)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],

            Text('Équipe', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            ...collection.participants.map(
              (p) => ListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.person_outline),
                title: Text(p.fullName),
                trailing: p.isLeader ? const Text('Chef', style: TextStyle(fontWeight: FontWeight.w600)) : null,
              ),
            ),
            const SizedBox(height: 20),

            Text('Historique', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            if (collection.history.isEmpty)
              const Text('Aucun historique.')
            else
              ...collection.history.map(
                (e) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: [
                      Icon(Icons.circle, size: 10, color: statusColor(e.status.value)),
                      const SizedBox(width: 8),
                      Expanded(child: Text('${e.status.label} — ${e.changedBy}')),
                    ],
                  ),
                ),
              ),
          ],
        ),

        Positioned(
          left: 0,
          right: 0,
          bottom: 0,
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Theme.of(context).scaffoldBackgroundColor,
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 12)],
            ),
            child: _isSubmitting
                ? const Center(child: CircularProgressIndicator())
                : SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        if (collection.status.value == 'PLANIFIEE')
                          _ActionButton(label: 'Démarrer la collecte', color: Colors.indigo, onTap: _start),
                        if (collection.status.value == 'EN_COURS')
                          _ActionButton(label: 'Terminer la collecte', color: Colors.green, onTap: _complete),
                        if (collection.status.value != 'TERMINEE')
                          _ActionButton(label: 'Signaler un problème', color: Colors.orange, onTap: _reportProblem),
                      ],
                    ),
                  ),
          ),
        ),
      ],
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({required this.label, required this.color, required this.onTap});
  final String label;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(backgroundColor: color, foregroundColor: Colors.white),
        onPressed: onTap,
        child: Text(label),
      ),
    );
  }
}
