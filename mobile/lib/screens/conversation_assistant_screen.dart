import 'package:flutter/material.dart';

class ConversationAssistantScreen extends StatefulWidget {
  const ConversationAssistantScreen({super.key});

  @override
  State<ConversationAssistantScreen> createState() => _ConversationAssistantScreenState();
}

class _ConversationAssistantScreenState extends State<ConversationAssistantScreen> {
  bool _isTranscribing = false;
  final List<Map<String, String>> _captions = [
    {'speaker': 'Therapist', 'text': 'Welcome to HearBridge. Speak clearly into the microphone.'},
    {'speaker': 'Patient', 'text': 'Thank you. I can read these subtitles easily.'}
  ];

  void _start() {
    setState(() {
      _isTranscribing = !_isTranscribing;
    });

    if (_isTranscribing) {
      Future.delayed(const Duration(seconds: 3), () {
        if (!mounted || !_isTranscribing) return;
        setState(() {
          _captions.add({'speaker': 'Therapist', 'text': 'Excellent pitch matching today Alexander.'});
        });
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Captions Assistant'),
        backgroundColor: const Color(0xFF0A0F1D),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white10),
                ),
                child: ListView.builder(
                  itemCount: _captions.length,
                  itemBuilder: (context, i) {
                    final cap = _captions[i];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(cap['speaker']!, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF8B5CF6), fontSize: 11)),
                          const SizedBox(height: 2),
                          Text(cap['text']!, style: const TextStyle(fontSize: 14, color: Colors.white)),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isTranscribing ? Colors.red : const Color(0xFF8B5CF6),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    onPressed: _start,
                    child: Text(_isTranscribing ? 'Transcribing...' : 'Start Captions'),
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1E293B),
                    padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
                  ),
                  onPressed: () {},
                  child: const Icon(Icons.translate),
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}
