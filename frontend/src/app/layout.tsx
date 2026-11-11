import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIS CYBER FORTRESS — Enterprise Super Admin Command Center',
  description: 'God-level enterprise command and control console for the 12-in-1 SIS Cybersecurity Ecosystem.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-900 text-text-primary antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
