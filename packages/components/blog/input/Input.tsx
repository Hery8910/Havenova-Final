import React, { useRef, useEffect } from 'react';
import styles from './Input.module.css';

interface InputProps {
  heading: string;
  value: string;
  onChange: (value: string, idx?: number) => void;
  onBlur: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  height?: string;
}

export default function Input({
  heading,
  value,
  onChange,
  onBlur,
  placeholder = 'Blog Title',
  maxLength = 120,
  height,
}: InputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ajuste automático de altura cuando el usuario escribe
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = height ? height : 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
    onChange(e.currentTarget.value);
    onBlur(e.currentTarget.value);
  };

  // Ajuste automático de altura cuando el valor cambia desde fuera
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = height ? height : 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [value, height]);

  return (
    <textarea
      ref={textareaRef}
      className={`${styles.titleInput} ${styles[`${heading}`]}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      maxLength={maxLength}
      onInput={handleInput}
      style={height ? { height } : undefined}
    />
  );
}
