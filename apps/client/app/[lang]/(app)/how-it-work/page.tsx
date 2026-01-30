'use client';

import { HowItWorksHeroSection } from '../../../../../../packages/components/client/pages/howItWorks/HowItWorksHeroSection';
import { WorkflowSection } from '../../../../../../packages/components/client/pages/howItWorks/WorkflowSection';
import { BenefitsSplitSection } from '../../../../../../packages/components/client/pages/howItWorks/BenefitsSplitSection';
import { useI18n } from '../../../../../../packages/contexts';
import { useLang } from '../../../../../../packages/hooks';
import styles from './page.module.css';

export interface HowItWorksPageTexts {
  hero: {
    kicker: string;
    title: string;
    description: string;
    cta: { label: string; href: string };
    ctaAriaLabel: string;
    image: {
      src: string;
      alt: string;
      badgeTitle: string;
    };
  };
  workflow: {
    title: string;
    subtitle: string;
    steps: { title: string; description: string }[];
    note: { title: string; description: string };
  };
  benefits: {
    title: string;
    description: string;
    ctaCleaning: { label: string; href: string };
    ctaHomeServices: { label: string; href: string };
    ctaAriaLabel: string;
  };
}

export default function HowItWorks() {
  const lang = useLang();
  const { texts } = useI18n();
  const howItWorks: HowItWorksPageTexts = texts?.pages?.client?.howItWorks;

  if (!howItWorks) return null;

  return (
    <main className={styles.main}>
      <HowItWorksHeroSection texts={howItWorks.hero} lang={lang} />
      <WorkflowSection texts={howItWorks.workflow} />
      <BenefitsSplitSection texts={howItWorks.benefits} lang={lang} />
    </main>
  );
}
