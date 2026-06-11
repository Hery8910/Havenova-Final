import { PageHero } from '../hero';
import { ServiceCrossCtaSection } from '../shared';
import AboutClientsSection from './ClientsSection/ClientsSection';
import AboutStorySection from './storySection/StorySection';
import {
  resolveAboutClients,
  resolveAboutHeroContent,
  resolveAboutServicesCta,
  resolveAboutStory,
} from './about.fallbacks';
import type { AboutPageTexts } from './about.types';
import styles from './AboutPageView.module.css';

interface AboutPageViewProps {
  about?: AboutPageTexts;
  lang: 'de' | 'en' | 'es';
}

export function AboutPageView({ about, lang }: AboutPageViewProps) {
  return (
    <>
      <PageHero texts={resolveAboutHeroContent(about?.hero)} lang={lang} />
      <main
        id="app-main-content"
        tabIndex={-1}
        className={`${styles.main} v2-about-page`}
        data-page="about"
      >
        <AboutStorySection texts={resolveAboutStory(about?.story)} />
        <AboutClientsSection texts={resolveAboutClients(about?.clients)} />
        <ServiceCrossCtaSection texts={resolveAboutServicesCta(about?.servicesCta)} lang={lang} />
      </main>
    </>
  );
}
