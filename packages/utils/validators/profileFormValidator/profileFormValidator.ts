export const validateName = (name: string): string[] => {
  const errors: string[] = [];
  if (!name.trim()) errors.push('required');
  else if (!/^[\p{L}][\p{L}\p{M}' -]{1,79}$/u.test(name.trim())) errors.push('invalid');
  return errors;
};

export const validatePhone = (phone: string): string[] => {
  const errors: string[] = [];
  const normalizedPhone = phone.trim().replace(/[\s()./-]/g, '');

  if (!normalizedPhone) errors.push('required');
  else if (!/^(?:\+|00)?\d{7,15}$/.test(normalizedPhone)) errors.push('invalid');
  return errors;
};

export const validateAddress = (address: string): string[] => {
  const errors: string[] = [];
  const normalizedAddress = address.trim();

  if (!normalizedAddress) errors.push('required');
  else if (!/^[\p{L}\p{M}\d\s,'./#-]{5,120}$/u.test(normalizedAddress)) errors.push('invalid');
  return errors;
};

export const validateServiceAddress = (serviceAddress: string): string[] =>
  validateAddress(serviceAddress);
