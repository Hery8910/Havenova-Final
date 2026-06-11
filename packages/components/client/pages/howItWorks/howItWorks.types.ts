import type { PageHeroContent } from '../hero';

export interface HowItWorksWorkflowStepTexts {
  title: string;
  description: string;
}

export interface HowItWorksWorkflowNoteTexts {
  title: string;
  description: string;
}

export interface HowItWorksWorkflowTexts {
  title: string;
  subtitle: string;
  steps: HowItWorksWorkflowStepTexts[];
  note: HowItWorksWorkflowNoteTexts;
}

export interface HowItWorksBenefitsTexts {
  title: string;
  description: string;
  ctaCleaning: { label: string; href: string };
  ctaHomeServices: { label: string; href: string };
  ctaAriaLabel: string;
}

export interface HowItWorksPageTexts {
  hero: PageHeroContent;
  workflow: HowItWorksWorkflowTexts;
  benefits: HowItWorksBenefitsTexts;
}
