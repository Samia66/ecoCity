import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

class GeoResult {
  GeoResult({required this.latitude, required this.longitude, required this.address});
  final double latitude;
  final double longitude;
  final String address;
}

/// Wraps GPS acquisition + reverse geocoding for the "Nouveau signalement"
/// screen, which must auto-fill the address as soon as it opens.
class GeolocationService {
  Future<GeoResult> getCurrentLocationWithAddress() async {
    final hasPermission = await _ensurePermission();
    if (!hasPermission) {
      throw Exception('Permission de localisation refusée');
    }

    final position = await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );

    String address = '${position.latitude}, ${position.longitude}';
    try {
      final placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );
      if (placemarks.isNotEmpty) {
        final p = placemarks.first;
        address = [p.street, p.locality, p.postalCode, p.country]
            .where((e) => e != null && e.isNotEmpty)
            .join(', ');
      }
    } catch (_) {
      // Reverse geocoding failed — keep coordinates as a fallback address.
    }

    return GeoResult(
      latitude: position.latitude,
      longitude: position.longitude,
      address: address,
    );
  }

  Future<bool> _ensurePermission() async {
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return false;

    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    return permission == LocationPermission.always ||
        permission == LocationPermission.whileInUse;
  }
}
