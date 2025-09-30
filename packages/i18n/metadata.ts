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
  services: {
    en: {
      title: 'Our Services - Havenova Berlin',
      description:
        'Explore Havenova’s handyman, cleaning, and maintenance services in Berlin. Reliable, fast, and professional solutions.',
      openGraph: {
        title: 'Havenova Services',
        description:
          'Choose from our range of professional home services tailored to your needs in Berlin.',
        type: 'website',
        url: 'https://havenova.de/en/services',
        images: [
          {
            url: 'https://havenova.de/images/og-services.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Services',
          },
        ],
      },
    },
    de: {
      title: 'Unsere Dienstleistungen - Havenova Berlin',
      description:
        'Entdecken Sie Havenovas Handwerker-, Reinigungs- und Wartungsdienste in Berlin. Zuverlässige, schnelle und professionelle Lösungen.',
      openGraph: {
        title: 'Havenova Dienstleistungen',
        description:
          'Wählen Sie aus unserem Angebot an professionellen Hausdiensten, die auf Ihre Bedürfnisse in Berlin zugeschnitten sind.',
        type: 'website',
        url: 'https://havenova.de/de/services',
        images: [
          {
            url: 'https://havenova.de/images/og-services.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Dienstleistungen',
          },
        ],
      },
    },
  },
  faq: {
    en: {
      title: 'FAQ - Havenova Berlin',
      description:
        'Find answers to frequently asked questions about Havenova’s services, bookings, and support in Berlin.',
      openGraph: {
        title: 'FAQ Havenova',
        description: 'Your most common questions about Havenova answered clearly and directly.',
        type: 'website',
        url: 'https://havenova.de/en/faq',
        images: [
          {
            url: 'https://havenova.de/images/og-faq.jpg',
            width: 1200,
            height: 630,
            alt: 'FAQ Havenova',
          },
        ],
      },
    },
    de: {
      title: 'FAQ - Havenova Berlin',
      description:
        'Finden Sie Antworten auf häufig gestellte Fragen zu Havenovas Dienstleistungen, Buchungen und Support in Berlin.',
      openGraph: {
        title: 'FAQ Havenova',
        description: 'Die häufigsten Fragen zu Havenova klar und direkt beantwortet.',
        type: 'website',
        url: 'https://havenova.de/de/faq',
        images: [
          {
            url: 'https://havenova.de/images/og-faq.jpg',
            width: 1200,
            height: 630,
            alt: 'FAQ Havenova',
          },
        ],
      },
    },
  },
  reviews: {
    en: {
      title: 'Customer Reviews - Havenova Berlin',
      description:
        'Read what our customers say about Havenova’s home services in Berlin. Trusted by many happy clients.',
      openGraph: {
        title: 'Havenova Customer Reviews',
        description:
          'Discover real customer experiences with Havenova’s handyman and cleaning services in Berlin.',
        type: 'website',
        url: 'https://havenova.de/en/reviews',
        images: [
          {
            url: 'https://havenova.de/images/og-reviews.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Reviews',
          },
        ],
      },
    },
    de: {
      title: 'Kundenbewertungen - Havenova Berlin',
      description:
        'Lesen Sie, was unsere Kunden über Havenovas Hausservices in Berlin sagen. Vertraut von vielen zufriedenen Kunden.',
      openGraph: {
        title: 'Havenova Kundenbewertungen',
        description:
          'Entdecken Sie echte Kundenerfahrungen mit Havenovas Handwerker- und Reinigungsdiensten in Berlin.',
        type: 'website',
        url: 'https://havenova.de/de/reviews',
        images: [
          {
            url: 'https://havenova.de/images/og-reviews.jpg',
            width: 1200,
            height: 630,
            alt: 'Havenova Bewertungen',
          },
        ],
      },
    },
  },
};
