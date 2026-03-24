import { PageHero, type PageHeroContent } from '../../hero';

export default function ContactHeroSection({
  texts,
  lang,
}: {
  texts: PageHeroContent;
  lang: 'de' | 'en';
}) {
  return <PageHero texts={texts} lang={lang} />;
}
