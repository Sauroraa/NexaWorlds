import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NexaWorlds - Serveur Minecraft',
  description: 'NexaWorlds - Serveur Minecraft nouvelle génération. Rejoins une aventure unique avec des modes de jeu innovants.',
  keywords: ['minecraft', 'serveur', 'nexaworlds', 'survie', 'skyblock', 'pvp'],
  openGraph: {
    title: 'NexaWorlds - Serveur Minecraft',
    description: 'Rejoins NexaWorlds, le serveur Minecraft nouvelle génération.',
    url: 'https://nexaworlds.fr',
    siteName: 'NexaWorlds',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
