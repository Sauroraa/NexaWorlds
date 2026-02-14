import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  uuid: string;
  role: string;
  avatar?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'grade' | 'shard' | 'crate' | 'booster' | 'housing';
  image?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

interface StatsStore {
  playersOnline: number;
  totalPlayers: number;
  totalVotes: number;
  serverStatus: 'online' | 'offline' | 'maintenance';
  setStats: (stats: Partial<StatsStore>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user, isAuthenticated: true }),
}));

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));

export const useStatsStore = create<StatsStore>((set) => ({
  playersOnline: 0,
  totalPlayers: 0,
  totalVotes: 0,
  serverStatus: 'online',
  setStats: (stats) => set((state) => ({ ...state, ...stats })),
}));
