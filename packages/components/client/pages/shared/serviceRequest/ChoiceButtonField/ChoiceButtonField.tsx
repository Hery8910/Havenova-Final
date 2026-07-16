import React, { useId } from 'react';
import styles from './ChoiceButtonField.module.css';

type ChoiceButtonOption<T extends string> = {
  value: T;
  label: React.ReactNode;
};

type ChoiceButtonOptionState<T extends string> = {
  option: ChoiceButtonOption<T>;
  isActive: boolean;
};

type Props<T extends string> = {
  legend: string;
  options: readonly ChoiceButtonOption<T>[];
  value: T | '';
  error?: string;
  onChange: (value: T) => void;
  fieldClassName?: string;
  legendClassName?: string;
  listClassName?: string;
  itemClassName?: string | ((state: ChoiceButtonOptionState<T>) => string);
  buttonClassName?: string | ((state: ChoiceButtonOptionState<T>) => string);
  labelClassName?: string;
  errorClassName?: string;
};

export default function ChoiceButtonField<T extends string>({
  legend,
  options,
  value,
  error,
  onChange,
  fieldClassName = '',
  legendClassName = '',
  listClassName = '',
  itemClassName = '',
  buttonClassName = '',
  labelClassName = '',
  errorClassName = '',
}: Props<T>) {
  const errorId = useId();

  return (
    <fieldset className={`${styles.group} ${fieldClassName}`.trim()}>
      <legend className={`${styles.legend} ${legendClassName}`.trim()}>{legend}</legend>
      <ul className={`${styles.list} ${listClassName}`.trim()}>
        {options.map((option) => {
          const isActive = value === option.value;
          const state = { option, isActive };
          const resolvedItemClassName =
            typeof itemClassName === 'function' ? itemClassName(state) : itemClassName;
          const resolvedButtonClassName =
            typeof buttonClassName === 'function' ? buttonClassName(state) : buttonClassName;

          return (
            <li key={option.value} className={`${styles.item} ${resolvedItemClassName}`.trim()}>
              <button
                type="button"
                className={`${styles.button} button button--outline ${resolvedButtonClassName} ${
                  isActive ? styles.active : ''
                } ${error ? styles.fieldControlError : ''}`.trim()}
                aria-pressed={isActive}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                onClick={() => onChange(option.value)}
              >
                <span className={labelClassName}>{option.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <span
        className={`${styles.error} ${errorClassName}`.trim()}
        id={error ? errorId : undefined}
        aria-live="polite"
      >
        {error || ''}
      </span>
    </fieldset>
  );
}
