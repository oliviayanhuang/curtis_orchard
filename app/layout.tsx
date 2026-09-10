import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://curtis-orchard-visitor-companion.wise-skunk-4952.chatgpt.site',
  ),
  title: 'Curtis Orchard Visitor Companion',
  description:
    'Find your way, discover what to do, and build a simple plan for your Curtis Orchard visit.',
  openGraph: {
    title: 'Curtis Orchard Visitor Companion',
    description:
      'Map the orchard, explore activities, and build a simple visit plan.',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Curtis Orchard Visitor Companion illustrated social card',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curtis Orchard Visitor Companion',
    description:
      'Map the orchard, explore activities, and build a simple visit plan.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
