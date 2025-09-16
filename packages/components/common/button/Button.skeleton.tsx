'use client';
import React from 'react';
import styles from './Button.module.css';

const ButtonSkeleton = () => {
  return (
    <div className={`${styles.button} ${styles.skeleton}`}>
      <div className={styles.iconSkeleton}></div>
      <div className={styles.textSkeleton}></div>
    </div>
  );
};

export default ButtonSkeleton;
