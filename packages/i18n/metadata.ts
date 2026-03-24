// packages/i18n/metadata.ts
import { Metadata } from 'next';

export const pageMetadata: Record<string, Record<'de' | 'en', Metadata>> = {
  home: {
    en: {
      title: 'Havenova - Your Trusted Home Service Partner in Berlin',
      description:
        'Book reliable handyman, cleaning and home service in Berlin with Havenova. Transparent, fast and professional.',
      openGraph: {
        title: 'Havenova - Professional Home Services in Berlin',
        description: 'Discover top-quality handyman, cleaning, and home service in Berlin.',
        type: 'website',
        url: 'https://havenova.de/en',
        images: [
          {
            url: 'https://havenova.de/screenshots/home-desktop-en.png',
            width: 1280,
            height: 720,
            alt: 'Havenova Home Services',
          },
        ],
      },
      icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
      },
    },
    de: {
      title: 'Havenova - Ihr vertrauenswürdiger Partner für Hausservice in Berlin',
      description:
        'Buchen Sie zuverlässige Handwerker-, Reinigungs- und Hausservice in Berlin mit Havenova. Transparent, schnell und professionell.',
      openGraph: {
        title: 'Havenova - Professioneller Hausservice in Berlin',
        description:
          'Entdecken Sie hochwertige Handwerker-, Reinigungs- und Hausservice in Berlin.',
        type: 'website',
        url: 'https://havenova.de/de',
        images: [
          {
            url: 'https://havenova.de/screenshots/home-desktop-de.png',
            width: 1280,
            height: 720,
            alt: 'Havenova Hausservice',
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
          'Discover who we are and why customers trust Havenova for home service in Berlin.',
        type: 'website',
        url: 'https://havenova.de/en/about',
        images: [
          {
            url: 'https://havenova.de/screenshots/about-desktop-en.png',
            width: 1280,
            height: 720,
            alt: 'Havenova Team',
          },
        ],
      },
    },
    de: {
      title: 'Über Havenova - Ihr vertrauenswürdiger Partner für Hausservice in Berlin',
      description:
        'Erfahren Sie mehr über Havenova, unsere Mission und das Team, das hochwertige Handwerkerdienste in Berlin anbietet.',
      openGraph: {
        title: 'Über Havenova - Professionelle Handwerkerdienste',
        description:
          'Entdecken Sie, wer wir sind und warum Kunden Havenova für Hausservice in Berlin vertrauen.',
        type: 'website',
        url: 'https://havenova.de/de/about',
        images: [
          {
            url: 'https://havenova.de/screenshots/about-desktop-de.png',
            width: 1280,
            height: 720,
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
            url: 'https://havenova.de/screenshots/contact-desktop-en.png',
            width: 1280,
            height: 720,
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
            url: 'https://havenova.de/screenshots/contact-desktop-de.png',
            width: 1280,
            height: 720,
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
          'Understand the Havenova workflow for home service: request, review, scheduling, and completion.',
        type: 'website',
        url: 'https://havenova.de/en/how-it-work',
        images: [
          {
            url: 'https://havenova.de/screenshots/how-it-work-desktop-en.png',
            width: 1280,
            height: 720,
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
          'Verstehe den Havenova Ablauf für Hausservice: Anfrage, Prüfung, Terminierung und Abschluss.',
        type: 'website',
        url: 'https://havenova.de/de/how-it-work',
        images: [
          {
            url: 'https://havenova.de/screenshots/how-it-work-desktop-de.png',
            width: 1280,
            height: 720,
            alt: 'Havenova Ablaufübersicht',
          },
        ],
      },
    },
  },
  cleaningService: {
    en: {
      title: 'Professional Cleaning Service in Berlin | Havenova',
      description:
        'Book a trusted cleaning service in Berlin with Havenova for homes, apartments, and offices. Flexible scheduling, transparent pricing, and quality results.',
      keywords:
        'cleaning service Berlin, home cleaning Berlin, apartment cleaning Berlin, office cleaning Berlin, deep cleaning Berlin, move-out cleaning Berlin, professional cleaners Berlin, Havenova cleaning',
      openGraph: {
        title: 'Professional Cleaning Service in Berlin | Havenova',
        description:
          'Reliable home and office cleaning in Berlin with flexible appointments and professional standards.',
        type: 'website',
        url: 'https://havenova.de/en/cleaning-service',
        images: [
          {
            url: 'https://havenova.de/screenshots/cleaning-service-desktop-en.png',
            width: 1280,
            height: 720,
            alt: 'Havenova cleaning service in Berlin',
          },
        ],
      },
    },
    de: {
      title: 'Professioneller Reinigungsservice in Berlin | Havenova',
      description:
        'Buchen Sie einen zuverlässigen Reinigungsservice in Berlin mit Havenova für Wohnungen, Häuser und Büros. Flexible Termine, transparente Preise und professionelle Ergebnisse.',
      keywords:
        'Reinigungsservice Berlin, Wohnungsreinigung Berlin, Hausreinigung Berlin, Büroreinigung Berlin, Grundreinigung Berlin, Endreinigung Berlin, professionelle Reinigungskräfte Berlin, Havenova Reinigung',
      openGraph: {
        title: 'Professioneller Reinigungsservice in Berlin | Havenova',
        description:
          'Zuverlässige Wohnungs- und Büroreinigung in Berlin mit flexiblen Terminen und professionellem Standard.',
        type: 'website',
        url: 'https://havenova.de/de/cleaning-service',
        images: [
          {
            url: 'https://havenova.de/screenshots/cleaning-service-desktop-de.png',
            width: 1280,
            height: 720,
            alt: 'Havenova Reinigungsservice in Berlin',
          },
        ],
      },
    },
  },
  homeService: {
    en: {
      title: 'Home Service in Berlin | Havenova',
      description:
        'Prepare your request for painting, repairs and installations, furniture assembly, kitchen assembly, or moving help in Berlin with Havenova.',
      keywords:
        'home service Berlin, painting Berlin, repairs Berlin, installations Berlin, furniture assembly Berlin, kitchen assembly Berlin, moving help Berlin',
      openGraph: {
        title: 'Home Service in Berlin | Havenova',
        description:
          'Structured requests in Berlin for painting, repairs and installations, furniture assembly, kitchen assembly, and moving help.',
        type: 'website',
        url: 'https://havenova.de/en/home-service',
        images: [
          {
            url: 'https://havenova.de/screenshots/home-service-desktop-en.png',
            width: 1280,
            height: 720,
            alt: 'Havenova home service in Berlin',
          },
        ],
      },
    },
    de: {
      title: 'Hausservice in Berlin | Havenova',
      description:
        'Bereiten Sie Ihre Anfrage für Malerarbeiten, Reparaturen und Installationen, Möbelmontage, Küchenmontage oder Umzugshilfe in Berlin mit Havenova vor.',
      keywords:
        'Hausservice Berlin, Maler Berlin, Reparaturen Berlin, Installationen Berlin, Möbelmontage Berlin, Küchenmontage Berlin, Umzugshilfe Berlin',
      openGraph: {
        title: 'Hausservice in Berlin | Havenova',
        description:
          'Strukturierte Anfragen in Berlin für Malerarbeiten, Reparaturen und Installationen, Möbelmontage, Küchenmontage und Umzugshilfe.',
        type: 'website',
        url: 'https://havenova.de/de/home-service',
        images: [
          {
            url: 'https://havenova.de/screenshots/home-service-desktop-de.png',
            width: 1280,
            height: 720,
            alt: 'Havenova Hausservice in Berlin',
          },
        ],
      },
    },
  },
  profile: {
    en: {
      title: 'My Profile | Havenova',
      description:
        'Manage your Havenova profile details, contact information, and account preferences.',
      openGraph: {
        title: 'My Profile | Havenova',
        description: 'Manage your account settings and personal information on Havenova.',
        type: 'website',
        url: 'https://havenova.de/en/profile',
      },
    },
    de: {
      title: 'Mein Profil | Havenova',
      description:
        'Verwalten Sie Ihre Havenova-Profildaten, Kontaktinformationen und Kontoeinstellungen.',
      openGraph: {
        title: 'Mein Profil | Havenova',
        description: 'Verwalten Sie Kontoeinstellungen und persönliche Daten auf Havenova.',
        type: 'website',
        url: 'https://havenova.de/de/profile',
      },
    },
  },
  profileEdit: {
    en: {
      title: 'Edit Profile | Havenova',
      description:
        'Update your personal information, language, and preferences in your Havenova account.',
      openGraph: {
        title: 'Edit Profile | Havenova',
        description: 'Edit your Havenova profile details and preferences.',
        type: 'website',
        url: 'https://havenova.de/en/profile/edit',
      },
    },
    de: {
      title: 'Profil bearbeiten | Havenova',
      description:
        'Aktualisieren Sie persönliche Daten, Sprache und Einstellungen in Ihrem Havenova-Konto.',
      openGraph: {
        title: 'Profil bearbeiten | Havenova',
        description: 'Bearbeiten Sie Ihre Havenova-Profildaten und Einstellungen.',
        type: 'website',
        url: 'https://havenova.de/de/profile/edit',
      },
    },
  },
  profileNotifications: {
    en: {
      title: 'Notifications | Havenova',
      description: 'Review and manage notification preferences in your Havenova account.',
      openGraph: {
        title: 'Notifications | Havenova',
        description: 'Manage your Havenova notification settings.',
        type: 'website',
        url: 'https://havenova.de/en/profile/notification',
      },
    },
    de: {
      title: 'Benachrichtigungen | Havenova',
      description: 'Prüfen und verwalten Sie Benachrichtigungseinstellungen in Ihrem Konto.',
      openGraph: {
        title: 'Benachrichtigungen | Havenova',
        description: 'Verwalten Sie Ihre Havenova-Benachrichtigungseinstellungen.',
        type: 'website',
        url: 'https://havenova.de/de/profile/notification',
      },
    },
  },
  profileRequests: {
    en: {
      title: 'My Requests | Havenova',
      description: 'Track and review your submitted service requests in Havenova.',
      openGraph: {
        title: 'My Requests | Havenova',
        description: 'View your current and previous service requests in Havenova.',
        type: 'website',
        url: 'https://havenova.de/en/profile/requests',
      },
    },
    de: {
      title: 'Meine Anfragen | Havenova',
      description: 'Verfolgen und prüfen Sie Ihre eingereichten Serviceanfragen bei Havenova.',
      openGraph: {
        title: 'Meine Anfragen | Havenova',
        description: 'Sehen Sie aktuelle und frühere Serviceanfragen in Havenova ein.',
        type: 'website',
        url: 'https://havenova.de/de/profile/requests',
      },
    },
  },
  auth: {
    en: {
      title: 'Account Access | Havenova',
      description: 'Access your Havenova account to sign in, register, or recover your password.',
      openGraph: {
        title: 'Account Access | Havenova',
        description: 'Sign in or create your Havenova account.',
        type: 'website',
        url: 'https://havenova.de/en/user/login',
      },
    },
    de: {
      title: 'Kontozugang | Havenova',
      description:
        'Greifen Sie auf Ihr Havenova-Konto zu, um sich anzumelden, zu registrieren oder Ihr Passwort zurückzusetzen.',
      openGraph: {
        title: 'Kontozugang | Havenova',
        description: 'Melden Sie sich an oder erstellen Sie ein Havenova-Konto.',
        type: 'website',
        url: 'https://havenova.de/de/user/login',
      },
    },
  },
  login: {
    en: {
      title: 'Login | Havenova',
      description: 'Sign in to your Havenova account to manage services and profile settings.',
      openGraph: {
        title: 'Login | Havenova',
        description: 'Access your Havenova account securely.',
        type: 'website',
        url: 'https://havenova.de/en/user/login',
      },
    },
    de: {
      title: 'Anmelden | Havenova',
      description:
        'Melden Sie sich bei Ihrem Havenova-Konto an, um Services und Profileinstellungen zu verwalten.',
      openGraph: {
        title: 'Anmelden | Havenova',
        description: 'Greifen Sie sicher auf Ihr Havenova-Konto zu.',
        type: 'website',
        url: 'https://havenova.de/de/user/login',
      },
    },
  },
  register: {
    en: {
      title: 'Register | Havenova',
      description: 'Create your Havenova account to book and manage home services in Berlin.',
      openGraph: {
        title: 'Register | Havenova',
        description: 'Create a Havenova account in a few steps.',
        type: 'website',
        url: 'https://havenova.de/en/user/register',
      },
    },
    de: {
      title: 'Registrieren | Havenova',
      description:
        'Erstellen Sie Ihr Havenova-Konto, um Hausservices in Berlin zu buchen und zu verwalten.',
      openGraph: {
        title: 'Registrieren | Havenova',
        description: 'Erstellen Sie in wenigen Schritten ein Havenova-Konto.',
        type: 'website',
        url: 'https://havenova.de/de/user/register',
      },
    },
  },
  forgotPassword: {
    en: {
      title: 'Forgot Password | Havenova',
      description: 'Request a secure password reset link for your Havenova account.',
      openGraph: {
        title: 'Forgot Password | Havenova',
        description: 'Reset your Havenova account password securely.',
        type: 'website',
        url: 'https://havenova.de/en/user/forgot-password',
      },
    },
    de: {
      title: 'Passwort vergessen | Havenova',
      description: 'Fordern Sie einen sicheren Link zum Zurücksetzen Ihres Passworts an.',
      openGraph: {
        title: 'Passwort vergessen | Havenova',
        description: 'Setzen Sie Ihr Havenova-Kontopasswort sicher zurück.',
        type: 'website',
        url: 'https://havenova.de/de/user/forgot-password',
      },
    },
  },
  setPassword: {
    en: {
      title: 'Set New Password | Havenova',
      description: 'Set a new password and restore access to your Havenova account.',
      openGraph: {
        title: 'Set New Password | Havenova',
        description: 'Create a new password for your Havenova account.',
        type: 'website',
        url: 'https://havenova.de/en/user/set-password',
      },
    },
    de: {
      title: 'Neues Passwort setzen | Havenova',
      description: 'Setzen Sie ein neues Passwort und stellen Sie den Kontozugang wieder her.',
      openGraph: {
        title: 'Neues Passwort setzen | Havenova',
        description: 'Erstellen Sie ein neues Passwort für Ihr Havenova-Konto.',
        type: 'website',
        url: 'https://havenova.de/de/user/set-password',
      },
    },
  },
  verifyEmail: {
    en: {
      title: 'Verify Email | Havenova',
      description: 'Verify your email address to activate your Havenova account securely.',
      openGraph: {
        title: 'Verify Email | Havenova',
        description: 'Complete email verification for your Havenova account.',
        type: 'website',
        url: 'https://havenova.de/en/user/verify-email',
      },
    },
    de: {
      title: 'E-Mail verifizieren | Havenova',
      description:
        'Bestätigen Sie Ihre E-Mail-Adresse, um Ihr Havenova-Konto sicher zu aktivieren.',
      openGraph: {
        title: 'E-Mail verifizieren | Havenova',
        description: 'Schließen Sie die E-Mail-Verifizierung für Ihr Havenova-Konto ab.',
        type: 'website',
        url: 'https://havenova.de/de/user/verify-email',
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
            url: 'https://havenova.de/screenshots/privacy-policy-en.png',
            width: 1280,
            height: 720,
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
            url: 'https://havenova.de/screenshots/privacy-policy-de.png',
            width: 1280,
            height: 720,
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
            url: 'https://havenova.de/screenshots/imprint-en.png',
            width: 1280,
            height: 720,
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
            url: 'https://havenova.de/screenshots/imprint-de.png',
            width: 1280,
            height: 720,
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
            url: 'https://havenova.de/screenshots/terms-of-service-en.png',
            width: 1280,
            height: 720,
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
            url: 'https://havenova.de/screenshots/terms-of-service-de.png',
            width: 1280,
            height: 720,
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
            url: 'https://havenova.de/screenshots/cookie-policy-en.png',
            width: 1280,
            height: 720,
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
            url: 'https://havenova.de/screenshots/cookie-policy-de.png',
            width: 1280,
            height: 720,
            alt: 'Havenova Cookie-Richtlinie',
          },
        ],
      },
    },
  },
};
