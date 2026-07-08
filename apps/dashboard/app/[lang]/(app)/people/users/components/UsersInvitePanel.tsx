import styles from './UsersPanel.module.css';

type UsersInvitePanelProps = {
  onReturnToDirectory: () => void;
};

export function UsersInvitePanel({ onReturnToDirectory }: UsersInvitePanelProps) {
  return (
    <section className={styles.root} aria-labelledby="tenant-users-invite-title">
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Invite</p>
        <h2 id="tenant-users-invite-title" className={styles.title}>
          Invite a tenant user
        </h2>
        <p className={styles.description}>
          This mode reserves the right panel for the invitation flow. The real form will live here
          in the next pass without changing the surrounding page structure.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="tenant-users-invite-structure">
        <div>
          <p className={styles.sectionLabel}>Structure</p>
          <h3 id="tenant-users-invite-structure" className={styles.sectionTitle}>
            Planned invite panel blocks
          </h3>
        </div>

        <div className={styles.grid}>
          <article className={styles.card}>
            <p className={styles.fieldLabel}>Primary form</p>
            <p className={styles.fieldValue}>email + name + language + phone</p>
            <p className={styles.fieldHint}>
              The payload must stay aligned with the invite endpoint and never be improvised from
              UI-only needs.
            </p>
          </article>
          <article className={styles.card}>
            <p className={styles.fieldLabel}>Success handling</p>
            <p className={styles.fieldValue}>Stay on the same surface</p>
            <p className={styles.fieldHint}>
              The user should not lose the left directory context after sending an invite.
            </p>
          </article>
        </div>
      </section>

      <div className={styles.actions}>
        <button type="button" className="button button--outline" onClick={onReturnToDirectory}>
          Return to directory
        </button>
      </div>
    </section>
  );
}
