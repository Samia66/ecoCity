import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../core/widgets/recent_report_card.dart';
import '../../../shared/data/report_repository.dart';
import '../../../shared/domain/models/enums.dart';
import '../../../shared/domain/models/report_model.dart';

enum _Filter { all, pending, inProgress, resolved }

class MyReportsScreen extends ConsumerStatefulWidget {
  const MyReportsScreen({super.key});

  @override
  ConsumerState<MyReportsScreen> createState() => _MyReportsScreenState();
}

class _MyReportsScreenState extends ConsumerState<MyReportsScreen> {
  _Filter _filter = _Filter.all;

  List<ReportModel> _applyFilter(List<ReportModel> reports) {
    switch (_filter) {
      case _Filter.all:
        return reports;
      case _Filter.pending:
        return reports
            .where((r) =>
                r.status == ReportStatus.nouveau ||
                r.status == ReportStatus.enAttente ||
                r.status == ReportStatus.valide)
            .toList();
      case _Filter.inProgress:
        return reports
            .where((r) =>
                r.status == ReportStatus.assigne || r.status == ReportStatus.enCours)
            .toList();
      case _Filter.resolved:
        return reports.where((r) => r.status == ReportStatus.resolu).toList();
    }
  }

  @override
  Widget build(BuildContext context) {
    final reportsAsync = ref.watch(myReportsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Mes signalements')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _FilterChip(label: 'Tous', selected: _filter == _Filter.all, onTap: () => setState(() => _filter = _Filter.all)),
                  const SizedBox(width: 8),
                  _FilterChip(label: 'En attente', selected: _filter == _Filter.pending, onTap: () => setState(() => _filter = _Filter.pending)),
                  const SizedBox(width: 8),
                  _FilterChip(label: 'En cours', selected: _filter == _Filter.inProgress, onTap: () => setState(() => _filter = _Filter.inProgress)),
                  const SizedBox(width: 8),
                  _FilterChip(label: 'Résolus', selected: _filter == _Filter.resolved, onTap: () => setState(() => _filter = _Filter.resolved)),
                ],
              ),
            ),
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => ref.refresh(myReportsProvider.future),
              child: reportsAsync.when(
                data: (reports) {
                  final filtered = _applyFilter(reports);
                  if (filtered.isEmpty) {
                    return ListView(
                      children: const [
                        SizedBox(height: 80),
                        Center(child: Text('Aucun signalement dans cette catégorie.')),
                      ],
                    );
                  }
                  return ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, i) => RecentReportCard(
                      title: filtered[i].title,
                      category: filtered[i].category,
                      statusValue: filtered[i].status.value,
                      statusLabel: filtered[i].status.label,
                      date: filtered[i].createdAt,
                      photoUrl: filtered[i].photoUrl,
                      onTap: () => context.push('/citizen/reports/${filtered[i].id}'),
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
                      height: 88,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                      ),
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

class _FilterChip extends StatelessWidget {
  const _FilterChip({required this.label, required this.selected, required this.onTap});
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ChoiceChip(label: Text(label), selected: selected, onSelected: (_) => onTap());
  }
}
