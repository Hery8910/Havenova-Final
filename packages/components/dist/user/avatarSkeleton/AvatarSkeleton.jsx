// components/avatar/AvatarSkeleton.tsx
import React from 'react';
import styles from './AvatarSkeleton.module.css';
const AvatarSkeleton = () => (<section className={styles.section}>
    <div className={styles.button} aria-label="Avatar loading">
      <span style={{
        display: 'inline-block',
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #888 40%, #ddd 60%)',
        animation: 'pulse 1.5s infinite',
    }}/>
      <span style={{
        width: 80,
        height: 18,
        borderRadius: 8,
        background: 'linear-gradient(135deg, #aaa 40%, #eee 60%)',
        display: 'inline-block',
        animation: 'pulse 1.5s infinite',
    }}/>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 0.45; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  </section>);
export default AvatarSkeleton;
