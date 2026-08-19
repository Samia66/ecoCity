import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/router/app_router.dart';
import '../../../../core/widgets/geolocation_service.dart';
import '../../../shared/data/category_repository.dart';
import '../../../shared/data/report_repository.dart';
import '../../../shared/domain/dto/create_report_dto.dart';
import '../../../shared/domain/models/category_model.dart';
import '../../../shared/domain/models/enums.dart';

class NewReportScreen extends ConsumerStatefulWidget {
  const NewReportScreen({super.key});

  @override
  ConsumerState<NewReportScreen> createState() => _NewReportScreenState();
}

class _NewReportScreenState extends ConsumerState<NewReportScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _addressController = TextEditingController();

  CategoryModel? _selectedCategory;
  ReportPriority _priority = ReportPriority.moyenne;
  File? _photo;

  double? _latitude;
  double? _longitude;
  bool _isLocating = true;
  bool _isSubmitting = false;
  String? _locationError;

  @override
  void initState() {
    super.initState();
    _resolveLocation();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _resolveLocation() async {
    setState(() {
      _isLocating = true;
      _locationError = null;
    });
    try {
      final result = await GeolocationService().getCurrentLocationWithAddress();
      setState(() {
        _latitude = result.latitude;
        _longitude = result.longitude;
        _addressController.text = result.address;
      });
    } catch (e) {
      setState(() => _locationError = 'Localisation indisponible. Réessayez.');
    } finally {
      setState(() => _isLocating = false);
    }
  }

  Future<void> _pickPhoto(ImageSource source) async {
    final picked = await ImagePicker().pickImage(source: source, imageQuality: 80);
    if (picked != null) {
      setState(() => _photo = File(picked.path));
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_photo == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ajoutez une photo du problème.')),
      );
      return;
    }
    if (_selectedCategory == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Sélectionnez une catégorie.')),
      );
      return;
    }
    if (_latitude == null || _longitude == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Position GPS requise. Réessayez la localisation.')),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      final dto = CreateReportDto(
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        categoryId: _selectedCategory!.id,
        priority: _priority.value,
        latitude: _latitude!,
        longitude: _longitude!,
        address: _addressController.text.trim(),
        photo: _photo!,
      );

      await ref.read(reportRepositoryProvider).createReport(dto);

      if (!mounted) return;
      await showDialog(
        context: context,
        builder: (_) => AlertDialog(
          icon: const Icon(Icons.check_circle, color: Colors.green, size: 48),
          title: const Text('Signalement envoyé'),
          content: const Text(
            'Votre signalement a bien été transmis aux équipes EcoCity.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.go(AppRoutes.citizenMyReports);
              },
              child: const Text('Voir mes signalements'),
            ),
          ],
        ),
      );
      _resetForm();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Échec de l'envoi. Veuillez réessayer.")),
      );
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  void _resetForm() {
    _titleController.clear();
    _descriptionController.clear();
    setState(() {
      _photo = null;
      _selectedCategory = null;
      _priority = ReportPriority.moyenne;
    });
    _resolveLocation();
  }

  @override
  Widget build(BuildContext context) {
    final categoriesAsync = ref.watch(categoriesProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Nouveau signalement')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _PhotoPicker(
              photo: _photo,
              onCamera: () => _pickPhoto(ImageSource.camera),
              onGallery: () => _pickPhoto(ImageSource.gallery),
            ),
            const SizedBox(height: 20),

            TextFormField(
              controller: _titleController,
              decoration: const InputDecoration(labelText: 'Titre'),
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Titre requis' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _descriptionController,
              maxLines: 4,
              decoration: const InputDecoration(labelText: 'Description'),
              validator: (v) =>
                  (v == null || v.trim().length < 10) ? '10 caractères minimum' : null,
            ),
            const SizedBox(height: 12),

            categoriesAsync.when(
              data: (categories) => DropdownButtonFormField<CategoryModel>(
                initialValue: _selectedCategory,
                decoration: const InputDecoration(labelText: 'Catégorie'),
                items: categories
                    .map((c) => DropdownMenuItem(value: c, child: Text(c.name)))
                    .toList(),
                onChanged: (v) => setState(() => _selectedCategory = v),
                validator: (v) => v == null ? 'Catégorie requise' : null,
              ),
              loading: () => const LinearProgressIndicator(),
              error: (e, _) => const Text('Impossible de charger les catégories.'),
            ),
            const SizedBox(height: 12),

            DropdownButtonFormField<ReportPriority>(
              initialValue: _priority,
              decoration: const InputDecoration(labelText: 'Priorité'),
              items: ReportPriority.values
                  .map((p) => DropdownMenuItem(value: p, child: Text(p.value)))
                  .toList(),
              onChanged: (v) => setState(() => _priority = v!),
            ),
            const SizedBox(height: 12),

            TextFormField(
              controller: _addressController,
              readOnly: true,
              decoration: InputDecoration(
                labelText: 'Adresse (localisation automatique)',
                suffixIcon: _isLocating
                    ? const Padding(
                        padding: EdgeInsets.all(12),
                        child: SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                      )
                    : IconButton(
                        icon: const Icon(Icons.my_location),
                        onPressed: _resolveLocation,
                      ),
              ),
              validator: (v) => (v == null || v.isEmpty) ? 'Adresse requise' : null,
            ),
            if (_locationError != null)
              Padding(
                padding: const EdgeInsets.only(top: 6),
                child: Text(_locationError!, style: const TextStyle(color: Colors.red)),
              ),

            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isSubmitting ? null : _submit,
              child: _isSubmitting
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Text('Envoyer le signalement'),
            ),
          ],
        ),
      ),
    );
  }
}

class _PhotoPicker extends StatelessWidget {
  const _PhotoPicker({required this.photo, required this.onCamera, required this.onGallery});

  final File? photo;
  final VoidCallback onCamera;
  final VoidCallback onGallery;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: photo != null
              ? Image.file(photo!, height: 180, width: double.infinity, fit: BoxFit.cover)
              : Container(
                  height: 180,
                  width: double.infinity,
                  color: Colors.grey.shade200,
                  child: const Icon(Icons.photo_camera_outlined, size: 48, color: Colors.grey),
                ),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: onCamera,
                icon: const Icon(Icons.camera_alt_outlined),
                label: const Text('Caméra'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: onGallery,
                icon: const Icon(Icons.photo_library_outlined),
                label: const Text('Galerie'),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
