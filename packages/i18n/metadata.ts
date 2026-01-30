// packages/i18n/metadata.ts
import { Metadata } from 'next';

export const pageMetadata: Record<string, Record<'de' | 'en', Metadata>> = {
  home: {
    en: {
      title: 'Havenova - Your Trusted Home Service Partner in Berlin',
      description:
        'Book reliable handyman, cleaning and home services in Berlin with Havenova. Transparent, fast and professional.',
      openGraph: {
        title: 'Havenova - Professional Home Services in Berlin',
        description: 'Discover top-quality handyman, cleaning, and maintenance services in Berlin.',
        type: 'website',
        url: 'https://havenova.de/en',
        images: [
          {
            url: 'https://havenova.de/images/og-home.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Home Services',
          },
        ],
      },
      icons: {
        icon: [
          { url: '/favicon-light.ico', media: '(prefers-color-scheme: light)' },
          { url: '/favicon-dark.ico', media: '(prefers-color-scheme: dark)' },
          {
            url: '/favicon-light.svg',
            media: '(prefers-color-scheme: light)',
            type: 'image/svg+xml',
          },
          {
            url: '/favicon-dark.svg',
            media: '(prefers-color-scheme: dark)',
            type: 'image/svg+xml',
          },
        ],
      },
    },
    de: {
      title: 'Havenova - Ihr vertrauenswürdiger Partner für Hausservices in Berlin',
      description:
        'Buchen Sie zuverlässige Handwerker-, Reinigungs- und Hausservices in Berlin mit Havenova. Transparent, schnell und professionell.',
      openGraph: {
        title: 'Havenova - Professionelle Hausservices in Berlin',
        description:
          'Entdecken Sie hochwertige Handwerker-, Reinigungs- und Wartungsdienste in Berlin.',
        type: 'website',
        url: 'https://havenova.de/de',
        images: [
          {
            url: 'https://havenova.de/images/og-home.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Hausservices',
          },
        ],
      },
    },
  },
  about: {
    en: {
      title: 'About Havenova - Your Trusted Home Service Partner in Berlin',
      description:
        'Learn more about Havenova, our mission, and the team dedicated to delivering top-quality handyman services in Berlin.',
      openGraph: {
        title: 'About Havenova - Professional Handyman Services',
        description:
          'Discover who we are and why customers trust Havenova for home maintenance services in Berlin.',
        type: 'website',
        url: 'https://havenova.de/en/about',
        images: [
          {
            url: 'https://havenova.de/images/og-about.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Team',
          },
        ],
      },
    },
    de: {
      title: 'Über Havenova - Ihr vertrauenswürdiger Partner für Hausservices in Berlin',
      description:
        'Erfahren Sie mehr über Havenova, unsere Mission und das Team, das hochwertige Handwerkerdienste in Berlin anbietet.',
      openGraph: {
        title: 'Über Havenova - Professionelle Handwerkerdienste',
        description:
          'Entdecken Sie, wer wir sind und warum Kunden Havenova für Hauswartungsdienste in Berlin vertrauen.',
        type: 'website',
        url: 'https://havenova.de/de/about',
        images: [
          {
            url: 'https://havenova.de/images/og-about.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Team',
          },
        ],
      },
    },
  },
  contact: {
    en: {
      title: 'Contact Havenova - Get in Touch Today',
      description:
        'Have questions about our services? Contact Havenova in Berlin for fast support and reliable answers.',
      openGraph: {
        title: 'Contact Havenova',
        description:
          'Reach out to Havenova and let us help you with your home service needs in Berlin.',
        type: 'website',
        url: 'https://havenova.de/en/contact',
        images: [
          {
            url: 'https://havenova.de/images/og-contact.jpg',
            width: 1200,
            height: 630,
            alt: 'Contact Havenova',
          },
        ],
      },
    },
    de: {
      title: 'Kontakt Havenova - Nehmen Sie noch heute Kontakt auf',
      description:
        'Haben Sie Fragen zu unseren Dienstleistungen? Kontaktieren Sie Havenova in Berlin für schnelle Unterstützung und verlässliche Antworten.',
      openGraph: {
        title: 'Kontakt Havenova',
        description:
          'Kontaktieren Sie Havenova und lassen Sie uns Ihnen bei Ihren Hausservice-Bedürfnissen in Berlin helfen.',
        type: 'website',
        url: 'https://havenova.de/de/contact',
        images: [
          {
            url: 'https://havenova.de/images/og-contact.jpg',
            width: 1200,
            height: 630,
            alt: 'Kontakt Havenova',
          },
        ],
      },
    },
  },
  howItWorks: {
    en: {
      title: 'How It Works | Havenova',
      description:
        'See how Havenova handles service requests from first message to completion with a clear, reliable workflow.',
      openGraph: {
        title: 'How It Works | Havenova',
        description:
          'Understand the Havenova workflow for home services: request, review, scheduling, and completion.',
        type: 'website',
        url: 'https://havenova.de/en/how-it-work',
        images: [
          {
            url: 'https://havenova.de/images/og-how-it-works.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova workflow overview',
          },
        ],
      },
    },
    de: {
      title: 'So funktioniert es | Havenova',
      description:
        'Erfahre, wie Havenova Serviceanfragen von der ersten Nachricht bis zur Fertigstellung klar strukturiert abwickelt.',
      openGraph: {
        title: 'So funktioniert es | Havenova',
        description:
          'Verstehe den Havenova Ablauf für Hausservices: Anfrage, Prüfung, Terminierung und Abschluss.',
        type: 'website',
        url: 'https://havenova.de/de/how-it-work',
        images: [
          {
            url: 'https://havenova.de/images/og-how-it-works.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Ablaufübersicht',
          },
        ],
      },
    },
  },
  privacyPolicy: {
    en: {
      title: 'Privacy Policy | Havenova',
      description:
        'Learn how Havenova processes personal data, the legal bases, retention periods, and your GDPR rights.',
      keywords:
        'privacy policy, GDPR, data protection, personal data, Havenova, Berlin, user rights',
      openGraph: {
        title: 'Privacy Policy | Havenova',
        description: 'Learn how Havenova handles and protects your personal data under the GDPR.',
        type: 'website',
        url: 'https://havenova.de/en/legal/privacy-policy',
        images: [
          {
            url: 'https://havenova.de/images/og-privacy-policy.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Privacy Policy',
          },
        ],
      },
    },
    de: {
      title: 'Datenschutzerklärung | Havenova',
      description:
        'Erfahren Sie, wie Havenova personenbezogene Daten verarbeitet, auf welcher Rechtsgrundlage und welche DSGVO-Rechte Sie haben.',
      keywords:
        'Datenschutzerklärung, DSGVO, Datenschutz, personenbezogene Daten, Havenova, Berlin, Betroffenenrechte',
      openGraph: {
        title: 'Datenschutzerklärung | Havenova',
        description:
          'Erfahren Sie, wie Havenova Ihre personenbezogenen Daten gemäß DSGVO verarbeitet und schützt.',
        type: 'website',
        url: 'https://havenova.de/de/legal/privacy-policy',
        images: [
          {
            url: 'https://havenova.de/images/og-privacy-policy.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Datenschutzerklärung',
          },
        ],
      },
    },
  },
  imprint: {
    en: {
      title: 'Imprint | Havenova',
      description:
        'Legal disclosure for Havenova including provider information, contact details, and EU-required notices.',
      keywords: 'imprint, legal notice, provider information, EU law, Havenova, Berlin',
      openGraph: {
        title: 'Imprint | Havenova',
        description: 'Legal disclosure and provider information for Havenova.',
        type: 'website',
        url: 'https://havenova.de/en/legal/imprint',
        images: [
          {
            url: 'https://havenova.de/images/og-imprint.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Imprint',
          },
        ],
      },
    },
    de: {
      title: 'Impressum | Havenova',
      description:
        'Rechtliche Anbieterinformationen, Kontaktangaben und EU-relevante Hinweise für Havenova.',
      keywords: 'Impressum, Anbieterkennzeichnung, rechtliche Hinweise, EU, Havenova, Berlin',
      openGraph: {
        title: 'Impressum | Havenova',
        description: 'Rechtliche Anbieterinformationen und Kontaktangaben für Havenova.',
        type: 'website',
        url: 'https://havenova.de/de/legal/imprint',
        images: [
          {
            url: 'https://havenova.de/images/og-imprint.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Impressum',
          },
        ],
      },
    },
  },
  termsOfService: {
    en: {
      title: 'Terms of Service | Havenova',
      description:
        'Review Havenova’s terms of service, platform usage rules, liability, and applicable law.',
      keywords:
        'terms of service, platform terms, user obligations, liability, Havenova, Berlin, legal',
      openGraph: {
        title: 'Terms of Service | Havenova',
        description: 'Platform terms, usage rules, and legal information for Havenova.',
        type: 'website',
        url: 'https://havenova.de/en/legal/terms-of-service',
        images: [
          {
            url: 'https://havenova.de/images/og-terms.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Terms of Service',
          },
        ],
      },
    },
    de: {
      title: 'Allgemeine Geschäftsbedingungen | Havenova',
      description:
        'Lesen Sie die Nutzungsbedingungen, Haftungsregelungen und das anwendbare Recht für Havenova.',
      keywords:
        'AGB, Nutzungsbedingungen, Haftung, rechtliche Hinweise, Havenova, Berlin, Plattform',
      openGraph: {
        title: 'Allgemeine Geschäftsbedingungen | Havenova',
        description: 'Nutzungsbedingungen und rechtliche Hinweise für die Havenova-Plattform.',
        type: 'website',
        url: 'https://havenova.de/de/legal/terms-of-service',
        images: [
          {
            url: 'https://havenova.de/images/og-terms.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova AGB',
          },
        ],
      },
    },
  },
  cookiePolicy: {
    en: {
      title: 'Cookie Policy | Havenova',
      description:
        'Learn how Havenova uses strictly necessary cookies and how you can manage your preferences.',
      keywords:
        'cookie policy, necessary cookies, privacy, consent, Havenova, Berlin, browser settings',
      openGraph: {
        title: 'Cookie Policy | Havenova',
        description: 'Details about cookies used on the Havenova platform.',
        type: 'website',
        url: 'https://havenova.de/en/legal/cookie-policy',
        images: [
          {
            url: 'https://havenova.de/images/og-cookies.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Cookie Policy',
          },
        ],
      },
    },
    de: {
      title: 'Cookie-Richtlinie | Havenova',
      description:
        'Erfahren Sie, wie Havenova technisch notwendige Cookies verwendet und wie Sie Einstellungen verwalten.',
      keywords:
        'Cookie-Richtlinie, notwendige Cookies, Datenschutz, Einwilligung, Havenova, Berlin, Browser',
      openGraph: {
        title: 'Cookie-Richtlinie | Havenova',
        description: 'Informationen zu Cookies auf der Havenova-Plattform.',
        type: 'website',
        url: 'https://havenova.de/de/legal/cookie-policy',
        images: [
          {
            url: 'https://havenova.de/images/og-cookies.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Cookie-Richtlinie',
          },
        ],
      },
    },
  },
};
