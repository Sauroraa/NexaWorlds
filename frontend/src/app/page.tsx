'use client';

import { motion } from 'framer-motion';
import { Copy, Users, Vote, ShoppingBag, ChevronRight, Gamepad2, Shield, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import Link from 'next/link';

const SERVER_IP = 'play.nexaworlds.fr';

const stats = [
  { label: 'Joueurs en ligne', value: '127', icon: Users, color: 'text-nexa-green' },
  { label: 'Joueurs inscrits', value: '12,459', icon: Gamepad2, color: 'text-nexa-blue' },
  { label: 'Votes ce mois', value: '3,281', icon: Vote, color: 'text-nexa-orange' },
];

const grades = [
  {
    name: 'Explorer',
    price: '4.99€',
    color: 'from-green-500 to-emerald-600',
    features: ['Préfixe coloré', '2 homes', 'Kit Explorer'],
  },
  {
    name: 'Aventurier',
    price: '9.99€',
    color: 'from-blue-500 to-cyan-600',
    features: ['Préfixe animé', '5 homes', 'Kit Aventurier', 'Particules'],
    popular: true,
  },
  {
    name: 'Héros',
    price: '19.99€',
    color: 'from-purple-500 to-pink-600',
    features: ['Préfixe légendaire', '10 homes', 'Kit Héros', 'Pets', 'Fly lobby'],
  },
  {
    name: 'Légende',
    price: '34.99€',
    color: 'from-yellow-500 to-orange-600',
    features: ['Tout Héros', 'Homes illimités', 'Kit Légende', 'Cosmétiques exclusifs', 'Priority queue'],
  },
];

const features = [
  {
    icon: Shield,
    title: 'Anti-Cheat Avancé',
    description: 'Protection maximale contre les tricheurs avec notre système custom.',
  },
  {
    icon: Zap,
    title: 'Performance Optimale',
    description: 'Serveurs optimisés pour un TPS constant de 20.',
  },
  {
    icon: Star,
    title: 'Contenu Exclusif',
    description: 'Des modes de jeu uniques créés par notre équipe de développement.',
  },
  {
    icon: Users,
    title: 'Communauté Active',
    description: 'Rejoins une communauté passionnée et bienveillante.',
  },
];

export default function HomePage() {
  const [copied, setCopied] = useState(false);

  const copyIP = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nexa-purple/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nexa-blue/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-nexa-purple/50 text-nexa-purple">
              Saison 3 disponible
            </Badge>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
              <span className="text-gradient">Nexa</span>
              <span className="text-foreground">Worlds</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Plonge dans un univers Minecraft nouvelle génération.
              Survie, Skyblock, PvP et bien plus encore.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button variant="glow" size="xl" onClick={copyIP} className="gap-2 min-w-[200px]">
                <Copy className="h-5 w-5" />
                {copied ? 'IP Copiée !' : SERVER_IP}
              </Button>
              <Link href="/boutique">
                <Button variant="outline" size="xl" className="gap-2 min-w-[200px]">
                  <ShoppingBag className="h-5 w-5" />
                  Boutique
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-xl px-6 py-4 flex items-center gap-3">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div className="text-left">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi <span className="text-gradient">NexaWorlds</span> ?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Un serveur pensé pour les joueurs, par les joueurs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass glass-hover h-full">
                  <CardContent className="p-6">
                    <feature.icon className="h-10 w-10 text-nexa-purple mb-4" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Grades Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nos <span className="text-gradient">Grades</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Débloque des avantages exclusifs et soutiens le serveur.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {grades.map((grade, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {grade.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-nexa-orange text-white border-0">Populaire</Badge>
                  </div>
                )}
                <Card className={`glass glass-hover h-full ${grade.popular ? 'border-nexa-purple/50 shadow-lg shadow-nexa-purple/20' : ''}`}>
                  <CardHeader className="text-center pb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grade.color} mx-auto mb-2 flex items-center justify-center`}>
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{grade.name}</CardTitle>
                    <p className="text-2xl font-bold text-gradient">{grade.price}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {grade.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="h-4 w-4 text-nexa-purple" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/boutique" className="block mt-4">
                      <Button variant={grade.popular ? 'glow' : 'outline'} className="w-full">
                        Acheter
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="glass border-nexa-purple/30 p-8">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à rejoindre l&apos;aventure ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Connecte-toi dès maintenant et découvre NexaWorlds.
              </p>
              <Button variant="glow" size="xl" onClick={copyIP} className="gap-2">
                <Copy className="h-5 w-5" />
                {copied ? 'IP Copiée !' : `Copier ${SERVER_IP}`}
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
