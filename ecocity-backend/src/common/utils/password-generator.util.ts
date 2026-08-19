/**
 * Génère un mot de passe temporaire lisible (staff créé par un supérieur :
 * AGENT/TEAM_LEADER/ADMIN). L'utilisateur devra le changer à sa première
 * connexion (`mustChangePassword = true`).
 */
const AMBIGUOUS_CHARS = /[0O1lI]/g;
const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

export function generateTempPassword(length = 12): string {
  let password = '';
  for (let i = 0; i < length; i++) {
    password += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  // Garantit au moins un caractère spécial pour la robustesse (substitution, pas insertion,
  // pour préserver la longueur demandée).
  const special = '!@#$%';
  const insertAt = Math.floor(Math.random() * password.length);
  password =
    password.slice(0, insertAt) +
    special[Math.floor(Math.random() * special.length)] +
    password.slice(insertAt + 1);
  return password.replace(AMBIGUOUS_CHARS, 'x');
}
