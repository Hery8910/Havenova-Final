import React from 'react';

type Props = {
  htmlFor: string;
  label: string;
  children: React.ReactNode;
  helperText?: string;
  helperId?: string;
  errorText?: string;
  errorId?: string;
  fieldClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
  errorClassName?: string;
};

export default function RequestField({
  htmlFor,
  label,
  children,
  helperText,
  helperId,
  errorText,
  errorId,
  fieldClassName = '',
  labelClassName = '',
  helperClassName = '',
  errorClassName = '',
}: Props) {
  return (
    <label className={fieldClassName} htmlFor={htmlFor}>
      <span className={labelClassName}>{label}</span>
      {children}
      {helperText ? (
        <span id={helperId} className={helperClassName}>
          {helperText}
        </span>
      ) : null}
      {errorId || errorText ? (
        <span id={errorId} className={errorClassName} aria-live="polite">
          {errorText || ''}
        </span>
      ) : null}
    </label>
  );
}
