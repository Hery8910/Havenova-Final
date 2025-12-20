import { IoIosClose } from 'react-icons/io';
import styles from './CookieBanner.module.css';
import { Button } from '../client';
import { ButtonProps } from '../client/button/Button';

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
    <div className={`${styles.wrapper} card`}>
      <section
        className={`${styles.banner} card`}
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent banner"
        aria-modal="true"
      >
        <article className={styles.article}>
          <h4 className={styles.title}>{texts.title}</h4>
          <p className={styles.description}>{texts.description}</p>
          <aside className={styles.controls}>
            <Button
              cta={texts.acceptAll.cta}
              variant={texts.acceptAll.variant}
              icon={texts.acceptAll.icon}
              onClick={onAccept}
            />
            <Button
              cta={texts.rejectAll.cta}
              variant={texts.rejectAll.variant}
              icon={texts.rejectAll.icon}
              onClick={onReject}
            />
          </aside>
        </article>
        <Button
          cta={texts.close.cta}
          variant={texts.close.variant}
          icon={texts.close.icon}
          onClick={onClose}
        />
      </section>
    </div>
  );
}
