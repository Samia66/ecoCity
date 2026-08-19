import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../shared/data/intervention_repository.dart';

class AgentMapScreen extends ConsumerWidget {
  const AgentMapScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final interventionsAsync = ref.watch(myInterventionsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Carte des interventions')),
      body: interventionsAsync.when(
        data: (interventions) {
          final located = interventions
              .where((i) => i.latitude != null && i.longitude != null)
              .toList();

          if (located.isEmpty) {
            return const Center(child: Text('Aucune intervention à afficher.'));
          }
          final center = LatLng(located.first.latitude!, located.first.longitude!);
          return FlutterMap(
            options: MapOptions(initialCenter: center, initialZoom: 12),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'app.ecocity.mobile',
              ),
              MarkerLayer(
                markers: located.map((i) {
                  return Marker(
                    point: LatLng(i.latitude!, i.longitude!),
                    child: GestureDetector(
                      onTap: () => context.push('/agent/interventions/${i.id}'),
                      child: Icon(
                        Icons.location_pin,
                        color: statusColor(i.status.value),
                        size: 36,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => const Center(child: Text('Impossible de charger la carte.')),
      ),
    );
  }
}
