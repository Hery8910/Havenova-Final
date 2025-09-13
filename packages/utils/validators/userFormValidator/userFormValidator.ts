// validators.ts

export const validateName = (name: string): string[] => {
  const errors: string[] = [];
  if (!name.trim()) errors.push('required');
  else if (!/^[A-Z][a-zA-Z- äöü' ]{1,49}$/.test(name.trim())) errors.push('invalid');
  return errors;
};

export const validateEmail = (email: string): string[] => {
  const errors: string[] = [];
  if (!email.trim()) errors.push('required');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('invalid');
  return errors;
};

export const validatePhone = (phone: string): string[] => {
  const errors: string[] = [];
  if (!phone.trim()) errors.push('required');
  else if (!/^(\+49|0)\d{8,12}$/.test(phone)) errors.push('invalid');
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

export const validateAddress = (address: string): string[] => {
  const errors: string[] = [];
  if (!address.trim()) errors.push('required');
  else if (!/^[a-zA-Z0-9\s,'-.#]{5,49}$/.test(address.trim())) errors.push('invalid');
  return errors;
};

export const validateServiceAddress = (serviceAddress: string): string[] => {
  const errors: string[] = [];
  if (!serviceAddress.trim()) errors.push('required');
  else if (!/^[a-zA-Z0-9\s,'-.#]{5,49}$/.test(serviceAddress.trim())) errors.push('invalid');
  return errors;
};
