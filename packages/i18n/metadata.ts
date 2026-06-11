// packages/i18n/metadata.ts
import { Metadata } from 'next';
import type { Locale } from './index';

export const pageMetadata: Record<string, Partial<Record<Locale, Metadata>>> = {
  home: {
    en: {
      title: 'Havenova | Cleaning and Home Services in Berlin',
      description:
        'Request reliable cleaning and home services in Berlin with Havenova. Clear requests, fast coordination, and professional support.',
      openGraph: {
        title: 'Havenova | Cleaning and Home Services in Berlin',
        description:
          'Discover cleaning and home services in Berlin with clear requests, fast coordination, and professional support.',
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
      title: 'Havenova | Reinigungs- und Hausservice in Berlin',
      description:
        'Frage zuverlässigen Reinigungs- und Hausservice in Berlin mit Havenova an. Klare Anfragen, schnelle Abstimmung und professionelle Unterstützung.',
      openGraph: {
        title: 'Havenova | Reinigungs- und Hausservice in Berlin',
        description:
          'Entdecke Reinigungs- und Hausservice in Berlin mit klaren Anfragen, schneller Abstimmung und professioneller Unterstützung.',
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
      icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
      },
    },
    es: {
      title: 'Havenova | Limpieza y servicio al hogar en Berlín',
      description:
        'Solicita servicios de limpieza y servicio al hogar en Berlín con Havenova. Solicitudes claras, coordinación rápida y apoyo profesional.',
      openGraph: {
        title: 'Havenova | Limpieza y servicio al hogar en Berlín',
        description:
          'Descubre servicios de limpieza y servicio al hogar en Berlín con solicitudes claras, coordinación rápida y apoyo profesional.',
        type: 'website',
        url: 'https://havenova.de/es',
        images: [
          {
            url: 'https://havenova.de/screenshots/home-desktop-en.png',
            width: 1280,
            height: 720,
            alt: 'Servicios de limpieza y hogar de Havenova',
          },
        ],
      },
      icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
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
    es: {
      title: 'Sobre Havenova - Tu socio de confianza para servicio al hogar en Berlin',
      description:
        'Descubre mas sobre Havenova, nuestra mision y el equipo que impulsa una experiencia mas clara para limpieza y servicio al hogar en Berlin.',
      openGraph: {
        title: 'Sobre Havenova - Servicio profesional para el hogar',
        description:
          'Descubre quienes somos y por que los clientes confian en Havenova para servicio al hogar en Berlin.',
        type: 'website',
        url: 'https://havenova.de/es/about',
        images: [
          {
            url: 'https://havenova.de/screenshots/about-desktop-en.png',
            width: 1280,
            height: 720,
            alt: 'Equipo de Havenova',
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
    es: {
      title: 'Como funciona | Havenova',
      description:
        'Descubre como Havenova gestiona las solicitudes de servicio desde el primer mensaje hasta la finalizacion con un flujo claro y fiable.',
      openGraph: {
        title: 'Como funciona | Havenova',
        description:
          'Entiende el flujo de Havenova para servicios del hogar: solicitud, revision, coordinacion y cierre.',
        type: 'website',
        url: 'https://havenova.de/es/how-it-work',
        images: [
          {
            url: 'https://havenova.de/screenshots/how-it-work-desktop-en.png',
            width: 1280,
            height: 720,
            alt: 'Resumen del flujo de Havenova',
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
    es: {
      title: 'Iniciar sesión | Havenova',
      description:
        'Accede a tu cuenta de Havenova para gestionar servicios y ajustes de perfil.',
      openGraph: {
        title: 'Iniciar sesión | Havenova',
        description: 'Accede de forma segura a tu cuenta de Havenova.',
        type: 'website',
        url: 'https://havenova.de/es/user/login',
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
    es: {
      title: 'Crear cuenta | Havenova',
      description:
        'Crea tu cuenta de Havenova para reservar y gestionar servicios para el hogar en Berlín.',
      openGraph: {
        title: 'Crear cuenta | Havenova',
        description: 'Crea una cuenta de Havenova en pocos pasos.',
        type: 'website',
        url: 'https://havenova.de/es/user/register',
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
    es: {
      title: 'Olvidé mi contraseña | Havenova',
      description: 'Solicita un enlace seguro para restablecer la contraseña de tu cuenta.',
      openGraph: {
        title: 'Olvidé mi contraseña | Havenova',
        description: 'Restablece de forma segura la contraseña de tu cuenta de Havenova.',
        type: 'website',
        url: 'https://havenova.de/es/user/forgot-password',
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
    es: {
      title: 'Definir nueva contraseña | Havenova',
      description: 'Define una nueva contraseña y recupera el acceso a tu cuenta de Havenova.',
      openGraph: {
        title: 'Definir nueva contraseña | Havenova',
        description: 'Crea una nueva contraseña para tu cuenta de Havenova.',
        type: 'website',
        url: 'https://havenova.de/es/user/set-password',
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
    es: {
      title: 'Verificar correo | Havenova',
      description:
        'Verifica tu dirección de correo para activar tu cuenta de Havenova de forma segura.',
      openGraph: {
        title: 'Verificar correo | Havenova',
        description: 'Completa la verificación de correo de tu cuenta de Havenova.',
        type: 'website',
        url: 'https://havenova.de/es/user/verify-email',
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
    es: {
      title: 'Política de Privacidad | Havenova',
      description:
        'Consulta cómo Havenova trata los datos personales, qué bases jurídicas utiliza, cuánto tiempo conserva la información y qué derechos te reconoce el GDPR.',
      keywords:
        'política de privacidad, GDPR, protección de datos, datos personales, Havenova, Berlín, derechos del usuario',
      openGraph: {
        title: 'Política de Privacidad | Havenova',
        description:
          'Consulta cómo Havenova trata y protege tus datos personales conforme al GDPR.',
        type: 'website',
        url: 'https://havenova.de/es/legal/privacy-policy',
        images: [
          {
            url: 'https://havenova.de/screenshots/privacy-policy-es.png',
            width: 1280,
            height: 720,
            alt: 'Havenova Política de Privacidad',
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
    es: {
      title: 'Aviso legal | Havenova',
      description:
        'Información legal de Havenova, incluyendo datos del negocio responsable, contacto y avisos exigidos en el contexto de la UE.',
      keywords:
        'aviso legal, información del proveedor, datos de contacto, UE, Havenova, Berlín',
      openGraph: {
        title: 'Aviso legal | Havenova',
        description: 'Información legal y datos de contacto de Havenova.',
        type: 'website',
        url: 'https://havenova.de/es/legal/imprint',
        images: [
          {
            url: 'https://havenova.de/screenshots/imprint-es.png',
            width: 1280,
            height: 720,
            alt: 'Havenova Aviso legal',
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
    es: {
      title: 'Términos del Servicio | Havenova',
      description:
        'Consulta las condiciones de uso, las reglas de la plataforma, la responsabilidad aplicable y la ley correspondiente en Havenova.',
      keywords:
        'términos del servicio, condiciones de la plataforma, obligaciones del usuario, responsabilidad, Havenova, Berlín, legal',
      openGraph: {
        title: 'Términos del Servicio | Havenova',
        description:
          'Condiciones de uso de la plataforma e información legal de Havenova.',
        type: 'website',
        url: 'https://havenova.de/es/legal/terms-of-service',
        images: [
          {
            url: 'https://havenova.de/screenshots/terms-of-service-es.png',
            width: 1280,
            height: 720,
            alt: 'Havenova Términos del Servicio',
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
    es: {
      title: 'Política de Cookies | Havenova',
      description:
        'Consulta cómo Havenova utiliza cookies estrictamente necesarias y cómo puedes gestionar la información almacenada en tu navegador.',
      keywords:
        'política de cookies, cookies necesarias, privacidad, consentimiento, Havenova, Berlín, navegador',
      openGraph: {
        title: 'Política de Cookies | Havenova',
        description:
          'Información sobre las cookies y tecnologías comparables usadas en la plataforma Havenova.',
        type: 'website',
        url: 'https://havenova.de/es/legal/cookie-policy',
        images: [
          {
            url: 'https://havenova.de/screenshots/cookie-policy-es.png',
            width: 1280,
            height: 720,
            alt: 'Havenova Política de Cookies',
          },
        ],
      },
    },
  },
};
