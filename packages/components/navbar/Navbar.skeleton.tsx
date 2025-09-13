import styles from './Navbar.module.css';

export function NavbarSkeleton() {
  return (
    <nav className={styles.nav} aria-label="Main navigation loading">
      <header className={styles.nav_header}>
        <div className={`${styles.logo} ${styles.skeleton}`} />
        <aside className={styles.nav_aside}>
          <div className={`${styles.skeleton} ${styles.circle}`} />
          <div className={`${styles.skeleton} ${styles.circle}`} />
        </aside>
      </header>
      <ul className={styles.nav_main}>
        {[1, 2, 3].map((i) => (
          <li key={i} className={styles.main_li}>
            <h4 className={`${styles.h4} ${styles.skeleton}`} />
            <ul className={styles.li_ul}>
              {[1, 2].map((j) => (
                <li key={j} className={`${styles.li} ${styles.skeleton}`} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
