'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useCallback } from 'react';
import { IoIosClose } from 'react-icons/io';
import styles from './AlertPopup.module.css';

interface AlertPopupProps {
  type: 'success' | 'error';
  title: string;
  description: string;
  onClose?: () => void;
}

const AlertPopup: React.FC<AlertPopupProps> = ({ type, title, description, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ✅ Soporte para cerrar con Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    },
    [onClose]
  );

  // ✅ Montaje y limpieza del listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Opcional: enfocar el div para accesibilidad
    containerRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <section
      role="alert"
      aria-live="assertive"
      aria-labelledby="alert-title"
      aria-describedby="alert-description"
      tabIndex={-1}
      ref={containerRef}
      className={`${styles.section} card`}
      style={{
        backgroundImage:
          type === 'success'
            ? 'url(/svg/success-bg.svg)'
            : type === 'error'
            ? 'url(/svg/alert-bg.svg)'
            : undefined,
      }}
    >
      <div className={styles.wraper}>
        <main
          style={{
            backgroundColor:
              type === 'success'
                ? 'var(--bg-success)'
                : type === 'error'
                ? 'var(--bg-alert)'
                : undefined,
          }}
          className={styles.main}
        >
          <Image
            src={type === 'success' ? '/images/success.webp' : '/images/alert.webp'}
            priority
            alt={type === 'success' ? 'Success image' : 'Alert image'}
            width={300}
            height={200}
            className={styles.image}
          />

          <article
            className={styles.article}
            style={{
              color:
                type === 'success'
                  ? 'var(--color-success)'
                  : type === 'error'
                  ? 'var(--color-alert)'
                  : undefined,
            }}
          >
            <h4 id="alert-title">
              <strong>{title}</strong>
            </h4>
            <p id="alert-description">{description}</p>
          </article>
        </main>

        {onClose && (
          <button className={styles.button} onClick={onClose} aria-label="Close alert">
            <IoIosClose />
          </button>
        )}
      </div>
    </section>
  );
};

export default AlertPopup;
