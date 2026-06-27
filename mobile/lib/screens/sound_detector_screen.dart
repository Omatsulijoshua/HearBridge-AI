import 'package:flutter/material.dart';
import '../main.dart';

class SoundDetectorScreen extends StatefulWidget {
  const SoundDetectorScreen({super.key});

  @override
  State<SoundDetectorScreen> createState() => _SoundDetectorScreenState();
}

class _SoundDetectorScreenState extends State<SoundDetectorScreen> {
  bool _isListening = false;
  final List<Map<String, dynamic>> _logs = [
    {'type': 'Doorbell', 'time': '11:12 AM', 'safety': 'Safe', 'color': Colors.green},
    {'type': 'Emergency Siren', 'time': '10:45 AM', 'safety': 'Danger', 'color': Colors.red}
  ];

  void _toggleListening() {
    setState(() {
      _isListening = !_isListening;
    });

    if (_isListening) {
      // Mock sound alarm trigger
      Future.delayed(const Duration(seconds: 3), () {
        if (!mounted || !_isListening) return;
        setState(() {
          _logs.insert(0, {
            'type': 'Baby Crying',
            'time': 'Just Now',
            'safety': 'Watchful',
            'color': Colors.orange
          });
          if (!RehabProgress.completedStages.value.contains('sound_detector')) {
            RehabProgress.completedStages.value = [...RehabProgress.completedStages.value, 'sound_detector'];
          }
        });
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ambient Sound Detector'),
        backgroundColor: const Color(0xFF0A0F1D),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: _isListening ? Colors.red : const Color(0xFF8B5CF6),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              icon: Icon(_isListening ? Icons.stop : Icons.play_arrow),
              label: Text(_isListening ? 'Stop Listening' : 'Start Ambient Monitoring'),
              onPressed: _toggleListening,
            ),
            const SizedBox(height: 24),
            const Text(
              'Real-Time Safety logs:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: _logs.length,
                itemBuilder: (context, i) {
                  final log = _logs[i];
                  return Card(
                    color: const Color(0xFF1E293B),
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: Icon(Icons.circle, color: log['color'], size: 16),
                      title: Text(log['type'], style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text('Status: ${log['safety']}'),
                      trailing: Text(log['time'], style: const TextStyle(fontSize: 12, color: Colors.white30)),
                    ),
                  );
                },
              ),
            )
          ],
        ),
      ),
    );
  }
}
