import { IoIosClose } from 'react-icons/io';
import styles from './CookieBanner.module.css';
import { Button } from '../common';
import { ButtonProps } from '../common/button/Button';


export interface CookieBannerTexts {
  title: string;
  description: string;
  acceptAll: ButtonProps;
  rejectAll: ButtonProps;
  save: ButtonProps;
  close: ButtonProps;
  enableStats: string;
}

export interface CookieBannerViewProps {
  texts: CookieBannerTexts;
  stats: boolean;
  onToggleStats: (checked: boolean) => void;
  onSave: () => void;
  onReject: () => void;
  onAccept: () => void;
  onClose: () => void;
}

export function CookieBannerView({
  texts,
  stats,
  onToggleStats,
  onSave,
  onReject,
  onAccept,
  onClose,
}: CookieBannerViewProps) {
  return (
    <section className={`${styles.wrapper} card`}>
      <section
        className={`${styles.banner} card`}
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent banner"
        aria-modal="true"
      >
        <article className={styles.article}>
          <h3 className={styles.title}>{texts.title}</h3>
          <p className={styles.description}>{texts.description}</p>

          <aside className={styles.controls}>
            <div className={styles.switch_div}>
              <label className={styles.label} htmlFor="cookie-stats">
                {texts.enableStats}
              </label>
              <label className={styles.switch}>
                <input
                  id="cookie-stats"
                  type="checkbox"
                  checked={stats}
                  onChange={(e) => onToggleStats(e.target.checked)}
                  aria-label={texts.enableStats}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.div}>
              <Button
                cta={texts.rejectAll.cta}
                variant={texts.rejectAll.variant}
                icon={texts.rejectAll.icon}
                onClick={onReject}
              />

              <Button
                cta={texts.save.cta}
                variant={texts.save.variant}
                icon={texts.save.icon}
                onClick={onSave}
              />

              <Button
                cta={texts.acceptAll.cta}
                variant={texts.acceptAll.variant}
                icon={texts.acceptAll.icon}
                onClick={onAccept}
              />
            </div>
          </aside>
        </article>
        <Button
          cta={texts.close.cta}
          variant={texts.close.variant}
          icon={texts.close.icon}
          onClick={onClose}
        />
      </section>
    </section>
  );
}
