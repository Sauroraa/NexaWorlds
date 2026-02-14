'use client';

import { motion } from 'framer-motion';
import { Vote, Gift, Trophy, ExternalLink, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const voteSites = [
  { id: 'serveur-minecraft', name: 'Serveur-Minecraft.fr', url: 'https://serveur-minecraft.fr/vote/nexaworlds', color: 'from-blue-500 to-cyan-500' },
  { id: 'top-serveurs', name: 'Top-Serveurs.net', url: 'https://top-serveurs.net/vote/nexaworlds', color: 'from-green-500 to-emerald-500' },
  { id: 'serveur-prive', name: 'Serveur-Prive.net', url: 'https://serveur-prive.net/vote/nexaworlds', color: 'from-orange-500 to-yellow-500' },
  { id: 'liste-serveurs', name: 'Liste-Serveurs.fr', url: 'https://liste-serveurs.fr/vote/nexaworlds', color: 'from-purple-500 to-pink-500' },
];

const rewards = [
  { votes: 1, reward: '50 Shards + 1 Crate Commune', claimed: true },
  { votes: 5, reward: '200 Shards + 1 Crate Rare', claimed: true },
  { votes: 10, reward: '500 Shards + 1 Crate Épique', claimed: false },
  { votes: 25, reward: '1500 Shards + 1 Crate Légendaire', claimed: false },
  { votes: 50, reward: '5000 Shards + Kit Voteur Exclusif', claimed: false },
  { votes: 100, reward: 'Tag [Voteur] + Cosmétique Exclusif', claimed: false },
];

const topVoters = [
  { rank: 1, username: 'DragonSlayer', votes: 124, uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5' },
  { rank: 2, username: 'StarCraft', votes: 98, uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5' },
  { rank: 3, username: 'MoonWalker', votes: 87, uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5' },
  { rank: 4, username: 'SkyBuilder', votes: 76, uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5' },
  { rank: 5, username: 'RedstoneKing', votes: 65, uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5' },
];

const userVotes = 7;
const nextMilestone = 10;

export default function VotesPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Voter</span> pour NexaWorlds
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Vote chaque jour et gagne des récompenses exclusives. Chaque vote compte !
          </p>
        </motion.div>

        {/* Vote Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Vote className="h-5 w-5 text-nexa-purple" />
                  <span className="font-semibold">Ta progression</span>
                </div>
                <span className="text-sm text-muted-foreground">{userVotes}/{nextMilestone} votes</span>
              </div>
              <Progress value={(userVotes / nextMilestone) * 100} className="mb-2" />
              <p className="text-xs text-muted-foreground">
                Encore {nextMilestone - userVotes} votes pour débloquer la prochaine récompense !
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vote Sites */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-nexa-purple" />
              Sites de vote
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {voteSites.map((site, i) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass glass-hover">
                    <CardContent className="p-5">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${site.color} mb-3 flex items-center justify-center`}>
                        <Vote className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold mb-1">{site.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Toutes les 24h
                      </p>
                      <a href={site.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="glow" size="sm" className="w-full gap-2">
                          <Vote className="h-4 w-4" />
                          Voter
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Rewards */}
            <h2 className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-nexa-orange" />
              Récompenses
            </h2>
            <div className="space-y-3">
              {rewards.map((reward, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={`glass ${reward.claimed ? 'border-nexa-green/30' : userVotes >= reward.votes ? 'border-nexa-orange/30 animate-glow' : ''}`}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          reward.claimed ? 'bg-nexa-green/20 text-nexa-green' : 'bg-white/5 text-muted-foreground'
                        }`}>
                          {reward.votes}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{reward.reward}</p>
                          <p className="text-xs text-muted-foreground">{reward.votes} votes requis</p>
                        </div>
                      </div>
                      {reward.claimed ? (
                        <Badge variant="success">Récupéré</Badge>
                      ) : userVotes >= reward.votes ? (
                        <Button variant="glow" size="sm">Récupérer</Button>
                      ) : (
                        <Badge variant="outline">{reward.votes - userVotes} restants</Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Top Voters */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-nexa-orange" />
              Top Voteurs du mois
            </h2>
            <Card className="glass">
              <CardContent className="p-4 space-y-3">
                {topVoters.map((voter, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      i === 1 ? 'bg-gray-400/20 text-gray-300' :
                      i === 2 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-white/5 text-muted-foreground'
                    }`}>
                      {i === 0 ? <Star className="h-4 w-4" /> : voter.rank}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{voter.username}</p>
                      <p className="text-xs text-muted-foreground">{voter.votes} votes</p>
                    </div>
                    {i < 3 && (
                      <Trophy className={`h-4 w-4 ${
                        i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : 'text-orange-400'
                      }`} />
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
