import {
  validateEmail,
  validatePassword,
  validateTosAccepted,
} from '../../../packages/utils/validators/authFormValidator';
import {
  validateAddress,
  validateName,
  validatePhone,
  validateServiceAddress,
} from '../../../packages/utils/validators/profileFormValidator';
import { validateMessage } from '../../../packages/utils/validators/contactFormValidator';

describe('form validators', () => {
  describe('auth validators', () => {
    it('accepts valid auth fields', () => {
      expect(validateEmail('user@example.com')).toEqual([]);
      expect(validatePassword('Strong1!')).toEqual([]);
      expect(validateTosAccepted(true)).toEqual([]);
    });

    it('returns required/format errors for invalid auth fields', () => {
      expect(validateEmail('')).toContain('required');
      expect(validateEmail('invalid-email')).toContain('invalid');
      expect(validatePassword('short')).toContain('tooShort');
      expect(validateTosAccepted(false)).toContain('required');
    });
  });

  describe('profile validators', () => {
    it('accepts broader valid names and international phone formats', () => {
      expect(validateName("maría-josé o'neill")).toEqual([]);
      expect(validatePhone('+49 157 12345678')).toEqual([]);
      expect(validatePhone('0049 (157) 123-45678')).toEqual([]);
    });

    it('accepts longer unicode-friendly addresses and deduplicates serviceAddress', () => {
      const address = 'Straße de la Constitución 12B / Hinterhaus, 28013 Madrid';
      expect(validateAddress(address)).toEqual([]);
      expect(validateServiceAddress(address)).toEqual([]);
    });

    it('rejects empty or malformed profile fields', () => {
      expect(validateName('')).toContain('required');
      expect(validateName('@@@')).toContain('invalid');
      expect(validatePhone('abc')).toContain('invalid');
      expect(validateAddress('x')).toContain('invalid');
    });
  });

  describe('contact validators', () => {
    it('validates message length boundaries', () => {
      expect(validateMessage('')).toContain('required');
      expect(validateMessage('short')).toContain('tooShort');
      expect(validateMessage('This is a message long enough.')).toEqual([]);
      expect(validateMessage('a'.repeat(1001))).toContain('tooLong');
    });
  });
});
