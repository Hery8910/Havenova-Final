import { PageHero } from '../hero';
import { BenefitsSplitSection } from './BenefitsSplitSection';
import { WorkflowSection } from './WorkflowSection';
import {
  resolveHowItWorksBenefits,
  resolveHowItWorksHeroContent,
  resolveHowItWorksWorkflow,
} from './howItWorks.fallbacks';
import type { HowItWorksPageTexts } from './howItWorks.types';

interface HowItWorksPageViewProps {
  howItWorks?: HowItWorksPageTexts;
  lang: 'de' | 'en' | 'es';
}

export function HowItWorksPageView({ howItWorks, lang }: HowItWorksPageViewProps) {
  return (
    <>
      <PageHero texts={resolveHowItWorksHeroContent(howItWorks?.hero)} lang={lang} position={5} />
      <main id="app-main-content" tabIndex={-1} className="page-flow" data-page="how-it-work">
        <WorkflowSection texts={resolveHowItWorksWorkflow(howItWorks?.workflow)} />
        <BenefitsSplitSection texts={resolveHowItWorksBenefits(howItWorks?.benefits)} lang={lang} />
      </main>
    </>
  );
}
