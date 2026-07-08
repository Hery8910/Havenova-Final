import styles from './UsersPanel.module.css';

export function UsersEmptyPanel() {
  return (
    <section className={styles.root} aria-labelledby="tenant-users-empty-title">
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Panel</p>
        <h2 id="tenant-users-empty-title" className={styles.title}>
          Select a tenant user or start a new invite
        </h2>
        <p className={styles.description}>
          This panel stays stable while the directory changes on the left. Use it to review a
          selected user or open the invite flow without leaving the page.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="tenant-users-empty-next-step">
        <div>
          <p className={styles.sectionLabel}>Next step</p>
          <h3 id="tenant-users-empty-next-step" className={styles.sectionTitle}>
            Expected panel modes
          </h3>
        </div>

        <div className={styles.grid}>
          <article className={styles.card}>
            <p className={styles.fieldLabel}>Detail</p>
            <p className={styles.fieldValue}>Open a selected tenant user</p>
            <p className={styles.fieldHint}>
              The detail mode should show `auth + userClient + optional profile`.
            </p>
          </article>
          <article className={styles.card}>
            <p className={styles.fieldLabel}>Invite</p>
            <p className={styles.fieldValue}>Launch the onboarding flow</p>
            <p className={styles.fieldHint}>
              The invite mode should keep the directory context while rendering the form here.
            </p>
          </article>
        </div>
      </section>
    </section>
  );
}
