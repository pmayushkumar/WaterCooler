import { getDb } from './db';
import type { User, Colleague } from '@/types';

interface AuthResult {
  valid: true;
  user: User;
  colleague: Colleague;
}

interface AuthError {
  valid: false;
  error: string;
}

export function validateRequest(
  token: string,
  userId: string,
  colleagueId: string
): AuthResult | AuthError {
  const db = getDb();

  const user = db
    .prepare('SELECT * FROM users WHERE user_id = ?')
    .get(userId) as User | undefined;

  if (!user) {
    return { valid: false, error: 'User not found' };
  }

  if (user.secret_token !== token) {
    return { valid: false, error: 'Invalid token' };
  }

  const colleague = db
    .prepare('SELECT * FROM colleagues WHERE colleague_id = ?')
    .get(colleagueId) as Colleague | undefined;

  if (!colleague) {
    return { valid: false, error: 'Colleague not found' };
  }

  if (colleague.user_id !== userId) {
    return { valid: false, error: 'Unauthorized: colleague does not belong to this user' };
  }

  return { valid: true, user, colleague };
}