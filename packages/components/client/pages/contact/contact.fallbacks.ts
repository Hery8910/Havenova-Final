import type { FAQSectionTexts } from '../../faqSection/FAQSection';
import type { PageHeroContent } from '../hero';
import type {
  ContactInfoAriaTexts,
  ContactInfoTexts,
  ContactPageTexts,
  ContactQuickActionTexts,
} from './contact.types';

type ContactLocale = 'de' | 'en' | 'es';

const CONTACT_HERO_FALLBACKS: Record<
  ContactLocale,
  {
    title: string;
    descriptions: string;
    primaryLabel: string;
    primaryAria: string;
    secondaryLabel: string;
    secondaryAria: string;
    imageAlt: string;
    actionsLabel: string;
  }
> = {
  de: {
    title: 'Fragen, Ideen, lassen Sie es uns wissen',
    descriptions:
      'Diese Seite ist fuer allgemeine Fragen, Unternehmensanliegen und den direkten Austausch gedacht. Fuer konkrete Serviceanfragen nutzen Sie bitte unsere spezialisierten Formulare.',
    primaryLabel: 'Reinigung anfragen',
    primaryAria: 'Formular fuer Reinigungsservice oeffnen',
    secondaryLabel: 'Hausservice anfragen',
    secondaryAria: 'Formular fuer Hausservice oeffnen',
    imageAlt: 'Havenova Kontaktbereich fuer Fragen und Support',
    actionsLabel: 'Aktionen im Kontakt-Hero',
  },
  en: {
    title: 'Questions, ideas, let us know',
    descriptions:
      'This page is intended for general questions, company matters, and direct contact. For specific service requests, please use our dedicated forms.',
    primaryLabel: 'Request cleaning',
    primaryAria: 'Open the cleaning service form',
    secondaryLabel: 'Request home service',
    secondaryAria: 'Open the home service form',
    imageAlt: 'Havenova contact area for questions and support',
    actionsLabel: 'Contact hero actions',
  },
  es: {
    title: 'Preguntas, ideas, cuentanos',
    descriptions:
      'Esta pagina esta pensada para preguntas generales, asuntos de la empresa y contacto directo. Para solicitudes concretas de servicio, usa nuestros formularios especializados.',
    primaryLabel: 'Solicitar limpieza',
    primaryAria: 'Abrir el formulario de servicio de limpieza',
    secondaryLabel: 'Solicitar servicio del hogar',
    secondaryAria: 'Abrir el formulario de servicio del hogar',
    imageAlt: 'Area de contacto de Havenova para preguntas y soporte',
    actionsLabel: 'Acciones del hero de contacto',
  },
};

const CONTACT_INFO_FALLBACKS: Record<
  ContactLocale,
  {
    aria: ContactInfoAriaTexts;
    quickActions: ContactQuickActionTexts;
  }
> = {
  de: {
    aria: {
      info: 'Kontaktinformationen',
      quickActions: 'Schnelle Kontaktaktionen',
      call: 'Telefonnummer anrufen',
      email: 'E-Mail senden',
      address: 'Adresse in Google Maps oeffnen',
      whatsapp: 'WhatsApp-Chat oeffnen',
    },
    quickActions: {
      call: 'Anrufen',
      email: 'E-Mail',
      whatsapp: 'WhatsApp',
    },
  },
  en: {
    aria: {
      info: 'Contact information',
      quickActions: 'Quick contact actions',
      call: 'Call phone number',
      email: 'Send email',
      address: 'Open address in Google Maps',
      whatsapp: 'Open WhatsApp chat',
    },
    quickActions: {
      call: 'Call',
      email: 'Email',
      whatsapp: 'WhatsApp',
    },
  },
  es: {
    aria: {
      info: 'Informacion de contacto',
      quickActions: 'Acciones rapidas de contacto',
      call: 'Llamar por telefono',
      email: 'Enviar correo electronico',
      address: 'Abrir la direccion en Google Maps',
      whatsapp: 'Abrir chat de WhatsApp',
    },
    quickActions: {
      call: 'Llamar',
      email: 'Correo',
      whatsapp: 'WhatsApp',
    },
  },
};

const CONTACT_FAQ_FALLBACKS: Record<
  ContactLocale,
  {
    title: string;
    sectionLabel: string;
    openItem: string;
    closeItem: string;
    items: FAQSectionTexts['items'];
  }
> = {
  de: {
    title: 'Haeufig gestellte Fragen',
    sectionLabel: 'Haeufig gestellte Fragen',
    openItem: 'Antwort oeffnen',
    closeItem: 'Antwort schliessen',
    items: [
      {
        question: 'Welche Dienstleistungen bietet Havenova an?',
        answer:
          'Havenova bietet Reinigungs- und Hausservices in Berlin an, darunter wiederkehrende Reinigung, kleine Reparaturen und praktische Unterstuetzung rund um Wohnungen und Gebaeude.',
      },
      {
        question: 'Wie schnell kann ich einen Service anfragen?',
        answer:
          'In der Regel koennen Anfragen kurzfristig geprueft werden. Nach dem Absenden prueft unser Team die Angaben und meldet sich mit den naechsten Schritten oder einem passenden Termin.',
      },
      {
        question: 'Arbeiten Sie mit qualifizierten Fachkraeften?',
        answer:
          'Ja. Havenova arbeitet mit sorgfaeltig ausgewaehlten und passenden Fachkraeften bzw. Partnern, damit der jeweilige Einsatz verlaesslich und fachgerecht umgesetzt wird.',
      },
    ],
  },
  en: {
    title: 'Frequently asked questions',
    sectionLabel: 'Frequently asked questions',
    openItem: 'Open answer',
    closeItem: 'Close answer',
    items: [
      {
        question: 'What services does Havenova offer?',
        answer:
          'Havenova offers cleaning and home services in Berlin, including recurring cleaning, small repairs, and practical support for homes and buildings.',
      },
      {
        question: 'How quickly can I request a service?',
        answer:
          'Requests can usually be reviewed quickly. After submission, our team checks the details and replies with the next steps or a suitable appointment.',
      },
      {
        question: 'Do you work with qualified professionals?',
        answer:
          'Yes. Havenova works with carefully selected professionals and partners to ensure each service is delivered reliably and appropriately.',
      },
    ],
  },
  es: {
    title: 'Preguntas frecuentes',
    sectionLabel: 'Preguntas frecuentes',
    openItem: 'Abrir respuesta',
    closeItem: 'Cerrar respuesta',
    items: [
      {
        question: 'Que servicios ofrece Havenova?',
        answer:
          'Havenova ofrece servicios de limpieza y del hogar en Berlin, incluyendo limpieza recurrente, pequenas reparaciones y apoyo practico para viviendas y edificios.',
      },
      {
        question: 'Con que rapidez puedo solicitar un servicio?',
        answer:
          'Normalmente las solicitudes pueden revisarse con rapidez. Despues del envio, nuestro equipo revisa los datos y responde con los siguientes pasos o una cita adecuada.',
      },
      {
        question: 'Trabajan con profesionales cualificados?',
        answer:
          'Si. Havenova trabaja con profesionales y socios cuidadosamente seleccionados para que cada servicio se realice de forma fiable y adecuada.',
      },
    ],
  },
};

export function resolveContactHeroContent(
  texts: ContactPageTexts['hero'] | undefined,
  locale: ContactLocale
): PageHeroContent {
  const fallback = CONTACT_HERO_FALLBACKS[locale];

  return {
    title: texts?.title ?? fallback.title,
    descriptions:
      Array.isArray(texts?.descriptions) && texts.descriptions.length > 0
        ? texts.descriptions
        : texts?.descriptions ?? fallback.descriptions,
    ctas: {
      primary: {
        label: texts?.ctas?.primary?.label ?? fallback.primaryLabel,
        href: texts?.ctas?.primary?.href ?? '/cleaning-service',
        ariaLabel: texts?.ctas?.primary?.ariaLabel ?? fallback.primaryAria,
        variant: texts?.ctas?.primary?.variant ?? 'primary',
      },
      secondary: {
        label: texts?.ctas?.secondary?.label ?? fallback.secondaryLabel,
        href: texts?.ctas?.secondary?.href ?? '/home-service',
        ariaLabel: texts?.ctas?.secondary?.ariaLabel ?? fallback.secondaryAria,
        variant: texts?.ctas?.secondary?.variant ?? 'secondary',
      },
    },
    image: {
      src: texts?.image?.src ?? '/images/contact.png',
      alt: texts?.image?.alt ?? fallback.imageAlt,
      priority: texts?.image?.priority ?? true,
    },
    a11y: {
      actionsLabel: texts?.a11y?.actionsLabel ?? fallback.actionsLabel,
    },
  };
}

export function resolveContactInfoTexts(
  texts: ContactInfoTexts | undefined,
  locale: ContactLocale
): ContactInfoTexts {
  const fallback = CONTACT_INFO_FALLBACKS[locale];

  return {
    contact: {
      email: texts?.contact?.email ?? 'contact@havenova.de',
      phone: texts?.contact?.phone ?? '+49 176 7091 7803',
      address: texts?.contact?.address ?? 'Stollberger Str.43, 12627 Berlin',
    },
    hoursStatus: texts?.hoursStatus,
    aria: {
      info: texts?.aria?.info ?? fallback.aria.info,
      quickActions: texts?.aria?.quickActions ?? fallback.aria.quickActions,
      call: texts?.aria?.call ?? fallback.aria.call,
      email: texts?.aria?.email ?? fallback.aria.email,
      address: texts?.aria?.address ?? fallback.aria.address,
      whatsapp: texts?.aria?.whatsapp ?? fallback.aria.whatsapp,
    } satisfies ContactInfoAriaTexts,
    quickActions: {
      call: texts?.quickActions?.call ?? fallback.quickActions.call,
      email: texts?.quickActions?.email ?? fallback.quickActions.email,
      whatsapp: texts?.quickActions?.whatsapp ?? fallback.quickActions.whatsapp,
    } satisfies ContactQuickActionTexts,
  };
}

export function resolveContactFaqTexts(
  texts: FAQSectionTexts | undefined,
  locale: ContactLocale
): FAQSectionTexts {
  const fallback = CONTACT_FAQ_FALLBACKS[locale];

  return {
    title: texts?.title ?? fallback.title,
    items: texts?.items?.length ? texts.items : fallback.items,
    a11y: {
      sectionLabel: texts?.a11y?.sectionLabel ?? fallback.sectionLabel,
      openItem: texts?.a11y?.openItem ?? fallback.openItem,
      closeItem: texts?.a11y?.closeItem ?? fallback.closeItem,
    },
  };
}
