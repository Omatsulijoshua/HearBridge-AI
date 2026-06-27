import 'package:flutter/material.dart';

class SoundRecognitionScreen extends StatefulWidget {
  const SoundRecognitionScreen({super.key});

  @override
  State<SoundRecognitionScreen> createState() => _SoundRecognitionScreenState();
}

class _SoundRecognitionScreenState extends State<SoundRecognitionScreen> {
  int _score = 0;
  int _attempts = 0;
  int _currentIndex = 0;
  String? _feedback;

  final List<Map<String, dynamic>> _sounds = [
    {
      'id': 'doorbell',
      'title': 'Doorbell Ring',
      'category': 'Home',
      'options': ['Doorbell', 'Car Horn', 'Dog Barking'],
      'correct': 'Doorbell',
      'explanation': 'Typical two-tone doorbell. High-frequency stroke.'
    },
    {
      'id': 'siren',
      'title': 'Emergency Siren',
      'category': 'Emergency',
      'options': ['Rain', 'Siren', 'Baby Crying'],
      'correct': 'Siren',
      'explanation': 'Continuous oscillating pitch. Vital safety alert.'
    }
  ];

  void _guess(String value) {
    setState(() {
      _attempts++;
      if (value == _sounds[_currentIndex]['correct']) {
        _score++;
        _feedback = 'Correct! +25 XP';
      } else {
        _feedback = 'Incorrect. It was ${_sounds[_currentIndex]['correct']}.';
      }
    });
  }

  void _next() {
    setState(() {
      _feedback = null;
      _currentIndex = (_currentIndex + 1) % _sounds.length;
    });
  }

  @override
  Widget build(BuildContext context) {
    final current = _sounds[_currentIndex];
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sound Recognition'),
        backgroundColor: const Color(0xFF0A0F1D),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Score: $_score/$_attempts', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const Chip(label: Text('Beginner', style: TextStyle(fontSize: 11))),
              ],
            ),
            const SizedBox(height: 40),
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white10),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.volume_up, size: 64, color: Color(0xFF8B5CF6)),
                    const SizedBox(height: 16),
                    Text('Category: ${current['category']}', style: const TextStyle(color: Colors.white70)),
                    const SizedBox(height: 8),
                    const Text('Tap options to identify the sound clip', style: TextStyle(fontSize: 12, color: Colors.white30)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
            ...current['options'].map<Widget>((opt) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E293B),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: _feedback != null ? null : () => _guess(opt),
                child: Text(opt, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
              ),
            )).toList(),
            const SizedBox(height: 16),
            if (_feedback != null) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white.withAlpha(5),
                  borderRadius: BorderRadius.circular(10),
                  border: const Border(left: BorderSide(color: Color(0xFF8B5CF6), width: 4)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(_feedback!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(height: 4),
                    Text(current['explanation'], style: const TextStyle(color: Colors.white54, fontSize: 12)),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8B5CF6),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: _next,
                child: const Text('Next Game'),
              )
            ]
          ],
        ),
      ),
    );
  }
}
