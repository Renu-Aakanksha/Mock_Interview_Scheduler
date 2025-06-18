import { User } from './types';

const AUTH_KEY = 'interview_app_auth';

export function getStoredAuth(): { user: User | null; token: string | null } {
  if (typeof window === 'undefined') return { user: null, token: null };
  
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return { user: null, token: null };
    
    const parsed = JSON.parse(stored);
    return {
      user: parsed.user || null,
      token: parsed.token || null
    };
  } catch {
    return { user: null, token: null };
  }
}

export function setStoredAuth(user: User, token: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(AUTH_KEY, JSON.stringify({
    user,
    token,
    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }));
}

export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}