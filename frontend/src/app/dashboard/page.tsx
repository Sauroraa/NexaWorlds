'use client';

import { motion } from 'framer-motion';
import { Server, Users, ShoppingBag, Vote, Activity, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const stats = [
  { label: 'Serveurs actifs', value: '4/6', icon: Server, color: 'text-nexa-green', trend: '+1' },
  { label: 'Joueurs en ligne', value: '127', icon: Users, color: 'text-nexa-blue', trend: '+23' },
  { label: 'Ventes du jour', value: '€89.50', icon: ShoppingBag, color: 'text-nexa-purple', trend: '+12%' },
  { label: 'Votes aujourd\'hui', value: '45', icon: Vote, color: 'text-nexa-orange', trend: '+8' },
];

const servers = [
  { name: 'Survival', status: 'running', players: 52, maxPlayers: 100, tps: 19.8, ram: 72 },
  { name: 'Skyblock', status: 'running', players: 38, maxPlayers: 80, tps: 20.0, ram: 58 },
  { name: 'PvP', status: 'running', players: 27, maxPlayers: 60, tps: 19.5, ram: 45 },
  { name: 'Creative', status: 'running', players: 10, maxPlayers: 40, tps: 20.0, ram: 32 },
  { name: 'Dev', status: 'stopped', players: 0, maxPlayers: 20, tps: 0, ram: 0 },
  { name: 'Events', status: 'stopped', players: 0, maxPlayers: 100, tps: 0, ram: 0 },
];

const recentActivity = [
  { type: 'purchase', message: 'DragonSlayer a acheté Grade Aventurier', time: 'Il y a 5 min', level: 'info' as const },
  { type: 'vote', message: 'StarCraft a voté sur Serveur-Minecraft.fr', time: 'Il y a 12 min', level: 'info' as const },
  { type: 'alert', message: 'TPS bas sur Survival (15.2)', time: 'Il y a 25 min', level: 'warn' as const },
  { type: 'server', message: 'Serveur Events arrêté automatiquement', time: 'Il y a 1h', level: 'info' as const },
  { type: 'staff', message: 'Nouvelle candidature de MoonWalker', time: 'Il y a 2h', level: 'info' as const },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Vue d&apos;ensemble de NexaWorlds</p>
        </div>
        <Badge variant="success" className="gap-1">
          <Activity className="h-3 w-3" />
          Système opérationnel
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <Badge variant="outline" className="text-xs text-nexa-green">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Servers Status */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="h-5 w-5 text-nexa-blue" />
              État des serveurs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {servers.map((server) => (
              <div key={server.name} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-28">
                  <div className={`w-2 h-2 rounded-full ${server.status === 'running' ? 'bg-nexa-green' : 'bg-gray-500'}`} />
                  <span className="text-sm font-medium">{server.name}</span>
                </div>
                <div className="flex-1">
                  <Progress value={server.ram} />
                </div>
                <div className="text-right text-xs text-muted-foreground w-24">
                  {server.status === 'running' ? (
                    <>
                      <span>{server.players}/{server.maxPlayers}</span>
                      <span className="mx-1">|</span>
                      <span className={server.tps < 18 ? 'text-red-400' : 'text-nexa-green'}>{server.tps} TPS</span>
                    </>
                  ) : (
                    <span>Arrêté</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-nexa-orange" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  activity.level === 'warn' ? 'bg-yellow-400' : 'bg-nexa-blue'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                {activity.level === 'warn' && (
                  <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
