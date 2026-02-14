export const Colors = {
  PRIMARY: 0x7C3AED,
  SUCCESS: 0x10B981,
  WARNING: 0xF59E0B,
  ERROR: 0xEF4444,
  INFO: 0x3B82F6,
  CYAN: 0x06B6D4,
  ORANGE: 0xF97316,
  PINK: 0xEC4899,
  GOLD: 0xEAB308,
  REPUTATION: 0x8B5CF6,
  STAFF: 0x0EA5E9,
} as const;

export const RoleHierarchy = [
  'assistant_test',
  'assistant',
  'mod_test',
  'mod',
  'supermod',
  'admin',
  'gerant',
  'responsable',
  'fondateur',
] as const;

export const RoleColors: Record<string, number> = {
  fondateur: 0xEF4444,
  responsable: 0xF97316,
  gerant: 0xEAB308,
  admin: 0xEC4899,
  supermod: 0x3B82F6,
  mod: 0x10B981,
  mod_test: 0x22C55E,
  assistant: 0x06B6D4,
  assistant_test: 0x67E8F9,
  player: 0x6B7280,
};

export function getRoleColor(role: string): number {
  return RoleColors[role] || Colors.PRIMARY;
}

export function getRepBadge(reputation: number): { name: string; emoji: string } {
  if (reputation >= 5000) return { name: 'Legendaire', emoji: '🏆' };
  if (reputation >= 2500) return { name: 'Mythique', emoji: '💎' };
  if (reputation >= 1000) return { name: 'Epique', emoji: '⭐' };
  if (reputation >= 500) return { name: 'Rare', emoji: '🔷' };
  if (reputation >= 100) return { name: 'Notable', emoji: '🔹' };
  return { name: 'Nouveau', emoji: '🔸' };
}
