'use client';

import { useRouter } from 'next/navigation';
import { deleteUserClientProfile } from '@havenova/services/profile';
import { useAuth, useGlobalAlert, useI18n } from '../../../../../../contexts';
import { createLoggedOutAuthSeed } from '../../../../../../utils';
import styles from './DeleteAccountSection.module.css';

export function DeleteAccountSectionClient() {
  const router = useRouter();
  const { auth, setAuth } = useAuth();
  const { texts, language } = useI18n();
  const { showConfirm, showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();

  const title = 'Delete account';
  const description =
    'This action permanently removes your client profile data, saved addresses and preferences from this workspace.';
  const warning =
    'Once deleted, this information cannot be recovered. You will be signed out immediately after the operation.';
  const confirmLabel = 'Delete account';
  const cancelLabel = texts.popups?.button?.close ?? 'Cancel';
  const loadingTitle = 'Deleting account';
  const loadingDescription = 'We are removing your profile data. Please wait a moment.';
  const successTitle = 'Account deleted';
  const successDescription = 'Your profile data was removed successfully. You will be redirected.';
  const errorTitle = 'Unable to delete account';
  const errorDescription =
    'The account could not be deleted right now. Please try again in a moment.';

  const handleDelete = () => {
    showConfirm({
      response: {
        status: 200,
        title,
        description: warning,
        confirmLabel,
        cancelLabel,
      },
      onConfirm: async () => {
        closeAlert();

        try {
          showLoading({
            response: {
              status: 102,
              title: loadingTitle,
              description: loadingDescription,
            },
          });

          await deleteUserClientProfile();

          setAuth(
            createLoggedOutAuthSeed({
              clientId: auth.clientId,
            })
          );

          showSuccess({
            response: {
              status: 200,
              title: successTitle,
              description: successDescription,
              cancelLabel,
            },
            onCancel: () => {
              closeAlert();
              router.push(`/${language}`);
            },
          });
        } catch {
          showError({
            response: {
              status: 500,
              title: errorTitle,
              description: errorDescription,
              cancelLabel,
            },
            onCancel: closeAlert,
          });
        }
      },
      onCancel: closeAlert,
    });
  };

  return (
    <section className={styles.card} aria-labelledby="delete-account-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Danger zone</p>
        <h3 id="delete-account-title" className={styles.title}>
          {title}
        </h3>
        <p className={styles.description}>{description}</p>
      </div>
      <button
        type="button"
        className="button button--outline-danger"
        onClick={handleDelete}
        aria-label={confirmLabel}
      >
        {confirmLabel}
      </button>
    </section>
  );
}
