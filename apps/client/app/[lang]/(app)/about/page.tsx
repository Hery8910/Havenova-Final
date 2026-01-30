'use client';
import { useI18n } from '../../../../../../packages/contexts';
import { useLang } from '../../../../../../packages/hooks';
import styles from './page.module.css';

export default function About() {
  const lang = useLang();
  const { texts } = useI18n();

  return <main className={styles.main}></main>;
}
