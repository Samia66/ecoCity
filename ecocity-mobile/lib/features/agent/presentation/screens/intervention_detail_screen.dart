import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../shared/data/intervention_repository.dart';
import '../../../shared/domain/dto/update_intervention_status_dto.dart';
import '../../../shared/domain/models/intervention_model.dart';

class InterventionDetailScreen extends ConsumerWidget {
  const InterventionDetailScreen({super.key, required this.interventionId});
  final String interventionId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final interventionAsync = ref.watch(interventionDetailProvider(interventionId));

    return Scaffold(
      appBar: AppBar(title: const Text('Détail intervention')),
      body: interventionAsync.when(
        data: (intervention) => _InterventionDetailBody(intervention: intervention),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => const Center(child: Text('Impossible de charger cette intervention.')),
      ),
    );
  }
}

class _InterventionDetailBody extends ConsumerStatefulWidget {
  const _InterventionDetailBody({required this.intervention});
  final InterventionModel intervention;

  @override
  ConsumerState<_InterventionDetailBody> createState() => _InterventionDetailBodyState();
}

class _InterventionDetailBodyState extends ConsumerState<_InterventionDetailBody> {
  bool _isSubmitting = false;

  InterventionModel get _intervention => widget.intervention;

  Future<void> _updateStatus(String status, {String? comment}) async {
    setState(() => _isSubmitting = true);
    try {
      await ref.read(interventionRepositoryProvider).updateStatus(
            _intervention.id,
            UpdateInterventionStatusDto(status: status, comment: comment),
          );
      ref.invalidate(interventionDetailProvider(_intervention.id));
      ref.invalidate(myInterventionsProvider);
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('Statut mis à jour.')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('Échec de la mise à jour.')));
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  Future<void> _confirmSimpleAction(String title, String message, String status) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Annuler')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Confirmer')),
        ],
      ),
    );
    if (confirmed == true) await _updateStatus(status);
  }

  Future<void> _openResolveDialog() async {
    final commentController = TextEditingController();
    File? afterPhoto;

    final result = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      builder: (sheetContext) {
        return StatefulBuilder(
          builder: (sheetContext, setSheetState) => Padding(
            padding: EdgeInsets.only(
              left: 20,
              right: 20,
              top: 20,
              bottom: MediaQuery.of(sheetContext).viewInsets.bottom + 20,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Résoudre l\'intervention', style: Theme.of(sheetContext).textTheme.titleLarge),
                const SizedBox(height: 16),
                GestureDetector(
                  onTap: () async {
                    final picked = await ImagePicker().pickImage(source: ImageSource.camera, imageQuality: 80);
                    if (picked != null) setSheetState(() => afterPhoto = File(picked.path));
                  },
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: afterPhoto != null
                        ? Image.file(afterPhoto!, height: 160, width: double.infinity, fit: BoxFit.cover)
                        : Container(
                            height: 160,
                            color: Colors.grey.shade200,
                            child: const Center(
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.add_a_photo_outlined, size: 32),
                                  SizedBox(height: 6),
                                  Text('Photo après intervention (obligatoire)'),
                                ],
                              ),
                            ),
                          ),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: commentController,
                  maxLines: 3,
                  decoration: const InputDecoration(labelText: 'Commentaire (obligatoire)'),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    if (afterPhoto == null || commentController.text.trim().isEmpty) {
                      ScaffoldMessenger.of(sheetContext).showSnackBar(
                        const SnackBar(content: Text('Photo et commentaire requis.')),
                      );
                      return;
                    }
                    Navigator.pop(sheetContext, true);
                  },
                  child: const Text('Confirmer la résolution'),
                ),
              ],
            ),
          ),
        );
      },
    );

    if (result == true && afterPhoto != null) {
      setState(() => _isSubmitting = true);
      try {
        // La photo "après" est envoyée séparément en multipart, AVANT le
        // changement de statut (le backend ne l'accepte plus dans le body
        // de la mise à jour de statut).
        await ref.read(interventionRepositoryProvider).uploadPhoto(
              _intervention.id,
              afterPhoto!,
              isBefore: false,
            );
        await _updateStatus('TERMINEE', comment: commentController.text.trim());
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context)
              .showSnackBar(const SnackBar(content: Text("Échec de l'envoi de la photo.")));
        }
      } finally {
        if (mounted) setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final intervention = _intervention;
    final beforeAttachments = intervention.attachments.where((a) => a.phase == 'AVANT');
    final beforePhoto = beforeAttachments.isEmpty ? null : beforeAttachments.first.url;

    return Stack(
      children: [
        ListView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
          children: [
            Row(
              children: [
                Expanded(child: Text(intervention.reportTitle, style: Theme.of(context).textTheme.titleLarge)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: statusColor(intervention.status.value).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    intervention.statusLabel,
                    style: TextStyle(color: statusColor(intervention.status.value), fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(intervention.category, style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 20),

            // Photo prise par le citoyen à la création du signalement
            if (beforePhoto != null) ...[
              Text('Photo du citoyen', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: CachedNetworkImage(imageUrl: beforePhoto, height: 200, width: double.infinity, fit: BoxFit.cover),
              ),
              const SizedBox(height: 20),
            ],

            // Adresse
            Text('Adresse', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 4),
            Text(intervention.address),
            const SizedBox(height: 12),

            // Carte interactive
            if (intervention.latitude != null && intervention.longitude != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: SizedBox(
                  height: 180,
                  child: FlutterMap(
                    options: MapOptions(
                      initialCenter: LatLng(intervention.latitude!, intervention.longitude!),
                      initialZoom: 15,
                    ),
                    children: [
                      TileLayer(
                        urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        userAgentPackageName: 'app.ecocity.mobile',
                      ),
                      MarkerLayer(markers: [
                        Marker(
                          point: LatLng(intervention.latitude!, intervention.longitude!),
                          child: const Icon(Icons.location_pin, color: Colors.red, size: 36),
                        ),
                      ]),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 20),

            // Historique
            Text('Historique', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            if (intervention.history.isEmpty)
              const Text('Aucun historique.')
            else
              ...intervention.history.map(
                (e) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: [
                      Icon(Icons.circle, size: 10, color: statusColor(e.status.value)),
                      const SizedBox(width: 8),
                      Text('${e.status.label} — ${e.changedBy}'),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 20),

            // Commentaires
            Text('Commentaires', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            if (intervention.comments.isEmpty)
              const Text('Aucun commentaire.')
            else
              ...intervention.comments.map(
                (c) => Card(
                  child: ListTile(
                    title: Text(c.author),
                    subtitle: Text(c.message),
                  ),
                ),
              ),
          ],
        ),

        // Actions principales
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
                        _ActionButton(
                          label: 'Accepter',
                          color: Colors.blue,
                          onTap: () => _confirmSimpleAction('Accepter', 'Accepter cette intervention ?', 'ACCEPTEE'),
                        ),
                        _ActionButton(
                          label: 'Démarrer',
                          color: Colors.indigo,
                          onTap: () => _confirmSimpleAction('Démarrer', 'Démarrer cette intervention ?', 'EN_COURS'),
                        ),
                        _ActionButton(
                          label: 'Suspendre',
                          color: Colors.orange,
                          onTap: () => _confirmSimpleAction('Suspendre', 'Suspendre cette intervention ?', 'ACCEPTEE'),
                        ),
                        _ActionButton(
                          label: 'Rejeter',
                          color: Colors.red,
                          onTap: () => _confirmSimpleAction('Rejeter', 'Rejeter cette intervention ?', 'REJETEE'),
                        ),
                        _ActionButton(
                          label: 'Résoudre',
                          color: Colors.green,
                          onTap: _openResolveDialog,
                        ),
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
