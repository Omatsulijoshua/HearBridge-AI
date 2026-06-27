import 'package:flutter/material.dart';

class SpeechCoachScreen extends StatefulWidget {
  const SpeechCoachScreen({super.key});

  @override
  State<SpeechCoachScreen> createState() => _SpeechCoachScreenState();
}

class _SpeechCoachScreenState extends State<SpeechCoachScreen> {
  String _targetWord = 'HELLO';
  bool _isRecording = false;
  Map<String, int>? _scores;

  void _record() {
    if (_isRecording) {
      setState(() {
        _isRecording = false;
        _scores = {
          'Clarity': 88,
          'Pronunciation': 91,
          'Volume': 85,
          'Fluency': 90,
        };
      });
    } else {
      setState(() {
        _isRecording = true;
        _scores = null;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Speech Coach'),
        backgroundColor: const Color(0xFF0A0F1D),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Select Target Vowel Sound',
              style: TextStyle(color: Colors.white70, fontSize: 13),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildWordBtn('HELLO'),
                _buildWordBtn('KEY'),
                _buildWordBtn('BLUE'),
              ],
            ),
            const SizedBox(height: 32),
            Expanded(
              child: Card(
                color: const Color(0xFF1E293B),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _targetWord,
                        style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
                      ),
                      const SizedBox(height: 30),
                      IconButton(
                        iconSize: 64,
                        icon: Icon(
                          _isRecording ? Icons.stop_circle : Icons.mic_none,
                          color: _isRecording ? Colors.red : const Color(0xFF8B5CF6),
                        ),
                        onPressed: _record,
                      ),
                      Text(
                        _isRecording ? 'Listening... Tap to stop' : 'Tap mic and speak word',
                        style: const TextStyle(fontSize: 12, color: Colors.white30),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            // Custom mouth shape drawer placeholder representation
            Center(
              child: CustomPaint(
                size: const Size(120, 100),
                painter: MouthGuidePainter(soundType: _targetWord),
              ),
            ),
            const SizedBox(height: 24),
            if (_scores != null) ...[
              const Text('AI Assessment Scores:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 10),
              GridView.count(
                shrinkWrap: true,
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 2.2,
                children: _scores!.entries.map((e) => Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(e.key, style: const TextStyle(fontSize: 11, color: Colors.white54)),
                      Text('${e.value}%', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: e.value > 85 ? Colors.green : Colors.yellow)),
                    ],
                  ),
                )).toList(),
              )
            ]
          ],
        ),
      ),
    );
  }

  Widget _buildWordBtn(String word) {
    final active = _targetWord == word;
    return OutlinedButton(
      style: OutlinedButton.styleFrom(
        foregroundColor: active ? Colors.white : Colors.white60,
        side: BorderSide(color: active ? const Color(0xFF8B5CF6) : Colors.white10),
        backgroundColor: active ? const Color(0xFF8B5CF6).withAlpha(26) : Colors.transparent,
      ),
      onPressed: () => setState(() => _targetWord = word),
      child: Text(word),
    );
  }
}

class MouthGuidePainter extends CustomPainter {
  final String soundType;
  MouthGuidePainter({required this.soundType});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFEC4899)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;

    final tonguePaint = Paint()
      ..color = Colors.orange
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4;

    // Draw Lips
    if (soundType == 'HELLO') {
      // Circle open
      canvas.drawCircle(Offset(size.width / 2, size.height / 2), 25, paint);
      // Flat tongue
      canvas.drawPath(
        Path()
          ..moveTo(size.width / 2 - 15, size.height / 2 + 10)
          ..quadraticBezierTo(size.width / 2, size.height / 2 + 12, size.width / 2 + 15, size.height / 2 + 10),
        tonguePaint,
      );
    } else if (soundType == 'KEY') {
      // Oval flat
      canvas.drawOval(
        Rect.fromCenter(center: Offset(size.width / 2, size.height / 2), width: 70, height: 20),
        paint,
      );
      // High tongue
      canvas.drawPath(
        Path()
          ..moveTo(size.width / 2 - 25, size.height / 2 + 2)
          ..quadraticBezierTo(size.width / 2, size.height / 2 - 8, size.width / 2 + 25, size.height / 2 + 2),
        tonguePaint,
      );
    } else {
      // Small circle 'OO'
      canvas.drawCircle(Offset(size.width / 2, size.height / 2), 10, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
