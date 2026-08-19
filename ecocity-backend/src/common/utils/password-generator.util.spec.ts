import { generateTempPassword } from './password-generator.util';

describe('generateTempPassword', () => {
  it('generates a password of the requested length by default (12)', () => {
    expect(generateTempPassword()).toHaveLength(12);
  });

  it('respects a custom length', () => {
    expect(generateTempPassword(20)).toHaveLength(20);
  });

  it('never contains ambiguous characters (0, O, 1, l, I)', () => {
    for (let i = 0; i < 50; i++) {
      expect(generateTempPassword()).not.toMatch(/[0O1lI]/);
    }
  });

  it('always includes at least one special character', () => {
    for (let i = 0; i < 50; i++) {
      expect(generateTempPassword()).toMatch(/[!@#$%]/);
    }
  });

  it('generates different passwords across calls', () => {
    const a = generateTempPassword();
    const b = generateTempPassword();
    expect(a).not.toBe(b);
  });
});
