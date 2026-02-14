'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Shield, Ban, Eye, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const mockUsers = [
  { id: '1', username: 'DragonSlayer', uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5', role: 'player', grade: 'Héros', lastSeen: '2025-02-14', reputation: 890, status: 'online' },
  { id: '2', username: 'StarCraft', uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5', role: 'mod', grade: 'Légende', lastSeen: '2025-02-14', reputation: 1200, status: 'online' },
  { id: '3', username: 'MoonWalker', uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5', role: 'player', grade: 'Aventurier', lastSeen: '2025-02-13', reputation: 450, status: 'offline' },
  { id: '4', username: 'SkyBuilder', uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5', role: 'dev', grade: 'Légende', lastSeen: '2025-02-14', reputation: 980, status: 'online' },
  { id: '5', username: 'RedstoneKing', uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5', role: 'player', grade: 'Explorer', lastSeen: '2025-02-12', reputation: 320, status: 'offline' },
  { id: '6', username: 'NetherQueen', uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5', role: 'admin', grade: 'Légende', lastSeen: '2025-02-14', reputation: 1500, status: 'online' },
];

const roleColors: Record<string, string> = {
  superadmin: 'bg-red-500/20 text-red-400',
  admin: 'bg-orange-500/20 text-orange-400',
  manager: 'bg-yellow-500/20 text-yellow-400',
  dev: 'bg-blue-500/20 text-blue-400',
  mod: 'bg-green-500/20 text-green-400',
  player: 'bg-gray-500/20 text-gray-400',
};

export default function UsersPage() {
  const [search, setSearch] = useState('');

  const filtered = mockUsers.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
          <p className="text-sm text-muted-foreground">{mockUsers.length} utilisateurs enregistrés</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un joueur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="glass">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Joueur</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Rôle</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Grade</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Réputation</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Statut</th>
                  <th className="text-right p-4 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://crafatar.com/avatars/${user.uuid}?size=32&overlay`}
                          alt={user.username}
                          className="w-8 h-8 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium">{user.username}</p>
                          <p className="text-xs text-muted-foreground">Vu: {user.lastSeen}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={roleColors[user.role] || roleColors.player}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{user.grade}</td>
                    <td className="p-4 text-sm">{user.reputation}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-nexa-green' : 'bg-gray-500'}`} />
                        <span className="text-xs">{user.status === 'online' ? 'En ligne' : 'Hors ligne'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
