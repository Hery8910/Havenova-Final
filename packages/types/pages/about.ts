export interface AboutHero {
  headline1: string;
  headline2: string;
  subtitle: string;
  image: {
    src: string;
    alt: string;
  };
}

export interface AboutStory {
  title: string;
  paragraphs: string[];
}

export interface AboutValue {
  label: string;
  description: string;
}

export interface AboutFinalCta {
  headline: string;
  subtext: string;
  button: {
    label: string;
    url: string;
  };
}

export interface AboutPageTexts {
  hero: AboutHero;
  story: AboutStory;
  finalCta: AboutFinalCta;
}
