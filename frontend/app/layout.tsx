import '../styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HearBridge AI | AI-Powered Hearing & Speech Rehabilitation Platform',
  description: 'The world\'s first "Duolingo for Hearing Rehabilitation" designed for cochlear implant recipients, deaf and hard-of-hearing individuals, speech therapists, and clinics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦻</text></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
