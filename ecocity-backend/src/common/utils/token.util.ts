import { createHash, randomBytes } from 'crypto';

/** Génère un token opaque (envoyé au client) et son empreinte SHA-256 (stockée en base). */
export function generateOpaqueToken(): { token: string; hash: string } {
  const token = randomBytes(48).toString('hex');
  return { token, hash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
