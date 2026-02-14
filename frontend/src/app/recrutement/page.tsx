'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Users, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface FormData {
  username: string;
  age: string;
  discord: string;
  email: string;
  playtime: string;
  experience: string;
  motivation: string;
  availability: string;
  skills: string;
  additional: string;
}

export default function RecrutementPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    username: '', age: '', discord: '', email: '',
    playtime: '', experience: '', motivation: '',
    availability: '', skills: '', additional: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="glass max-w-lg text-center">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-nexa-green mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Candidature envoyée !</h2>
              <p className="text-muted-foreground mb-4">
                Ta candidature a été soumise avec succès. Notre équipe l&apos;examinera dans les prochaines 48h.
              </p>
              <Badge variant="outline" className="text-sm">
                Statut: En attente de review
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Recrutement</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tu veux rejoindre l&apos;équipe NexaWorlds ? Remplis le formulaire ci-dessous.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users, label: 'Postes ouverts', value: '3', color: 'text-nexa-green' },
            { icon: FileText, label: 'Candidatures', value: '24', color: 'text-nexa-blue' },
            { icon: Clock, label: 'Délai réponse', value: '48h', color: 'text-nexa-orange' },
          ].map((stat, i) => (
            <Card key={i} className="glass">
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass">
            <CardHeader>
              <CardTitle>Formulaire de candidature</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pseudo Minecraft *</label>
                    <Input name="username" value={form.username} onChange={handleChange} placeholder="Ton pseudo en jeu" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Âge *</label>
                    <Input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Ton âge" required min="13" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discord *</label>
                    <Input name="discord" value={form.discord} onChange={handleChange} placeholder="Ton tag Discord" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="ton@email.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Temps de jeu sur NexaWorlds *</label>
                  <Input name="playtime" value={form.playtime} onChange={handleChange} placeholder="Ex: 50 heures, depuis 3 mois" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Expérience en modération/staff *</label>
                  <Textarea
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Décris tes expériences passées en tant que staff sur d'autres serveurs..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Motivation *</label>
                  <Textarea
                    name="motivation"
                    value={form.motivation}
                    onChange={handleChange}
                    placeholder="Pourquoi veux-tu rejoindre l'équipe NexaWorlds ?"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Disponibilités *</label>
                  <Textarea
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    placeholder="Tes horaires et jours de disponibilité..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Compétences particulières</label>
                  <Textarea
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="Dev, Build, Config, Rédaction, etc."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Informations supplémentaires</label>
                  <Textarea
                    name="additional"
                    value={form.additional}
                    onChange={handleChange}
                    placeholder="Quelque chose à ajouter ?"
                    rows={2}
                  />
                </div>

                <Button type="submit" variant="glow" size="lg" className="w-full gap-2">
                  <Send className="h-5 w-5" />
                  Envoyer ma candidature
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
