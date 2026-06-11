import type { PageHeroContent } from '../hero';
import type { ServiceCrossCtaSectionTexts } from '../shared';

export interface AboutStoryTexts {
  title: string;
  paragraphs: string[];
}

export interface AboutClientsItemTexts {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface AboutClientsTexts {
  title: string;
  description: string;
  a11y?: {
    sectionLabel?: string;
    listLabel?: string;
  };
  items: AboutClientsItemTexts[];
  closing: string;
}

export interface AboutPageTexts {
  hero: PageHeroContent;
  story: AboutStoryTexts;
  clients: AboutClientsTexts;
  servicesCta: ServiceCrossCtaSectionTexts;
}
