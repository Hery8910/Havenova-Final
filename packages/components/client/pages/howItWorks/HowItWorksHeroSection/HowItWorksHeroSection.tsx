import { PageHero, type PageHeroContent } from '../../hero';

export default function HowItWorksHeroSection({
  texts,
  lang,
}: {
  texts: PageHeroContent;
  lang: 'de' | 'en' | 'es';
}) {
  return <PageHero texts={texts} lang={lang} />;
}
