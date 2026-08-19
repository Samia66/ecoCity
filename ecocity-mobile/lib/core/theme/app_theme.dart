import 'package:flutter/material.dart';

/// EcoCity brand palette — a "civic green" primary reflecting the Smart
/// City / eco theme, kept consistent across light and dark modes.
class AppColors {
  AppColors._();
  static const primary = Color(0xFF1E8E5A);
  static const primaryDark = Color(0xFF2ECC71);
  static const urgent = Color(0xFFE74C3C);
  static const high = Color(0xFFE67E22);
  static const medium = Color(0xFFF1C40F);
  static const low = Color(0xFF3498DB);
  static const pending = Color(0xFF95A5A6);
  static const inProgress = Color(0xFF3498DB);
  static const resolved = Color(0xFF27AE60);
  static const rejected = Color(0xFFE74C3C);
}

class AppTheme {
  AppTheme._();

  static ThemeData get light => ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primary,
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF5F7F6),
        appBarTheme: const AppBarTheme(
          elevation: 0,
          centerTitle: false,
          backgroundColor: Colors.transparent,
          foregroundColor: Colors.black87,
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          color: Colors.white,
        ),
        navigationBarTheme: NavigationBarThemeData(
          height: 64,
          indicatorColor: AppColors.primary.withValues(alpha: 0.15),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
        ),
      );

  static ThemeData get dark => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primaryDark,
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(0xFF121212),
        appBarTheme: const AppBarTheme(
          elevation: 0,
          centerTitle: false,
          backgroundColor: Colors.transparent,
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          color: const Color(0xFF1E1E1E),
        ),
        navigationBarTheme: NavigationBarThemeData(
          height: 64,
          indicatorColor: AppColors.primaryDark.withValues(alpha: 0.2),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primaryDark,
            foregroundColor: Colors.black,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF1E1E1E),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
        ),
      );
}

Color priorityColor(String priority) {
  switch (priority) {
    case 'CRITIQUE':
      return AppColors.urgent;
    case 'HAUTE':
      return AppColors.high;
    case 'MOYENNE':
      return AppColors.medium;
    default:
      return AppColors.low;
  }
}

Color statusColor(String status) {
  switch (status) {
    case 'NOUVEAU':
    case 'EN_ATTENTE':
      return AppColors.pending;
    case 'VALIDE':
    case 'ASSIGNE':
    case 'ASSIGNEE':
    case 'ACCEPTEE':
    case 'EN_COURS':
      return AppColors.inProgress;
    case 'RESOLU':
    case 'TERMINEE':
      return AppColors.resolved;
    case 'REJETE':
    case 'REJETEE':
    case 'ANNULEE':
      return AppColors.rejected;
    default:
      return AppColors.pending;
  }
}
