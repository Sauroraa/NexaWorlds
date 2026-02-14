'use client';

import { motion } from 'framer-motion';
import { User, ShoppingBag, Vote, Star, Clock, Shield, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatPrice, formatDate } from '@/lib/utils';

const mockUser = {
  username: 'Steve',
  uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5',
  role: 'player' as const,
  grade: 'Aventurier',
  reputation: 750,
  maxReputation: 1000,
  registeredAt: '2024-06-15',
  lastSeen: '2025-02-14',
  stats: {
    playtime: '127h 45m',
    kills: 342,
    deaths: 89,
    blocksPlaced: 45230,
    blocksBroken: 38120,
  },
};

const mockOrders = [
  { id: '1', name: 'Grade Aventurier', price: 9.99, date: '2025-01-15', status: 'completed' as const },
  { id: '2', name: '500 Shards', price: 7.99, date: '2025-02-01', status: 'completed' as const },
  { id: '3', name: 'Boost XP 24h', price: 4.99, date: '2025-02-10', status: 'completed' as const },
];

const mockVotes = {
  total: 47,
  monthly: 12,
  streak: 5,
  lastVote: '2025-02-14',
};

export default function ProfilPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="relative">
              <img
                src={`https://crafatar.com/avatars/${mockUser.uuid}?size=128&overlay`}
                alt={mockUser.username}
                className="w-24 h-24 rounded-xl border-2 border-nexa-purple/50"
              />
              <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-nexa-purple border-0">
                {mockUser.grade}
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{mockUser.username}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" /> Membre depuis {formatDate(mockUser.registeredAt)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">UUID: {mockUser.uuid}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Réputation', value: mockUser.reputation, icon: Star, color: 'text-nexa-orange' },
            { label: 'Temps de jeu', value: mockUser.stats.playtime, icon: Clock, color: 'text-nexa-blue' },
            { label: 'Votes total', value: mockVotes.total, icon: Vote, color: 'text-nexa-green' },
            { label: 'Streak', value: `${mockVotes.streak} jours`, icon: TrendingUp, color: 'text-nexa-purple' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass">
                <CardContent className="p-4 flex items-center gap-3">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reputation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-nexa-orange" />
                  Réputation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Niveau actuel</span>
                  <span className="text-sm font-medium">{mockUser.reputation}/{mockUser.maxReputation}</span>
                </div>
                <Progress value={(mockUser.reputation / mockUser.maxReputation) * 100} />
                <p className="text-xs text-muted-foreground mt-2">
                  Encore {mockUser.maxReputation - mockUser.reputation} points pour le prochain palier.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-nexa-blue" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(mockUser.stats).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-medium">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Orders */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingBag className="h-5 w-5 text-nexa-purple" />
                  Derniers achats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                    <div>
                      <p className="text-sm font-medium">{order.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatPrice(order.price)}</p>
                      <Badge variant="success" className="text-[10px]">Complété</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Votes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Vote className="h-5 w-5 text-nexa-green" />
                  Votes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Votes totaux</span>
                  <span className="text-sm font-medium">{mockVotes.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Votes ce mois</span>
                  <span className="text-sm font-medium">{mockVotes.monthly}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Streak actuel</span>
                  <span className="text-sm font-medium">{mockVotes.streak} jours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dernier vote</span>
                  <span className="text-sm font-medium">{formatDate(mockVotes.lastVote)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
