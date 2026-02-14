'use client';

import { motion } from 'framer-motion';
import { Activity, Cpu, MemoryStick, HardDrive, Wifi, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const systemStats = {
  cpu: 38,
  ram: { used: 14.2, total: 32 },
  disk: { used: 120, total: 500 },
  network: { in: '12.5 MB/s', out: '8.3 MB/s' },
  uptime: '14j 7h 23m',
};

const serverMetrics = [
  { name: 'Survival', tps: 19.8, mspt: 42, players: 52, chunks: 1240, entities: 3400, cpu: 45, ram: 72 },
  { name: 'Skyblock', tps: 20.0, mspt: 28, players: 38, chunks: 890, entities: 2100, cpu: 32, ram: 58 },
  { name: 'PvP', tps: 19.5, mspt: 48, players: 27, chunks: 560, entities: 1800, cpu: 28, ram: 45 },
  { name: 'Creative', tps: 20.0, mspt: 15, players: 10, chunks: 340, entities: 800, cpu: 15, ram: 32 },
];

export default function MonitoringPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Monitoring</h1>
        <p className="text-sm text-muted-foreground">Surveillance des ressources en temps réel</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Cpu className="h-5 w-5 text-nexa-orange" />
                <span className="text-2xl font-bold">{systemStats.cpu}%</span>
              </div>
              <Progress value={systemStats.cpu} />
              <p className="text-xs text-muted-foreground mt-2">CPU Global</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <MemoryStick className="h-5 w-5 text-nexa-blue" />
                <span className="text-2xl font-bold">{Math.round((systemStats.ram.used / systemStats.ram.total) * 100)}%</span>
              </div>
              <Progress value={(systemStats.ram.used / systemStats.ram.total) * 100} />
              <p className="text-xs text-muted-foreground mt-2">RAM: {systemStats.ram.used}/{systemStats.ram.total} GB</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <HardDrive className="h-5 w-5 text-nexa-green" />
                <span className="text-2xl font-bold">{Math.round((systemStats.disk.used / systemStats.disk.total) * 100)}%</span>
              </div>
              <Progress value={(systemStats.disk.used / systemStats.disk.total) * 100} />
              <p className="text-xs text-muted-foreground mt-2">Disque: {systemStats.disk.used}/{systemStats.disk.total} GB</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Wifi className="h-5 w-5 text-nexa-purple" />
                <Badge variant="success">Uptime</Badge>
              </div>
              <p className="text-lg font-bold">{systemStats.uptime}</p>
              <p className="text-xs text-muted-foreground mt-1">
                In: {systemStats.network.in} | Out: {systemStats.network.out}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Server Metrics */}
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Server className="h-5 w-5 text-nexa-blue" />
        Métriques par serveur
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {serverMetrics.map((server, i) => (
          <motion.div
            key={server.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-nexa-green" />
                    {server.name}
                  </span>
                  <Badge variant={server.tps >= 19 ? 'success' : server.tps >= 16 ? 'warning' : 'error'}>
                    {server.tps} TPS
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MSPT</span>
                    <span className={server.mspt > 50 ? 'text-red-400' : ''}>{server.mspt}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Joueurs</span>
                    <span>{server.players}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chunks</span>
                    <span>{server.chunks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entités</span>
                    <span>{server.entities.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-8">CPU</span>
                    <Progress value={server.cpu} className="h-2 flex-1" />
                    <span className="w-8 text-right">{server.cpu}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-8">RAM</span>
                    <Progress value={server.ram} className="h-2 flex-1" />
                    <span className="w-8 text-right">{server.ram}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
