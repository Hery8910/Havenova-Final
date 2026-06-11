import type { PageHeroContent } from '../hero';
import type { ServiceCrossCtaSectionTexts } from '../shared';
import type { AboutClientsItemTexts, AboutClientsTexts, AboutPageTexts, AboutStoryTexts } from './about.types';

const ABOUT_HERO_DESCRIPTIONS_FALLBACK = [
  'Erfahre, wie Havenova persoenlichen Service, klare Kommunikation und digitale Verbesserung zusammenbringt, um Hausservice in Berlin transparenter zu machen.',
];

const ABOUT_STORY_PARAGRAPHS_FALLBACK = [
  'Havenova wurde mit dem Ziel aufgebaut, Reinigung und Hausservice in Berlin klarer, verlaesslicher und besser organisiert anzubieten.',
  'Dabei verbindet das Unternehmen persoenliche Betreuung mit einer digitalen Plattform, die Anfragen, Kommunikation und Transparenz verbessern soll.',
  'Die Weiterentwicklung dieser Arbeitsweise bleibt Teil des laufenden Anspruchs: bessere Prozesse fuer Kund:innen und ein klarerer Ablauf fuer alle Beteiligten.',
];

const ABOUT_CLIENTS_ITEMS_FALLBACK: AboutClientsItemTexts[] = [
  {
    title: 'Privathaushalte',
    description:
      'Fuer Mieter:innen und Eigentuemer:innen, die Reinigung oder Hausservice verlaesslich anfragen und sauber dokumentieren moechten.',
    image: '/images/private-properties.png',
    imageAlt: 'Wohngebaeude im privaten Umfeld',
  },
  {
    title: 'Hausverwaltung',
    description:
      'Fuer Verwaltungen, die mehrere Objekte mit klaren Serviceanfragen, transparenter Kommunikation und guter Uebersicht betreuen.',
    image: '/images/property-management.png',
    imageAlt: 'Mehrparteienhaus mit gepflegter Fassade',
  },
  {
    title: 'Bueros und Praxen',
    description:
      'Fuer professionelle Umgebungen mit wiederkehrendem Bedarf an Reinigung oder Hausservice und moeglichst wenig Abstimmungsaufwand.',
    image: '/images/practices.png',
    imageAlt: 'Modernes Buero mit Besprechungsbereich',
  },
];

export function resolveAboutHeroContent(texts: AboutPageTexts['hero'] | undefined): PageHeroContent {
  return {
    title: texts?.title ?? 'Warum Hausservice einfacher wirken kann',
    descriptions: texts?.descriptions?.length ? texts.descriptions : ABOUT_HERO_DESCRIPTIONS_FALLBACK,
    image: {
      src: texts?.image?.src ?? '/images/about.png',
      alt: texts?.image?.alt ?? 'Havenova Hausservice-Fachkraft in Berlin',
      priority: texts?.image?.priority ?? true,
    },
    a11y: {
      actionsLabel: texts?.a11y?.actionsLabel ?? 'Aktionen im Bereich Ueber Havenova',
    },
  };
}

export function resolveAboutStory(texts: AboutStoryTexts | undefined): AboutStoryTexts {
  return {
    title: texts?.title ?? 'Ein junges Unternehmen mit klarer Vision',
    paragraphs: texts?.paragraphs?.length ? texts.paragraphs : ABOUT_STORY_PARAGRAPHS_FALLBACK,
  };
}

export function resolveAboutClients(texts: AboutClientsTexts | undefined): AboutClientsTexts {
  return {
    title: texts?.title ?? 'Fuer wen wir arbeiten',
    description:
      texts?.description ??
      'Wir unterstuetzen unterschiedliche Haushalte und Unternehmen mit einem Prozess, der auf Klarheit, Kommunikation und langfristigem Vertrauen basiert.',
    a11y: {
      sectionLabel: texts?.a11y?.sectionLabel ?? 'Kunden und Bereiche, mit denen Havenova arbeitet',
      listLabel: texts?.a11y?.listLabel ?? 'Kundenkategorien',
    },
    items: texts?.items?.length ? texts.items : ABOUT_CLIENTS_ITEMS_FALLBACK,
    closing:
      texts?.closing ?? 'Unser Fokus liegt auf Klarheit, Organisation und langfristiger Verlaesslichkeit.',
  };
}

export function resolveAboutServicesCta(
  texts: ServiceCrossCtaSectionTexts | undefined
): ServiceCrossCtaSectionTexts {
  return {
    eyebrow: texts?.eyebrow ?? 'Service anfragen',
    title: texts?.title ?? 'Waehle den Service, der heute zu deinem Bedarf passt',
    description:
      texts?.description ??
      'Wenn du bereits weisst, welche Unterstuetzung du brauchst, kannst du direkt das passende Formular oeffnen und deine Anfrage mit dem richtigen Kontext senden.',
    a11y: {
      sectionLabel:
        texts?.a11y?.sectionLabel ?? 'Direkte Zugaenge zu den Serviceformularen von Havenova',
      actionsLabel: texts?.a11y?.actionsLabel ?? 'Optionen fuer eine Serviceanfrage',
    },
    actions:
      texts?.actions?.length
        ? texts.actions
        : [
            {
              label: 'Zum Reinigungsservice',
              href: '/cleaning-service',
              ariaLabel: 'Die Seite fuer Reinigungsanfragen oeffnen',
              variant: 'primary',
            },
            {
              label: 'Zum Hausservice',
              href: '/home-service',
              ariaLabel: 'Die Seite fuer Hausservice-Anfragen oeffnen',
              variant: 'secondary',
            },
          ],
  };
}
