import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';

export const metadata: Metadata = {
  title: 'SIS CYBER FORTRESS — 12-in-1 Enterprise Cyber Defense Ecosystem',
  description: 'Enterprise zero-trust cybersecurity command center, personal endpoint safeguards, and SOC telemetry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-950 text-text-primary antialiased min-h-screen">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
