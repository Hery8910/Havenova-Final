import { PageHero } from '../hero';
import { BenefitsSplitSection } from './BenefitsSplitSection';
import { WorkflowSection } from './WorkflowSection';
import {
  resolveHowItWorksBenefits,
  resolveHowItWorksHeroContent,
  resolveHowItWorksWorkflow,
} from './howItWorks.fallbacks';
import type { HowItWorksPageTexts } from './howItWorks.types';
import styles from './HowItWorksPageView.module.css';

interface HowItWorksPageViewProps {
  howItWorks?: HowItWorksPageTexts;
  lang: 'de' | 'en' | 'es';
}

export function HowItWorksPageView({ howItWorks, lang }: HowItWorksPageViewProps) {
  return (
    <>
      <PageHero texts={resolveHowItWorksHeroContent(howItWorks?.hero)} lang={lang} />
      <main
        id="app-main-content"
        tabIndex={-1}
        className={`${styles.main} v2-how-it-work`}
        data-page="how-it-work"
      >
        <WorkflowSection texts={resolveHowItWorksWorkflow(howItWorks?.workflow)} />
        <BenefitsSplitSection texts={resolveHowItWorksBenefits(howItWorks?.benefits)} lang={lang} />
      </main>
    </>
  );
}
