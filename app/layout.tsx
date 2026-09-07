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
    'Today’s venue hours, apples, activity updates, help, and an accessible farm map for Curtis Orchard & Pumpkin Patch.',
  openGraph: {
    title: 'Curtis Orchard Visitor Companion',
    description:
      'Today’s apples, activities, venue hours, and farm map—all in one quick guide.',
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
      'Today’s apples, activities, venue hours, and farm map—all in one quick guide.',
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
