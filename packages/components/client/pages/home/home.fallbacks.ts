import type { PageHeroContent } from '../hero';
import type {
  HomeBenefitsSectionItemTexts,
  HomeBenefitsSectionTexts,
  HomePageTexts,
  HomeServicesSectionItemTexts,
  HomeServicesSectionTexts,
} from './home.types';

type HomeLocale = 'de' | 'en' | 'es';

const HOME_HERO_DESCRIPTION_FALLBACK =
  'Wähle deinen Service, sende deine Anfrage in wenigen Minuten und erhalte ein passendes Angebot. Klar, zuverlässig und einfach ab dem ersten Schritt.';

export const HOME_SERVICES_ITEMS_FALLBACK: HomeServicesSectionItemTexts[] = [
  {
    title: 'Reinigung',
    description:
      'Professionelle Reinigung für Wohnungen, Gemeinschaftsflächen und wiederkehrende Einsätze, mit klarer Abstimmung und einem Ablauf, der sich am Zustand und Bedarf jedes Objekts orientiert.',
    highlights: [
      'Fensterreinigung',
      'Grundreinigung',
      'Reinigung nach Reparaturen',
      'Treppenhausreinigung',
      'Einzugs- und Auszugsreinigung',
    ],
    ctaLabel: 'Mehr entdecken',
    href: '/cleaning-service',
    icon: '/svg/cleaning.svg',
  },
  {
    title: 'Hausservice',
    description:
      'Flexibler Hausservice für praktische Aufgaben, kleine Reparaturen und laufende Unterstützung im Alltag, mit einer einfachen Anfrage und besserer Vorbereitung vor jedem Einsatz.',
    highlights: [
      'Möbelmontage',
      'Küchenmontage',
      'Kleine Reparaturen',
      'Austausch von Armaturen',
      'Allgemeine Hilfe im Haushalt',
    ],
    ctaLabel: 'Mehr entdecken',
    href: '/home-service',
    icon: '/svg/service.svg',
  },
];

export const HOME_BENEFITS_ITEMS_FALLBACK: HomeBenefitsSectionItemTexts[] = [
  {
    title: 'Klare Anfragen',
    description: 'Formulare sammeln genau die Infos, die gebraucht werden – ohne Stress.',
  },
  {
    title: 'Schnellere Angebote',
    description: 'Weniger Rückfragen, schnelleres Matching und bessere Reaktionszeiten.',
  },
  {
    title: 'Bessere Planung',
    description: 'Services lassen sich sauber priorisieren und koordinieren.',
  },
  {
    title: 'Transparenz',
    description: 'Status & Kommunikation zentral – für beide Seiten nachvollziehbar.',
  },
];

const HOME_SERVICES_SECTION_FALLBACKS: Record<
  HomeLocale,
  Pick<HomeServicesSectionTexts, 'title' | 'subtitle'>
> = {
  de: {
    title: 'Wie können wir Ihnen helfen?',
    subtitle:
      'Zwei klare Wege fuer unterschiedliche Anliegen: Wählen Sie den passenden Service, teilen Sie uns die wichtigsten Details mit und senden Sie Ihre Anfrage in nur wenigen Minuten. So kann unser Team Ihren Bedarf schneller einordnen, Rückfragen reduzieren und den passenden nächsten Schritt gezielt vorbereiten.',
  },
  en: {
    title: 'How can we help you?',
    subtitle:
      'Two clear paths for different needs: choose the service that fits your situation, share the most important details, and send your request in just a few minutes. This helps our team understand what you need faster, reduce back-and-forth, and prepare the right next step more clearly.',
  },
  es: {
    title: 'Cuentanos como podemos ayudarte',
    subtitle:
      'Dos caminos claros para distintas necesidades: elige el servicio que mejor encaje con tu situacion, cuentanos los detalles mas importantes y envia tu solicitud en solo unos minutos. Asi nuestro equipo puede entender mejor lo que necesitas, reducir vueltas innecesarias y preparar con mas rapidez el siguiente paso adecuado.',
  },
};

export function resolveHomeHeroContent(texts: HomePageTexts['hero'] | undefined): PageHeroContent {
  return {
    title: texts?.title ?? 'Finde schnell die richtige Hilfe',
    descriptions: texts?.descriptions?.[0] ?? HOME_HERO_DESCRIPTION_FALLBACK,
    ctas: {
      primary: {
        label: texts?.ctas?.primary?.label ?? 'Reinigung anfragen',
        href: texts?.ctas?.primary?.href ?? '/cleaning-service',
        ariaLabel: texts?.ctas?.primary?.ariaLabel ?? 'Formular für Reinigungsservice öffnen',
        variant: texts?.ctas?.primary?.variant ?? 'primary',
      },
      secondary: {
        label: texts?.ctas?.secondary?.label ?? 'Hausservice anfragen',
        href: texts?.ctas?.secondary?.href ?? '/home-service',
        ariaLabel: texts?.ctas?.secondary?.ariaLabel ?? 'Formular für Hausservice öffnen',
        variant: texts?.ctas?.secondary?.variant ?? 'secondary',
      },
    },
    image: {
      src: texts?.image?.src ?? '/images/home.png',
      alt: texts?.image?.alt ?? 'Havenova Hausservice-Fachkraft in Berlin',
      priority: texts?.image?.priority ?? true,
    },
    a11y: {
      actionsLabel: texts?.a11y?.actionsLabel ?? 'Primäre Aktionen auf der Startseite',
    },
  };
}

export function resolveHomeServicesItems(
  texts: HomeServicesSectionTexts | undefined
): HomeServicesSectionItemTexts[] {
  return texts?.items?.length ? texts.items : HOME_SERVICES_ITEMS_FALLBACK;
}

export function resolveHomeServicesContent(
  texts: HomeServicesSectionTexts | undefined,
  locale: HomeLocale
): HomeServicesSectionTexts {
  const fallback = HOME_SERVICES_SECTION_FALLBACKS[locale];

  return {
    title: texts?.title ?? fallback.title,
    subtitle: texts?.subtitle ?? fallback.subtitle,
    items: resolveHomeServicesItems(texts),
  };
}

export function resolveHomeBenefitsItems(
  texts: HomeBenefitsSectionTexts | undefined
): HomeBenefitsSectionItemTexts[] {
  return texts?.items?.length ? texts.items : HOME_BENEFITS_ITEMS_FALLBACK;
}
