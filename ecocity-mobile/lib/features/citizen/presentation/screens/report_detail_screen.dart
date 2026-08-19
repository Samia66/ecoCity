import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:intl/intl.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../shared/data/report_repository.dart';
import '../../../shared/domain/models/report_model.dart';

class ReportDetailScreen extends ConsumerWidget {
  const ReportDetailScreen({super.key, required this.reportId});
  final String reportId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final reportAsync = ref.watch(reportDetailProvider(reportId));

    return Scaffold(
      appBar: AppBar(title: const Text('Détail du signalement')),
      body: reportAsync.when(
        data: (report) => _ReportDetailBody(report: report),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => const Center(child: Text('Impossible de charger ce signalement.')),
      ),
    );
  }
}

class _ReportDetailBody extends StatelessWidget {
  const _ReportDetailBody({required this.report});
  final ReportModel report;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // 1. Informations générales
        Text(report.title, style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 6),
        Row(
          children: [
            Chip(label: Text(report.category)),
            const SizedBox(width: 8),
            Chip(
              label: Text(report.priority.label),
              backgroundColor: priorityColor(report.priority.value).withValues(alpha: 0.15),
              labelStyle: TextStyle(color: priorityColor(report.priority.value)),
            ),
            const SizedBox(width: 8),
            Chip(
              label: Text(report.status.label),
              backgroundColor: statusColor(report.status.value).withValues(alpha: 0.15),
              labelStyle: TextStyle(color: statusColor(report.status.value)),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Text(report.description),
        const SizedBox(height: 20),

        // 2. Photo principale
        if (report.photoUrl != null) ...[
          Text('Photo', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: CachedNetworkImage(
              imageUrl: report.photoUrl!,
              height: 200,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(height: 20),
        ],

        // 3. Carte de localisation
        if (report.latitude != null && report.longitude != null) ...[
          Text('Localisation', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 4),
          Text(report.address, style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: SizedBox(
              height: 180,
              child: FlutterMap(
                options: MapOptions(
                  initialCenter: LatLng(report.latitude!, report.longitude!),
                  initialZoom: 15,
                  interactionOptions: const InteractionOptions(flags: InteractiveFlag.none),
                ),
                children: [
                  TileLayer(
                    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'app.ecocity.mobile',
                  ),
                  MarkerLayer(markers: [
                    Marker(
                      point: LatLng(report.latitude!, report.longitude!),
                      child: const Icon(Icons.location_pin, color: Colors.red, size: 36),
                    ),
                  ]),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
        ],

        // 4. Historique des statuts
        Text('Historique', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        if (report.history.isEmpty)
          const Text('Aucun historique disponible.')
        else
          ...report.history.map(
            (entry) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  Icon(Icons.circle, size: 10, color: statusColor(entry.status.value)),
                  const SizedBox(width: 8),
                  Text(entry.status.label, style: const TextStyle(fontWeight: FontWeight.w600)),
                  const Spacer(),
                  Text(DateFormat('dd/MM/yyyy HH:mm').format(entry.changedAt)),
                ],
              ),
            ),
          ),
        const SizedBox(height: 20),

        // 5. Commentaires des agents
        Text('Commentaires des agents', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        if (report.comments.isEmpty)
          const Text('Aucun commentaire pour le moment.')
        else
          ...report.comments.map(
            (c) => Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(c.author, style: const TextStyle(fontWeight: FontWeight.w600)),
                        const Spacer(),
                        Text(DateFormat('dd/MM HH:mm').format(c.createdAt),
                            style: Theme.of(context).textTheme.bodySmall),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(c.message),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}
