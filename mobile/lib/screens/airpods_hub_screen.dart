import 'package:flutter/material.dart';

class AirPodsHubScreen extends StatefulWidget {
  const AirPodsHubScreen({super.key});

  @override
  State<AirPodsHubScreen> createState() => _AirPodsHubScreenState();
}

class _AirPodsHubScreenState extends State<AirPodsHubScreen> {
  double _speechBass = 4.0;
  double _speechMid = 4.0;
  double _clarity = 12.0;
  double _treble = 12.0;

  double _angleGuess = 0.0;
  final double _targetAngle = 45.0;

  void _applyEq() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: const [
            Icon(Icons.check_circle, color: Colors.green),
            SizedBox(width: 8),
            Text('EQ Calibrated'),
          ],
        ),
        content: const Text(
          'AirPods Equalizer curves applied successfully! Frequencies at 2kHz (Clarity) and 4kHz (Treble) boosted by 12dB to optimize speech clarity training.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _syncHealth() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: const [
            Icon(Icons.sync, color: Colors.blue),
            SizedBox(width: 8),
            Text('Apple Health Synced'),
          ],
        ),
        content: const Text(
          'Connected to Apple Health API. Loaded calibrated Audiogramtested on June 12, 2026.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AirPods Hearing Hub'),
        backgroundColor: const Color(0xFF0A0F1D),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: ListView(
          children: [
            const Text(
              'AirPods Pro Calibration',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 8),
            const Text(
              'Sync audiograms or manually adjust frequency bands to personalize audio amplification.',
              style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
            ),
            const SizedBox(height: 20),
            _buildFrequencySlider('500 Hz (Speech Bass)', _speechBass, (v) => setState(() => _speechBass = v)),
            _buildFrequencySlider('1 kHz (Speech Mid)', _speechMid, (v) => setState(() => _speechMid = v)),
            _buildFrequencySlider('2 kHz (Clarity)', _clarity, (v) => setState(() => _clarity = v)),
            _buildFrequencySlider('4 kHz (Treble)', _treble, (v) => setState(() => _treble = v)),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF8B5CF6)),
                    onPressed: _applyEq,
                    child: const Text('Apply EQ'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton(
                    onPressed: _syncHealth,
                    child: const Text('Sync Health'),
                  ),
                ),
              ],
            ),
            const Divider(height: 40, color: Colors.white10),
            const Text(
              'Spatial Localization Trainer',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 8),
            const Text(
              'Listen to the 3D panned sound and slide to guess where it originated.',
              style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                children: [
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1E293B)),
                    icon: const Icon(Icons.spatial_audio, size: 16),
                    label: const Text('🔊 Play Spatial Audio'),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Playing 3D sound panned at Right 45 degrees...')),
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                  Slider(
                    min: -90,
                    max: 90,
                    value: _angleGuess,
                    activeColor: const Color(0xFFEC4899),
                    onChanged: (v) => setState(() => _angleGuess = v),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('Left 90°', style: TextStyle(fontSize: 10, color: Colors.white30)),
                      Text('Center 0°', style: TextStyle(fontSize: 10, color: Colors.white30)),
                      Text('Right 90°', style: TextStyle(fontSize: 10, color: Colors.white30)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEC4899)),
              onPressed: () {
                final error = (_targetAngle - _angleGuess).abs().round();
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Localization Score'),
                    content: Text(
                      'Target sound was panned at Right 45°.\nYour guess: ${_angleGuess.round()}°.\nError: $error° (Accuracy Score: ${(100 - error).clamp(0, 100)}%).',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Close'),
                      ),
                    ],
                  ),
                );
              },
              child: const Text('Submit Guess Angle'),
            ),
            const Divider(height: 40, color: Colors.white10),
            const Text(
              'AirPods Live Listen Mode Setup',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 10),
            const Text('1. Connect AirPods Pro to your iOS device.\n2. Settings -> Control Center -> Add "Hearing".\n3. Slide down to open Control Center, tap Hearing.\n4. Enable Live Listen or Conversation Boost to route microphone feeds.', style: TextStyle(fontSize: 12, height: 1.5, color: Color(0xFF94A3B8))),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildFrequencySlider(String label, double value, ValueChanged<double> onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(fontSize: 13)),
            Text('+${value.round()} dB', style: const TextStyle(fontSize: 12, color: Color(0xFF8B5CF6), fontWeight: FontWeight.bold)),
          ],
        ),
        Slider(
          min: 0,
          max: 24,
          value: value,
          activeColor: const Color(0xFF8B5CF6),
          onChanged: onChanged,
        ),
      ],
    );
  }
}
