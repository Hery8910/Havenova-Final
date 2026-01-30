'use client';

import { WorkflowSection } from '../../../../../../packages/components/client/pages/about/WorkflowSection';
import { BenefitsSplitSection } from '../../../../../../packages/components/client/pages/about/BenefitsSplitSection';
import { useI18n } from '../../../../../../packages/contexts';
import { useLang } from '../../../../../../packages/hooks';
import styles from './page.module.css';

export interface AboutPageTexts {
  hero: {
    kicker: string;
    title: string;
    description: string;
    cta: { label: string; href: string };
  };
  workflow: {
    title: string;
    subtitle: string;
    steps: { title: string; description: string }[];
    note: { title: string; description: string };
  };
  benefits: {
    title: string;
    subtitle: string;
    companies: { title: string; items: { title: string; description: string }[] };
    customers: { title: string; items: { title: string; description: string }[] };
  };
}

export default function About() {
  const lang = useLang();
  const { texts } = useI18n();

  return <main className={styles.main}></main>;
}
