import 'package:flutter/material.dart';
import 'screens/sound_recognition_screen.dart';
import 'screens/speech_coach_screen.dart';
import 'screens/sound_detector_screen.dart';
import 'screens/conversation_assistant_screen.dart';
import 'screens/journey_timeline_screen.dart';

void main() {
  runApp(const HearBridgeApp());
}

class HearBridgeApp extends StatelessWidget {
  const HearBridgeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HearBridge AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF8B5CF6),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF8B5CF6),
          secondary: Color(0xFFEC4899),
          surface: Color(0xFF1E293B),
        ),
        textTheme: const TextTheme(
          displayLarge: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold),
          titleLarge: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.w600),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const PatientPortalHome(),
        '/sound_training': (context) => const SoundRecognitionScreen(),
        '/speech_coach': (context) => const SpeechCoachScreen(),
        '/ambient_detector': (context) => const SoundDetectorScreen(),
        '/live_conversation': (context) => const ConversationAssistantScreen(),
        '/timeline': (context) => const JourneyTimelineScreen(),
      },
    );
  }
}

class PatientPortalHome extends StatelessWidget {
  const PatientPortalHome({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('HearBridge Mobile Patient Portal', style: TextStyle(fontFamily: 'Outfit')),
        backgroundColor: const Color(0xFF0A0F1D),
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: ListView(
          children: [
            const Text(
              'Your Rehabilitation Modules',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 16),
            _buildModuleCard(
              context,
              title: 'Sound Recognition',
              desc: 'Listen, guess, and train your ears to identify home, nature, and warning signals.',
              icon: Icons.volume_up,
              route: '/sound_training',
              color: const Color(0xFF8B5CF6),
            ),
            _buildModuleCard(
              context,
              title: 'AI Speech Coach',
              desc: 'Practice words, match pitch and mouth placement guides to improve pronunciation.',
              icon: Icons.mic,
              route: '/speech_coach',
              color: const Color(0xFFEC4899),
            ),
            _buildModuleCard(
              context,
              title: 'Ambient Sound Detector',
              desc: 'Listen for real-world sirens, alerts, doorbells, and babies crying.',
              icon: Icons.security,
              route: '/ambient_detector',
              color: Colors.orange,
            ),
            _buildModuleCard(
              context,
              title: 'Live Captions & Translator',
              desc: 'Stream speech to text in real time with slow speed audio playback.',
              icon: Icons.translate,
              route: '/live_conversation',
              color: Colors.cyan,
            ),
            _buildModuleCard(
              context,
              title: 'Rehabilitation Timeline',
              desc: 'Track milestones, progress trends, and export your therapy stories.',
              icon: Icons.timeline,
              route: '/timeline',
              color: Colors.green,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildModuleCard(
    BuildContext context, {
    required String title,
    required String desc,
    required IconData icon,
    required String route,
    required Color color,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      color: const Color(0xFF1E293B),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => Navigator.pushNamed(context, route),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(desc, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: Color(0xFF64748B)),
            ],
          ),
        ),
      ),
    );
  }
}
