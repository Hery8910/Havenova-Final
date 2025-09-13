'use client';

import React, { useState } from 'react';
import { useCookies } from '../../contexts/cookies/CookiesContext';
import { useI18n } from '../../contexts/i18n/I18nContext';
import styles from './CookieBanner.module.css';
import { IoIosClose } from 'react-icons/io';

interface CookieBannerProps {
  title: string;
  description: string;
  acceptAll: string;
  rejectAll: string;
  save: string;
  close: string;
  enableStats: string;
}

const CookieBanner: React.FC = () => {
  const { prefs, showBanner, acceptAll, rejectAll, saveSelection, closeBanner } = useCookies();

  const { texts } = useI18n();

  const [stats, setStats] = useState(prefs.consent.statistics);

  const cookie: CookieBannerProps = texts.components.cookieBanner;

  if (!prefs) return null;
  if (!showBanner) return null;

  return (
    <main className={`${styles.wrapper} card`}>
      <section
        className={`${styles.banner} card`}
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent"
      >
        <article className={styles.article}>
          <h3 className={styles.title}>{cookie.title}</h3>
          <p className={styles.description}>{cookie.description}</p>
          <aside className={styles.controls}>
            <div className={styles.switch_div}>
              <label className={styles.label}>{cookie.enableStats}</label>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={stats}
                  onChange={(e) => setStats(e.target.checked)}
                  aria-label={cookie.enableStats}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.div}>
              <button
                className="button_invert"
                onClick={() => saveSelection({ statistics: stats })}
              >
                {cookie.save}
              </button>
              <button className="button_invert" onClick={rejectAll}>
                {cookie.rejectAll}
              </button>
              <button className="button" onClick={acceptAll}>
                {cookie.acceptAll}
              </button>
            </div>
          </aside>
        </article>
        <button className="button_close" onClick={closeBanner} aria-label={cookie.close}>
          <IoIosClose />
        </button>
      </section>
    </main>
  );
};

export default CookieBanner;
