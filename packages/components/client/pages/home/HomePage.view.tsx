import { PageHero } from '../hero';
import { AppInstallSection } from './AppInstallSection';
import { BenefitsSection } from './BenefitsSection';
import { ServicesSection } from './ServicesSection';
import { resolveHomeHeroContent } from './home.fallbacks';
import type { HomePageTexts } from './home.types';
import styles from './HomePageView.module.css';

interface HomePageViewProps {
  home?: HomePageTexts;
  lang: 'de' | 'en' | 'es';
}

export function HomePageView({ home, lang }: HomePageViewProps) {
  return (
    <>
      <PageHero texts={resolveHomeHeroContent(home?.hero)} lang={lang} position={82} />
      <main
        id="app-main-content"
        tabIndex={-1}
        className={`${styles.main} v2-home-page`}
        data-page="home"
      >
        <AppInstallSection
          texts={home ? { appInstall: home.appInstall, appInstalled: home.appInstalled } : undefined}
          lang={lang}
        />
        <ServicesSection texts={home?.services} lang={lang} />
        <BenefitsSection texts={home?.benefits} />
      </main>
    </>
  );
}
