'use client';

import { useState } from 'react';
import { FileText, Search, Filter, AlertTriangle, Info, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type LogLevel = 'all' | 'info' | 'warn' | 'error';

const mockLogs = [
  { id: '1', action: 'user.login', details: 'DragonSlayer s\'est connecté', level: 'info' as const, createdAt: '2025-02-14 14:32:15', userId: 'DragonSlayer' },
  { id: '2', action: 'order.complete', details: 'Achat Grade Aventurier par StarCraft (9.99€)', level: 'info' as const, createdAt: '2025-02-14 14:28:03', userId: 'StarCraft' },
  { id: '3', action: 'server.tps_low', details: 'TPS bas sur Survival: 15.2', level: 'warn' as const, createdAt: '2025-02-14 14:25:00', userId: 'system' },
  { id: '4', action: 'vote.received', details: 'Vote reçu de MoonWalker sur Top-Serveurs.net', level: 'info' as const, createdAt: '2025-02-14 14:20:12', userId: 'MoonWalker' },
  { id: '5', action: 'server.crash', details: 'Serveur Events crash: OutOfMemoryError', level: 'error' as const, createdAt: '2025-02-14 13:45:30', userId: 'system' },
  { id: '6', action: 'staff.apply', details: 'Nouvelle candidature de SkyBuilder', level: 'info' as const, createdAt: '2025-02-14 13:30:00', userId: 'SkyBuilder' },
  { id: '7', action: 'security.brute_force', details: 'Tentative brute force détectée: IP 192.168.1.100', level: 'error' as const, createdAt: '2025-02-14 13:15:22', userId: 'system' },
  { id: '8', action: 'server.start', details: 'Serveur Creative démarré avec succès', level: 'info' as const, createdAt: '2025-02-14 12:00:00', userId: 'NetherQueen' },
  { id: '9', action: 'webhook.sent', details: 'Webhook Discord envoyé: nouvel achat', level: 'info' as const, createdAt: '2025-02-14 11:45:10', userId: 'system' },
  { id: '10', action: 'server.backup', details: 'Backup journalier complété (12.4 GB)', level: 'info' as const, createdAt: '2025-02-14 04:00:00', userId: 'system' },
];

const levelIcons = {
  info: <Info className="h-4 w-4 text-blue-400" />,
  warn: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
  error: <XCircle className="h-4 w-4 text-red-400" />,
};

const levelBadge = {
  info: 'secondary' as const,
  warn: 'warning' as const,
  error: 'error' as const,
};

export default function LogsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<LogLevel>('all');

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch = log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || log.level === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Logs & Audit</h1>
        <p className="text-sm text-muted-foreground">Historique complet des actions système</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher dans les logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1">
          {(['all', 'info', 'warn', 'error'] as LogLevel[]).map((level) => (
            <Button
              key={level}
              variant={filter === level ? 'glow' : 'outline'}
              size="sm"
              onClick={() => setFilter(level)}
            >
              {level === 'all' ? 'Tous' : level.charAt(0).toUpperCase() + level.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Card className="glass">
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-white/5 transition-colors">
                {levelIcons[log.level]}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <code className="text-xs text-nexa-purple">{log.action}</code>
                    <Badge variant={levelBadge[log.level]} className="text-[10px]">{log.level}</Badge>
                  </div>
                  <p className="text-sm">{log.details}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {log.createdAt} — {log.userId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
