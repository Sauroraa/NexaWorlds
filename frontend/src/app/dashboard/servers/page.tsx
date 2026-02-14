'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Server, Play, Square, RotateCw, Plus, Terminal, Cpu, MemoryStick,
  Users, Activity, Trash2, Settings, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface ServerData {
  id: string;
  name: string;
  type: 'paper' | 'purpur';
  version: string;
  status: 'running' | 'stopped' | 'starting' | 'error';
  port: number;
  ram: number;
  maxRam: number;
  playersOnline: number;
  maxPlayers: number;
  tps: number;
  cpu: number;
}

const mockServers: ServerData[] = [
  { id: '1', name: 'Survival', type: 'paper', version: '1.21.4', status: 'running', port: 25565, ram: 4.2, maxRam: 6, playersOnline: 52, maxPlayers: 100, tps: 19.8, cpu: 45 },
  { id: '2', name: 'Skyblock', type: 'paper', version: '1.21.4', status: 'running', port: 25566, ram: 3.1, maxRam: 4, playersOnline: 38, maxPlayers: 80, tps: 20.0, cpu: 32 },
  { id: '3', name: 'PvP', type: 'purpur', version: '1.21.4', status: 'running', port: 25567, ram: 2.4, maxRam: 4, playersOnline: 27, maxPlayers: 60, tps: 19.5, cpu: 28 },
  { id: '4', name: 'Creative', type: 'paper', version: '1.21.4', status: 'running', port: 25568, ram: 1.8, maxRam: 3, playersOnline: 10, maxPlayers: 40, tps: 20.0, cpu: 15 },
  { id: '5', name: 'Dev', type: 'paper', version: '1.21.4', status: 'stopped', port: 25569, ram: 0, maxRam: 2, playersOnline: 0, maxPlayers: 20, tps: 0, cpu: 0 },
  { id: '6', name: 'Events', type: 'purpur', version: '1.21.4', status: 'stopped', port: 25570, ram: 0, maxRam: 8, playersOnline: 0, maxPlayers: 100, tps: 0, cpu: 0 },
];

export default function ServersPage() {
  const [servers] = useState<ServerData[]>(mockServers);
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleLogs] = useState([
    '[14:32:15] [Server thread/INFO]: DragonSlayer joined the game',
    '[14:32:18] [Server thread/INFO]: StarCraft joined the game',
    '[14:33:01] [Server thread/INFO]: [NexaLink] Vote reçu pour StarCraft',
    '[14:33:45] [Server thread/WARN]: Can\'t keep up! Is the server overloaded?',
    '[14:34:12] [Server thread/INFO]: MoonWalker left the game',
  ]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'running': return 'success';
      case 'stopped': return 'secondary';
      case 'starting': return 'warning';
      case 'error': return 'error';
      default: return 'outline';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'running': return 'En ligne';
      case 'stopped': return 'Arrêté';
      case 'starting': return 'Démarrage...';
      case 'error': return 'Erreur';
      default: return status;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Gestion des serveurs</h1>
          <p className="text-sm text-muted-foreground">Créer, gérer et monitorer vos serveurs Minecraft</p>
        </div>
        <Button variant="glow" className="gap-2" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" />
          Nouveau serveur
        </Button>
      </div>

      {/* Create Server Modal */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass border-nexa-purple/30 mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Créer un serveur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  <Input placeholder="Mon serveur" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Version</label>
                  <Input placeholder="1.21.4" defaultValue="1.21.4" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">RAM (GB)</label>
                  <Input type="number" placeholder="4" defaultValue="4" min="1" max="16" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <option value="paper">Paper</option>
                    <option value="purpur">Purpur</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="glow" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Créer
                </Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {servers.map((server, i) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className={`glass glass-hover cursor-pointer ${selectedServer?.id === server.id ? 'border-nexa-purple/50' : ''}`}
              onClick={() => setSelectedServer(server)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Server className={`h-5 w-5 ${server.status === 'running' ? 'text-nexa-green' : 'text-gray-500'}`} />
                    <div>
                      <h3 className="font-semibold">{server.name}</h3>
                      <p className="text-xs text-muted-foreground">{server.type} {server.version} | Port {server.port}</p>
                    </div>
                  </div>
                  <Badge variant={statusColor(server.status) as 'success' | 'secondary' | 'warning' | 'error'}>
                    {statusLabel(server.status)}
                  </Badge>
                </div>

                {server.status === 'running' && (
                  <>
                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-nexa-blue" />
                        {server.playersOnline}/{server.maxPlayers}
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-nexa-green" />
                        <span className={server.tps < 18 ? 'text-red-400' : ''}>{server.tps} TPS</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Cpu className="h-3 w-3 text-nexa-orange" />
                        {server.cpu}% CPU
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <MemoryStick className="h-3 w-3" />
                      <Progress value={(server.ram / server.maxRam) * 100} className="h-2 flex-1" />
                      <span>{server.ram}/{server.maxRam} GB</span>
                    </div>
                  </>
                )}

                <div className="flex gap-2 mt-3">
                  {server.status === 'running' ? (
                    <>
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <Square className="h-3 w-3" />Stop
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <RotateCw className="h-3 w-3" />Restart
                      </Button>
                    </>
                  ) : (
                    <Button variant="glow" size="sm" className="gap-1 text-xs">
                      <Play className="h-3 w-3" />Démarrer
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="gap-1 text-xs ml-auto">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Console */}
      {selectedServer && selectedServer.status === 'running' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Terminal className="h-5 w-5 text-nexa-green" />
                Console — {selectedServer.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/50 rounded-lg p-4 font-mono text-xs h-64 overflow-y-auto mb-3 space-y-1">
                {consoleLogs.map((log, i) => (
                  <div key={i} className={`${log.includes('WARN') ? 'text-yellow-400' : log.includes('ERROR') ? 'text-red-400' : 'text-green-400'}`}>
                    {log}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={consoleInput}
                  onChange={(e) => setConsoleInput(e.target.value)}
                  placeholder="Entrer une commande..."
                  className="font-mono text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setConsoleInput('');
                    }
                  }}
                />
                <Button variant="glow" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
