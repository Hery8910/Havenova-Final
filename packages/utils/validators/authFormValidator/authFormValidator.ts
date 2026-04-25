export const validateEmail = (email: string): string[] => {
  const errors: string[] = [];
  if (!email.trim()) errors.push('required');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('invalid');
  return errors;
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (!password.trim()) errors.push('required');
  if (password.length < 8) errors.push('tooShort');
  if (!/[A-Z]/.test(password)) errors.push('missingUppercase');
  if (!/\d/.test(password)) errors.push('missingNumber');
  if (!/[@$!%*?&]/.test(password)) errors.push('missingSymbol');
  return errors;
};

export const validateTosAccepted = (value: boolean) => {
  if (!value) return ['required'];

  return [];
};
