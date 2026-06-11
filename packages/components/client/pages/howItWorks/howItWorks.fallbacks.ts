import type { PageHeroContent } from '../hero';
import type {
  HowItWorksBenefitsTexts,
  HowItWorksPageTexts,
  HowItWorksWorkflowStepTexts,
  HowItWorksWorkflowTexts,
} from './howItWorks.types';

const HOW_IT_WORKS_HERO_DESCRIPTIONS_FALLBACK = [
  'Havenova strukturiert Anfragen fuer Reinigung und Hausservice so, dass Kund:innen schnell anfragen koennen und der Ablauf fuer alle Seiten klar bleibt.',
];

const HOW_IT_WORKS_WORKFLOW_STEPS_FALLBACK: HowItWorksWorkflowStepTexts[] = [
  {
    title: 'Anfrage und Pruefung',
    description:
      'Du sendest deine Anfrage mit den wichtigsten Details. Wir pruefen die Angaben sorgfaeltig, um den Bedarf sauber zu verstehen und den naechsten Schritt vorzubereiten.',
  },
  {
    title: 'Besichtigung und Bestaetigung',
    description:
      'Wenn noetig, pruefen wir die Situation vor Ort. Danach wird der Umfang bestaetigt und du erhaeltst das finale Angebot.',
  },
  {
    title: 'Service und Abschluss',
    description:
      'Der Service wird wie vereinbart ausgefuehrt. Waehrend des Ablaufs bleibst du informiert und nach Abschluss folgt die Abrechnung.',
  },
];

export function resolveHowItWorksHeroContent(
  texts: HowItWorksPageTexts['hero'] | undefined
): PageHeroContent {
  return {
    title: texts?.title ?? 'So funktioniert Havenova fuer Kund:innen',
    descriptions: texts?.descriptions?.length
      ? texts.descriptions
      : HOW_IT_WORKS_HERO_DESCRIPTIONS_FALLBACK,
    image: {
      src: texts?.image?.src ?? '/images/how-it-works.png',
      alt: texts?.image?.alt ?? 'Havenova Ablauf fuer Hausservices in Berlin',
      priority: texts?.image?.priority ?? true,
    },
    a11y: {
      actionsLabel: texts?.a11y?.actionsLabel ?? 'Aktionen im Bereich So funktioniert Havenova',
    },
  };
}

export function resolveHowItWorksWorkflow(
  texts: HowItWorksWorkflowTexts | undefined
): HowItWorksWorkflowTexts {
  return {
    title: texts?.title ?? 'So funktioniert der Ablauf',
    subtitle:
      texts?.subtitle ??
      'Ein klarer Ablauf, der Anfragen strukturiert haelt, ohne unnoetig kompliziert zu werden.',
    steps: texts?.steps?.length ? texts.steps : HOW_IT_WORKS_WORKFLOW_STEPS_FALLBACK,
    note: {
      title: texts?.note?.title ?? 'Warum zeigen wir keine Festpreise auf der Website?',
      description:
        texts?.note?.description ??
        'Viele Hausservices haengen von Groesse, Zustand, Material, Zugang und Zeit ab. Deshalb wird zuerst sauber geklaert, was wirklich gebraucht wird.',
    },
  };
}

export function resolveHowItWorksBenefits(
  texts: HowItWorksBenefitsTexts | undefined
): HowItWorksBenefitsTexts {
  return {
    title: texts?.title ?? 'Vorteile fuer beide Seiten',
    description:
      texts?.description ??
      'Die Plattform schafft Klarheit ueber Anfrage, Abstimmung und Umsetzung. So bleibt nachvollziehbar, was angefragt wurde und wie es weitergeht.',
    ctaAriaLabel: texts?.ctaAriaLabel ?? 'Aktionen zur Serviceanfrage',
    ctaCleaning: {
      label: texts?.ctaCleaning?.label ?? 'Reinigung anfragen',
      href: texts?.ctaCleaning?.href ?? '/cleaning-service',
    },
    ctaHomeServices: {
      label: texts?.ctaHomeServices?.label ?? 'Hausservice anfragen',
      href: texts?.ctaHomeServices?.href ?? '/home-service',
    },
  };
}
