import { comparePassword, hashPassword } from './hash.util';

describe('hash.util', () => {
  describe('hashPassword', () => {
    it('produces a bcrypt hash different from the plain input', async () => {
      const hash = await hashPassword('S3cret!', 4);
      expect(hash).not.toBe('S3cret!');
      expect(hash).toMatch(/^\$2[aby]\$/);
    });

    it('produces a different hash each time (random salt)', async () => {
      const [a, b] = await Promise.all([hashPassword('S3cret!', 4), hashPassword('S3cret!', 4)]);
      expect(a).not.toBe(b);
    });
  });

  describe('comparePassword', () => {
    it('returns true for the matching plain text', async () => {
      const hash = await hashPassword('S3cret!', 4);
      await expect(comparePassword('S3cret!', hash)).resolves.toBe(true);
    });

    it('returns false for a non-matching plain text', async () => {
      const hash = await hashPassword('S3cret!', 4);
      await expect(comparePassword('wrong-password', hash)).resolves.toBe(false);
    });
  });
});
