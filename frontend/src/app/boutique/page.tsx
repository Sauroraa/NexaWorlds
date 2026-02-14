'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Gem, Package, Zap, Home, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

type Category = 'grades' | 'shards' | 'crates' | 'boosters' | 'housing';

const categories: { id: Category; label: string; icon: React.ElementType }[] = [
  { id: 'grades', label: 'Grades', icon: Star },
  { id: 'shards', label: 'Shards', icon: Gem },
  { id: 'crates', label: 'Crates', icon: Package },
  { id: 'boosters', label: 'Boosters', icon: Zap },
  { id: 'housing', label: 'Housing', icon: Home },
];

const products: Record<Category, Array<{
  id: string; name: string; price: number; description: string; features?: string[]; popular?: boolean; image?: string;
}>> = {
  grades: [
    {
      id: 'grade-explorer', name: 'Explorer', price: 4.99,
      description: 'Le grade parfait pour commencer.',
      features: ['Préfixe coloré [Explorer]', '2 homes', 'Kit Explorer quotidien', 'Accès /craft'],
    },
    {
      id: 'grade-aventurier', name: 'Aventurier', price: 9.99, popular: true,
      description: 'Le choix préféré de la communauté.',
      features: ['Préfixe animé [Aventurier]', '5 homes', 'Kit Aventurier quotidien', 'Particules custom', 'Accès /ec'],
    },
    {
      id: 'grade-heros', name: 'Héros', price: 19.99,
      description: 'Pour les joueurs ambitieux.',
      features: ['Préfixe légendaire [Héros]', '10 homes', 'Kit Héros quotidien', 'Pets exclusifs', 'Fly en lobby', 'Accès /hat'],
    },
    {
      id: 'grade-legende', name: 'Légende', price: 34.99,
      description: 'Le grade ultime NexaWorlds.',
      features: ['Tous les avantages Héros', 'Homes illimités', 'Kit Légende quotidien', 'Cosmétiques exclusifs', 'Priority queue', 'Tag custom'],
    },
  ],
  shards: [
    { id: 'shards-100', name: '100 Shards', price: 1.99, description: 'Pack de 100 Shards pour la boutique en jeu.' },
    { id: 'shards-500', name: '500 Shards', price: 7.99, description: 'Pack de 500 Shards (+100 bonus).', popular: true },
    { id: 'shards-1000', name: '1000 Shards', price: 14.99, description: 'Pack de 1000 Shards (+300 bonus).' },
    { id: 'shards-5000', name: '5000 Shards', price: 59.99, description: 'Pack de 5000 Shards (+2000 bonus).' },
  ],
  crates: [
    { id: 'crate-common', name: 'Crate Commune', price: 0.99, description: 'Clé pour une crate commune.' },
    { id: 'crate-rare', name: 'Crate Rare', price: 2.49, description: 'Clé pour une crate rare.' },
    { id: 'crate-epic', name: 'Crate Épique', price: 4.99, description: 'Clé pour une crate épique.', popular: true },
    { id: 'crate-legendary', name: 'Crate Légendaire', price: 9.99, description: 'Clé pour une crate légendaire.' },
  ],
  boosters: [
    { id: 'boost-xp-1h', name: 'Boost XP 1h', price: 1.49, description: 'Double XP pendant 1 heure.' },
    { id: 'boost-xp-24h', name: 'Boost XP 24h', price: 4.99, description: 'Double XP pendant 24 heures.', popular: true },
    { id: 'boost-drop-1h', name: 'Boost Drop 1h', price: 1.99, description: 'Taux de drop x2 pendant 1 heure.' },
    { id: 'boost-money-1h', name: 'Boost Money 1h', price: 1.99, description: 'Gains x2 pendant 1 heure.' },
  ],
  housing: [
    { id: 'housing-small', name: 'Terrain Petit', price: 4.99, description: 'Terrain 16x16 pour ton housing.' },
    { id: 'housing-medium', name: 'Terrain Moyen', price: 9.99, description: 'Terrain 32x32 pour ton housing.', popular: true },
    { id: 'housing-large', name: 'Terrain Grand', price: 19.99, description: 'Terrain 64x64 pour ton housing.' },
    { id: 'housing-theme', name: 'Pack Thèmes', price: 6.99, description: '5 thèmes de décoration exclusifs.' },
  ],
};

export default function BoutiquePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('grades');
  const [showCart, setShowCart] = useState(false);
  const { items, addItem, removeItem, total, clearCart } = useCartStore();

  const handleAdd = (product: typeof products.grades[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      type: activeCategory,
    });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Boutique</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Découvre nos grades, shards, crates et bien plus encore.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'glow' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => setActiveCategory(cat.id)}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products[activeCategory].map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative"
            >
              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-nexa-orange text-white border-0">Populaire</Badge>
                </div>
              )}
              <Card className={`glass glass-hover h-full flex flex-col ${product.popular ? 'border-nexa-purple/50' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {product.features && (
                    <ul className="space-y-1.5 mb-4 flex-1">
                      {product.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-nexa-green flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto">
                    <p className="text-2xl font-bold text-gradient mb-3">{formatPrice(product.price)}</p>
                    <Button
                      variant="glow"
                      className="w-full gap-2"
                      onClick={() => handleAdd(product)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Ajouter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Cart Summary */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="glass border-nexa-purple/50 shadow-xl shadow-nexa-purple/20 w-80">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Panier ({items.length})
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowCart(!showCart)}>
                  {showCart ? <X className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                </Button>
              </CardHeader>
              {showCart && (
                <CardContent className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <div className="flex items-center gap-2">
                        <span>{formatPrice(item.price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-gradient">{formatPrice(total())}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={clearCart}>
                      Vider
                    </Button>
                    <Button variant="glow" size="sm" className="flex-1">
                      Payer
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
