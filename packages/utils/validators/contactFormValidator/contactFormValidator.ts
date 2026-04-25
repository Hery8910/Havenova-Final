export const validateMessage = (message: string): string[] => {
  const errors: string[] = [];
  if (!message.trim()) {
    errors.push('required');
  } else if (message.trim().length < 10) {
    errors.push('tooShort');
  } else if (message.trim().length > 1000) {
    errors.push('tooLong');
  }
  return errors;
};
