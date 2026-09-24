import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Radiant — Clinical Decision Support System',
  description: 'AI-powered clinical decision support for healthcare professionals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}