import crypto from 'crypto';

export function generateUserId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `USR${timestamp}${random}`;
}

export function generateColleagueId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `COL${timestamp}${random}`;
}

export function generateSecretToken(): string {
  return crypto.randomBytes(16).toString('hex');
}