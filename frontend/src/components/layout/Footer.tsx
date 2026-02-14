'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

const footerLinks = {
  'Navigation': [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/votes', label: 'Votes' },
    { href: '/recrutement', label: 'Recrutement' },
  ],
  'Légal': [
    { href: '/cgu', label: 'CGU' },
    { href: '/cgv', label: 'CGV' },
    { href: '/confidentialite', label: 'Confidentialité' },
  ],
  'Communauté': [
    { href: 'https://discord.gg/nexaworlds', label: 'Discord' },
    { href: 'https://twitter.com/nexaworlds', label: 'Twitter' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexa-purple to-nexa-blue flex items-center justify-center font-bold text-white text-sm">
                N
              </div>
              <span className="text-lg font-bold text-gradient">NexaWorlds</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Serveur Minecraft nouvelle génération.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              play.nexaworlds.fr
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NexaWorlds. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Fait avec <Heart className="h-3 w-3 text-red-500" /> par l&apos;équipe NexaWorlds
          </p>
        </div>
      </div>
    </footer>
  );
}
