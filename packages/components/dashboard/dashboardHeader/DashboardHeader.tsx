import LanguageSwitcher from '../../languageSwitcher/LanguageSwitcher';
import ThemeToggler from '../../themeToggler/ThemeToggler';
import { AvatarContainer } from '../../user/avatar/AvatarContainer';
import styles from './DashboardHeader.module.css';

export default function DashboardHeader() {
  return (
    <ul className={styles.ul}>
      <li className={styles.li}>
        <ThemeToggler />
      </li>
      <li className={styles.li}>
        <LanguageSwitcher />
      </li>
      <li className={styles.li}>
        <AvatarContainer />
      </li>
    </ul>
  );
}
