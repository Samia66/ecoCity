import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../domain/models/category_model.dart';

final categoryRepositoryProvider = Provider<CategoryRepository>((ref) {
  return CategoryRepository(ref.watch(dioProvider));
});

class CategoryRepository {
  CategoryRepository(this._dio);
  final Dio _dio;

  /// GET /categories
  Future<List<CategoryModel>> fetchCategories() async {
    final response = await _dio.get(ApiEndpoints.categories);
    final list = response.data['data'] as List;
    return list
        .map((e) => CategoryModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}

final categoriesProvider = FutureProvider<List<CategoryModel>>((ref) {
  return ref.watch(categoryRepositoryProvider).fetchCategories();
});
