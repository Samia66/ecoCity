import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:intl/intl.dart';

import '../theme/app_theme.dart';

/// Thumbnail row used on the citizen home screen ("Dernier signalement"),
/// dans "Mes signalements", et sur le dashboard AGENT (interventions).
/// Prend des champs simples plutôt qu'un modèle précis afin d'être
/// réutilisable pour un `ReportModel` comme pour un `InterventionModel`.
class RecentReportCard extends StatelessWidget {
  const RecentReportCard({
    super.key,
    required this.title,
    required this.category,
    required this.statusValue,
    required this.statusLabel,
    required this.date,
    this.photoUrl,
    this.onTap,
  });

  final String title;
  final String category;
  final String statusValue;
  final String statusLabel;
  final DateTime date;
  final String? photoUrl;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: photoUrl != null
                    ? CachedNetworkImage(
                        imageUrl: photoUrl!,
                        width: 64,
                        height: 64,
                        fit: BoxFit.cover,
                        placeholder: (_, __) => Container(
                          width: 64,
                          height: 64,
                          color: Colors.grey.shade200,
                        ),
                      )
                    : Container(
                        width: 64,
                        height: 64,
                        color: Colors.grey.shade200,
                        child: const Icon(Icons.image_not_supported_outlined),
                      ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(category, style: Theme.of(context).textTheme.bodySmall),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        _StatusBadge(statusValue: statusValue, statusLabel: statusLabel),
                        const SizedBox(width: 8),
                        Text(
                          DateFormat('dd/MM/yyyy').format(date),
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.statusValue, required this.statusLabel});
  final String statusValue;
  final String statusLabel;

  @override
  Widget build(BuildContext context) {
    final color = statusColor(statusValue);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        statusLabel,
        style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w600),
      ),
    );
  }
}
