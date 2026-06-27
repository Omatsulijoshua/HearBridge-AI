import 'package:flutter/material.dart';

class JourneyTimelineScreen extends StatelessWidget {
  const JourneyTimelineScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final milestones = [
      {'day': 'DAY 1', 'title': 'Doorbell recognized', 'desc': 'Passed doorbell home category test with 95% accuracy.'},
      {'day': 'DAY 10', 'title': 'High Pitch birds tone', 'desc': 'Successfully identified outdoor ambient bird sounds.'},
      {'day': 'DAY 20', 'title': 'Live conversation helper practice', 'desc': 'Analyzed speech vowel clarity benchmarks.'}
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Rehab Journey Map'),
        backgroundColor: const Color(0xFF0A0F1D),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: ListView.builder(
          itemCount: milestones.length,
          itemBuilder: (context, i) {
            final ms = milestones[i];
            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  children: [
                    Container(
                      width: 24,
                      height: 24,
                      decoration: const BoxDecoration(
                        color: Color(0xFF8B5CF6),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check, size: 14, color: Colors.white),
                    ),
                    if (i < milestones.length - 1)
                      Container(
                        width: 2,
                        height: 60,
                        color: Colors.white10,
                      )
                  ],
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(ms['day']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF8B5CF6))),
                      const SizedBox(height: 2),
                      Text(ms['title']!, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text(ms['desc']!, style: const TextStyle(fontSize: 12, color: Colors.white54)),
                      const SizedBox(height: 24),
                    ],
                  ),
                )
              ],
            );
          },
        ),
      ),
    );
  }
}
