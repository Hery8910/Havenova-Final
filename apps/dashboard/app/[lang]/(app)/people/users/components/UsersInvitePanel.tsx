'use client';

import { FormEvent, useState } from 'react';
import type { AppLanguage, InviteTenantUserPayload } from '@/packages/types';
import type { UsersDetailPanelCopy, UsersInviteSubmitResult } from '../page.types';
import styles from './UsersPanel.module.css';

type UsersInvitePanelProps = {
  copy: UsersDetailPanelCopy['invite'];
  defaultLanguage: AppLanguage;
  isSubmitting: boolean;
  result: UsersInviteSubmitResult | null;
  onReturnToDirectory: () => void;
  onSubmit: (payload: InviteTenantUserPayload) => Promise<void>;
};

export function UsersInvitePanel({
  copy,
  defaultLanguage,
  isSubmitting,
  result,
  onReturnToDirectory,
  onSubmit,
}: UsersInvitePanelProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState<AppLanguage>(defaultLanguage);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      email: email.trim(),
      name: name.trim(),
      phone: phone.trim() || undefined,
      language,
    });
  };

  return (
    <section className={styles.root} aria-labelledby="users-invite-title">
      <header className={styles.hero}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id="users-invite-title" className={styles.title}>
          {copy.title}
        </h2>
        <p className={styles.description}>{copy.description}</p>
      </header>

      <form className={styles.section} onSubmit={handleSubmit}>
        <label className={styles.section}>
          <span className={styles.fieldLabel}>{copy.emailLabel}</span>
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className={styles.section}>
          <span className={styles.fieldLabel}>{copy.nameLabel}</span>
          <input
            className="input"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className={styles.section}>
          <span className={styles.fieldLabel}>{copy.phoneLabel}</span>
          <input
            className="input"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>

        <label className={styles.section}>
          <span className={styles.fieldLabel}>{copy.languageLabel}</span>
          <select
            className="input"
            value={language}
            onChange={(event) => setLanguage(event.target.value as AppLanguage)}
          >
            <option value="de">{copy.languageOptions.de}</option>
            <option value="en">{copy.languageOptions.en}</option>
            <option value="es">{copy.languageOptions.es}</option>
          </select>
        </label>

        {result ? (
          <p className={styles.description} aria-live="polite">
            {result.message}
          </p>
        ) : null}

        <div className={styles.actions}>
          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? copy.submittingLabel : copy.submitLabel}
          </button>
          <button
            type="button"
            className="button button--outline"
            disabled={isSubmitting}
            onClick={onReturnToDirectory}
          >
            {copy.returnActionLabel}
          </button>
        </div>
      </form>
    </section>
  );
}
