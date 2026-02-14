// Permissions system for NexaBot
// Maps commands to required roles

export const RolePermissions: Record<string, string[]> = {
  // Admin commands
  'server:start': ['fondateur', 'responsable', 'gerant', 'admin'],
  'server:stop': ['fondateur', 'responsable', 'gerant', 'admin'],
  'server:restart': ['fondateur', 'responsable', 'gerant', 'admin'],
  'server:list': ['fondateur', 'responsable', 'gerant', 'admin'],
  'server:console': ['fondateur', 'responsable', 'gerant', 'admin'],
  
  // Moderation
  'ban': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod'],
  'mute': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod'],
  'kick': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod'],
  'warn': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod'],
  'clear': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod'],
  'lock': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod', 'assistant'],
  'slowmode': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod'],
  
  // Staff management
  'staff:list': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod'],
  'staff:promote': ['fondateur', 'responsable', 'gerant', 'admin'],
  'staff:demote': ['fondateur', 'responsable', 'gerant', 'admin'],
  'staff:warn': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod'],
  'staff:activity': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod'],
  
  // Reputation
  'rep:give': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod'],
  'rep:remove': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod'],
  'rep:profile:staff': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod', 'assistant'],
  
  // Tickets
  'ticket:create': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod', 'assistant'],
  'ticket:close': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod', 'assistant'],
  'ticket:list': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod', 'mod', 'assistant'],
  
  // Recruitment
  'recruit:list': ['fondateur', 'responsable', 'gerant', 'admin', 'supermod'],
  
  // Public commands - everyone can use
  'vote': [],
  'stats': [],
  'leaderboard': [],
  'shop': [],
  'rep:profile': [],
  'recruit:apply': [],
  'recruit:status': [],
};

export const RoleHierarchy: Record<string, number> = {
  fondateur: 100,
  responsable: 90,
  gerant: 80,
  admin: 70,
  supermod: 60,
  mod: 50,
  mod_test: 45,
  assistant: 40,
  assistant_test: 35,
  player: 10,
};

export function hasPermission(userRoles: string[], command: string): boolean {
  // Get required roles for command
  const requiredRoles = RolePermissions[command];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // Public command
  }
  
  // Check if user has any of the required roles
  return userRoles.some(role => requiredRoles.includes(role));
}

export function isHigherRole(requesterRoles: string[], targetRole: string): boolean {
  const requesterLevel = Math.max(...requesterRoles.map(r => RoleHierarchy[r] || 0));
  const targetLevel = RoleHierarchy[targetRole] || 0;
  
  return requesterLevel > targetLevel;
}

export function getStaffRoleFromHierarchy(roles: string[]): string | null {
  const sortedRoles = [...roles].sort((a, b) => 
    (RoleHierarchy[b] || 0) - (RoleHierarchy[a] || 0)
  );
  
  return sortedRoles[0] || null;
}
