'use client';

import { Settings, Globe, Shield, Bell, Database, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-sm text-muted-foreground">Configuration globale du système</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-nexa-blue" />
              Général
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom du serveur</label>
              <Input defaultValue="NexaWorlds" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">IP du serveur</label>
              <Input defaultValue="play.nexaworlds.fr" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mode maintenance</label>
              <div className="flex items-center gap-3">
                <Badge variant="success">Désactivé</Badge>
                <Button variant="outline" size="sm">Activer</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Key className="h-5 w-5 text-nexa-orange" />
              API & Intégrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Clé API Stripe</label>
              <Input type="password" defaultValue="sk_test_..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook Discord</label>
              <Input type="password" defaultValue="https://discord.com/api/webhooks/..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Clé NexaLink</label>
              <div className="flex gap-2">
                <Input defaultValue="nxl_a1b2c3d4e5f6" readOnly className="font-mono text-sm" />
                <Button variant="outline" size="sm">Régénérer</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-nexa-green" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">2FA Administrateurs</p>
                <p className="text-xs text-muted-foreground">Authentification double facteur requise</p>
              </div>
              <Badge variant="success">Activé</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Rate Limiting API</p>
                <p className="text-xs text-muted-foreground">100 requêtes / minute / IP</p>
              </div>
              <Badge variant="success">Activé</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">IP Whitelist NexaLink</p>
                <p className="text-xs text-muted-foreground">2 IPs autorisées</p>
              </div>
              <Button variant="outline" size="sm">Configurer</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5 text-nexa-purple" />
              Base de données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Backup automatique</p>
                <p className="text-xs text-muted-foreground">Dernier backup: aujourd&apos;hui 04:00</p>
              </div>
              <Badge variant="success">Quotidien</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Backup manuel</Button>
              <Button variant="outline" size="sm">Restaurer</Button>
            </div>
          </CardContent>
        </Card>

        <Button variant="glow" className="w-full">Sauvegarder les paramètres</Button>
      </div>
    </div>
  );
}
