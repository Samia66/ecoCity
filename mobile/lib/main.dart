import 'package:flutter/material.dart';

void main() {
  runApp(const EcoCityApp());
}

class EcoCityApp extends StatelessWidget {
  const EcoCityApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EcoCity',
      home: const Scaffold(
        body: Center(child: Text('EcoCity - Sprint 1.4')),
      ),
    );
  }
}
