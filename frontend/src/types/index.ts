export interface User {
  id: string;
  username: string;
  email: string;
  uuid: string;
  role: UserRole;
  reputation: number;
  createdAt: string;
}

export type UserRole = 'player' | 'mod' | 'dev' | 'manager' | 'admin' | 'superadmin';

export interface Grade {
  id: string;
  name: string;
  price: number;
  color: string;
  icon: string;
  features: string[];
  popular?: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'grade' | 'shard' | 'crate' | 'booster' | 'housing';
  image?: string;
  features?: string[];
  popular?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripeSessionId?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: string;
}

export interface Vote {
  id: string;
  userId: string;
  site: string;
  rewardClaimed: boolean;
  createdAt: string;
}

export interface VoteStats {
  totalVotes: number;
  monthlyVotes: number;
  topVoters: TopVoter[];
}

export interface TopVoter {
  username: string;
  uuid: string;
  votes: number;
  rank: number;
}

export interface Server {
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
  containerId?: string;
}

export interface StaffApplication {
  id: string;
  userId: string;
  username: string;
  age: number;
  motivation: string;
  experience: string;
  availability: string;
  score: number;
  status: 'pending' | 'accepted' | 'rejected' | 'interview';
  createdAt: string;
}

export interface LogEntry {
  id: string;
  action: string;
  userId?: string;
  details: string;
  level: 'info' | 'warn' | 'error';
  createdAt: string;
}
