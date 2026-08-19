import * as bcrypt from 'bcryptjs';

export async function hashPassword(plain: string, saltRounds = 10): Promise<string> {
  return bcrypt.hash(plain, saltRounds);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
