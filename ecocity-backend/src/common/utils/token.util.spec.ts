import { generateOpaqueToken, hashToken } from './token.util';

describe('token.util', () => {
  describe('generateOpaqueToken', () => {
    it('returns a token and its hash, distinct from one another', () => {
      const { token, hash } = generateOpaqueToken();
      expect(token).toHaveLength(96); // 48 bytes -> hex
      expect(hash).toHaveLength(64); // sha256 -> hex
      expect(hash).not.toBe(token);
    });

    it('generates a fresh token on every call', () => {
      const first = generateOpaqueToken();
      const second = generateOpaqueToken();
      expect(first.token).not.toBe(second.token);
    });

    it('hashes the token consistently with hashToken()', () => {
      const { token, hash } = generateOpaqueToken();
      expect(hashToken(token)).toBe(hash);
    });
  });

  describe('hashToken', () => {
    it('is deterministic for the same input', () => {
      expect(hashToken('abc')).toBe(hashToken('abc'));
    });

    it('produces different hashes for different inputs', () => {
      expect(hashToken('abc')).not.toBe(hashToken('abd'));
    });
  });
});
