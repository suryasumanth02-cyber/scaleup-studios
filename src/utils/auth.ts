import { UserProfile, NicheType } from '../types';

const AUTH_USER_KEY = 'scaleup_studios_auth_user';
const REGISTERED_USERS_KEY = 'scaleup_studios_registered_users';

export interface DemoAccount {
  email: string;
  password: string;
  name: string;
  businessName: string;
  role: UserProfile['role'];
  niche: NicheType;
  badge: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'client@sportsacademy.club',
    password: 'sports2026',
    name: 'Marcus Sterling',
    businessName: 'Premier Sports Academy',
    role: 'Athletic Director',
    niche: 'sports',
    badge: '🏅 Sports Academy'
  },
  {
    email: 'sarah@apexluxury.com',
    password: 'luxury2026',
    name: 'Sarah Mitchell',
    businessName: 'Apex Luxury Properties',
    role: 'Managing Broker',
    niche: 'realestate',
    badge: '🏡 Real Estate'
  },
  {
    email: 'alex@auraglow.shop',
    password: 'ecommerce2026',
    name: 'Alex Rivera',
    businessName: 'Aura Glow Skincare',
    role: 'Founder & CMO',
    niche: 'ecommerce',
    badge: '📦 E-Commerce'
  }
];

// Initialize default demo users in storage
function initDefaultUsers(): Record<string, { profile: UserProfile; password: string }> {
  const users: Record<string, { profile: UserProfile; password: string }> = {};

  DEMO_ACCOUNTS.forEach(acc => {
    users[acc.email.toLowerCase()] = {
      profile: {
        id: `usr_${acc.niche}_${Date.now()}`,
        name: acc.name,
        email: acc.email,
        businessName: acc.businessName,
        role: acc.role,
        niche: acc.niche,
        avatarUrl: `https://images.unsplash.com/photo-${acc.niche === 'sports' || acc.niche === 'cricket' ? '1506794778202-cad84cf45f1d' : acc.niche === 'realestate' ? '1573496359142-b8d87734a5a2' : '1507003211169-0a1dd7228f2d'}?auto=format&fit=crop&w=200&q=80`,
        plan: 'Pro Studio',
        createdAt: '2026-01-15T09:00:00Z',
        connectedAccountsCount: 4
      },
      password: acc.password
    };
  });

  // Alias for backward compatibility with previous session credentials
  users['client@cricketacademy.club'] = {
    profile: {
      ...users['client@sportsacademy.club'].profile,
      email: 'client@cricketacademy.club',
    },
    password: 'cricket2026'
  };

  return users;
}

// Get all registered users from localStorage
export function getRegisteredUsers(): Record<string, { profile: UserProfile; password: string }> {
  if (typeof window === 'undefined') return initDefaultUsers();
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) {
      const defaults = initDefaultUsers();
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load registered users:', err);
    return initDefaultUsers();
  }
}

// Get currently active logged-in user
export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
      // Default to Sports Academy client on initial visit
      const defaults = getRegisteredUsers();
      const defaultUser = defaults['client@sportsacademy.club']?.profile || defaults['client@cricketacademy.club']?.profile || null;
      if (defaultUser) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(defaultUser));
      }
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get current user:', err);
    return null;
  }
}

// Login with email and password
export function loginUser(email: string, pass: string): { success: boolean; user?: UserProfile; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const account = users[cleanEmail];

  if (!account) {
    return { 
      success: false, 
      error: 'No account found with this email address. Please register or use a demo account.' 
    };
  }

  if (account.password !== pass) {
    return { 
      success: false, 
      error: 'Incorrect password. Please verify your credentials.' 
    };
  }

  // Save active session
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(account.profile));
  } catch (e) {
    console.error('Failed to set session:', e);
  }

  return { success: true, user: account.profile };
}

// Register a new client account
export function registerUser(data: {
  name: string;
  email: string;
  password: string;
  businessName: string;
  niche: NicheType;
  role?: UserProfile['role'];
}): { success: boolean; user?: UserProfile; error?: string } {
  const cleanEmail = data.email.trim().toLowerCase();
  
  if (!cleanEmail || !data.password || !data.name || !data.businessName) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  if (data.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const users = getRegisteredUsers();
  if (users[cleanEmail]) {
    return { success: false, error: 'An account with this email already exists. Please sign in.' };
  }

  const newProfile: UserProfile = {
    id: `usr_${Date.now()}`,
    name: data.name.trim(),
    email: cleanEmail,
    businessName: data.businessName.trim(),
    role: data.role || 'Owner',
    niche: data.niche,
    plan: 'Pro Studio',
    createdAt: new Date().toISOString(),
    connectedAccountsCount: 0
  };

  users[cleanEmail] = {
    profile: newProfile,
    password: data.password
  };

  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newProfile));
  } catch (e) {
    console.error('Failed to register user:', e);
  }

  return { success: true, user: newProfile };
}

// Log out active user
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (e) {
    console.error('Failed to clear session:', e);
  }
}
