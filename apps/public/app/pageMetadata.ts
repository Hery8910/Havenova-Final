// Define a metadata type for consistency
type IconItem = {
  url: string;
  media: string;
  type?: string;
};
export type PageMetadata = {
  title: string;
  description: string;
  keywords: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    url: string;
    images: {
      url: string;
      width: number;
      height: number;
      alt: string;
    }[];
  };
  icons: {
    icon: IconItem[];
  };
};

// Metadata for Home page
export const homeMetadata: PageMetadata = {
  title: 'Havenova - Professional Home Services in Berlin',
  description:
    'Book expert handyman services in Berlin. Trusted professionals for home repairs, cleaning, and assembly.',
  keywords:
    'home services Berlin, handyman Berlin, furniture assembly, cleaning services, plumbing, electrical repairs',
  openGraph: {
    title: 'Havenova - Reliable Home Services in Berlin',
    description: 'Book expert handyman services today and get a 10% discount on your first order.',
    type: 'website',
    url: 'https://havenova.de',
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
};

// Metadata for About page
export const aboutMetadata: PageMetadata = {
  title: 'About Havenova - Your Trusted Home Service Partner in Berlin',
  description:
    'Learn more about Havenova, our mission, and the team dedicated to delivering top-quality handyman services in Berlin.',
  keywords: 'about Havenova, handyman team Berlin, home service company Berlin, company mission',
  openGraph: {
    title: 'About Havenova - Professional Handyman Services',
    description:
      'Discover who we are and why customers trust Havenova for home maintenance services in Berlin.',
    type: 'website',
    url: 'https://havenova.de/about',
    images: [
      {
        url: 'https://havenova.de/images/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'Havenova Team',
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
};

// Metadata for Services page
export const servicesMetadata: PageMetadata = {
  title: 'Havenova Services - Professional Handyman Solutions in Berlin',
  description:
    'Explore all Havenova services in Berlin, including furniture assembly, kitchen installation, home cleaning, and more.',
  keywords:
    'services Berlin, handyman services, furniture assembly, home maintenance Berlin, cleaning services',
  openGraph: {
    title: 'Havenova Services - Expert Solutions for Your Home',
    description: 'Discover our range of handyman services in Berlin tailored to your home needs.',
    type: 'website',
    url: 'https://havenova.de/services',
    images: [
      {
        url: 'https://havenova.de/images/og-services.jpg',
        width: 1200,
        height: 630,
        alt: 'Havenova Services Overview',
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
};

// Metadata for Furniture Assembly page
export const furnitureAssemblyMetadata: PageMetadata = {
  title: 'Furniture Assembly Service in Berlin | Havenova',
  description:
    'Professional furniture assembly services in Berlin. Book with Havenova for reliable, precise, and efficient assembly.',
  keywords: 'furniture assembly Berlin, handyman services, furniture setup, assembly service',
  openGraph: {
    title: 'Furniture Assembly in Berlin - Havenova',
    description:
      'Get expert furniture assembly services in Berlin with Havenova. Trusted by homeowners and businesses.',
    type: 'website',
    url: 'https://havenova.de/services/furniture-assembly',
    images: [
      {
        url: 'https://havenova.de/images/og-furniture-assembly.jpg',
        width: 1200,
        height: 630,
        alt: 'Furniture Assembly Service Berlin',
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
};

// Metadata for Kitchen Assembly page
export const kitchenAssemblyMetadata: PageMetadata = {
  title: 'Kitchen Assembly Service in Berlin | Havenova',
  description:
    'Expert kitchen assembly services in Berlin. Book now with Havenova for professional and precise installations.',
  keywords:
    'kitchen assembly Berlin, kitchen installation, handyman services Berlin, professional assembly',
  openGraph: {
    title: 'Kitchen Assembly in Berlin - Havenova',
    description:
      'Book professional kitchen assembly services in Berlin with Havenova and enjoy hassle-free installations.',
    type: 'website',
    url: 'https://havenova.de/services/kitchen-assembly',
    images: [
      {
        url: 'https://havenova.de/images/og-kitchen-assembly.jpg',
        width: 1200,
        height: 630,
        alt: 'Kitchen Assembly Service Berlin',
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
};

// Metadata for Home Service page
export const homeServiceMetadata: PageMetadata = {
  title: 'Home Services in Berlin | Havenova',
  description:
    'Reliable home services in Berlin. Book Havenova for maintenance, repairs, and household support.',
  keywords: 'home services Berlin, maintenance services, handyman repairs, Berlin home support',
  openGraph: {
    title: 'Reliable Home Services in Berlin - Havenova',
    description:
      'Discover reliable home services and maintenance solutions in Berlin with Havenova.',
    type: 'website',
    url: 'https://havenova.de/services/home-service',
    images: [
      {
        url: 'https://havenova.de/images/og-home-service.jpg',
        width: 1200,
        height: 630,
        alt: 'Home Services Berlin',
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
};

// Metadata for House Cleaning page
export const houseCleaningMetadata: PageMetadata = {
  title: 'House Cleaning Service in Berlin | Havenova',
  description:
    'Professional house cleaning services in Berlin. Book with Havenova for thorough and reliable cleaning.',
  keywords:
    'house cleaning Berlin, professional cleaning, Berlin cleaning services, thorough home cleaning',
  openGraph: {
    title: 'House Cleaning in Berlin - Havenova',
    description:
      'Book reliable house cleaning services in Berlin with Havenova for spotless results.',
    type: 'website',
    url: 'https://havenova.de/services/house-cleaning',
    images: [
      {
        url: 'https://havenova.de/images/og-house-cleaning.jpg',
        width: 1200,
        height: 630,
        alt: 'House Cleaning Service Berlin',
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
};

// Metadata for Kitchen Cleaning page
export const kitchenCleaningMetadata: PageMetadata = {
  title: 'Deep Kitchen Cleaning Service in Berlin | Havenova',
  description:
    'Expert kitchen deep cleaning services in Berlin. Book with Havenova for a spotless, hygienic kitchen space.',
  keywords:
    'kitchen deep cleaning Berlin, professional kitchen cleaning, grease removal, Berlin handyman',
  openGraph: {
    title: 'Deep Kitchen Cleaning in Berlin - Havenova',
    description:
      'Get your kitchen professionally deep cleaned in Berlin with Havenova. Remove grease, sanitize surfaces, and enjoy a fresh space.',
    type: 'website',
    url: 'https://havenova.de/services/kitchen-cleaning',
    images: [
      {
        url: 'https://havenova.de/images/og-kitchen-cleaning.jpg',
        width: 1200,
        height: 630,
        alt: 'Deep Kitchen Cleaning Service Berlin',
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
};

// Metadata for Windows Cleaning page
export const windowsCleaningMetadata: PageMetadata = {
  title: 'Windows Cleaning Service in Berlin | Havenova',
  description:
    'Professional window cleaning services in Berlin. Book with Havenova for crystal-clear windows.',
  keywords:
    'window cleaning Berlin, professional window cleaning, glass cleaning services, Berlin handyman',
  openGraph: {
    title: 'Windows Cleaning in Berlin - Havenova',
    description:
      'Get professional window cleaning services in Berlin with Havenova for spotless, streak-free windows.',
    type: 'website',
    url: 'https://havenova.de/services/windows-cleaning',
    images: [
      {
        url: 'https://havenova.de/images/og-windows-cleaning.jpg',
        width: 1200,
        height: 630,
        alt: 'Windows Cleaning Service Berlin',
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
};

// Metadata for Contact page
export const contactMetadata: PageMetadata = {
  title: 'Contact Havenova - Home Services in Berlin',
  description:
    'Get in touch with Havenova for reliable and fast handyman services in Berlin. We’re ready to assist with any home project.',
  keywords: 'contact Havenova, handyman Berlin, home service inquiries, get in touch',
  openGraph: {
    title: 'Contact Havenova - Your Home Service Partner in Berlin',
    description: 'Reach out to our team for expert assistance with home repairs and maintenance.',
    type: 'website',
    url: 'https://havenova.de/contact',
    images: [
      {
        url: 'https://havenova.de/images/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Havenova',
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
};

// Metadata for Blog page
export const blogMetadata: PageMetadata = {
  title: 'Havenova Blog - Tips and Insights on Home Services in Berlin',
  description:
    'Read helpful articles and insights from Havenova’s team of professionals on home maintenance and handyman services in Berlin.',
  keywords:
    'handyman blog Berlin, home maintenance tips, service advice, cleaning guides, furniture assembly tips',
  openGraph: {
    title: 'Havenova Blog - Expert Advice for Homeowners in Berlin',
    description: 'Stay informed with expert articles on home improvement and handyman services.',
    type: 'website',
    url: 'https://havenova.de/blog',
    images: [
      {
        url: 'https://havenova.de/images/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Havenova Blog',
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
};

export const faqMetadata: PageMetadata = {
  title: 'Frequently Asked Questions | Havenova Berlin',
  description:
    'Find answers to common questions about our handyman services, booking process, payments, and more.',
  keywords: 'FAQ Havenova, handyman questions, service information, booking guide, payment info',
  openGraph: {
    title: 'FAQ - Havenova Home Services Berlin',
    description:
      'Explore frequently asked questions and answers about Havenova’s services in Berlin.',
    type: 'website',
    url: 'https://havenova.de/faq',
    images: [
      {
        url: 'https://havenova.de/images/og-faq.jpg',
        width: 1200,
        height: 630,
        alt: 'Havenova FAQ',
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
};

// Metadata for Reviews page
export const reviewsMetadata: PageMetadata = {
  title: 'Customer Reviews - Havenova Home Services in Berlin',
  description:
    'Read real customer reviews for Havenova. Trusted home services provider in Berlin with excellent feedback.',
  keywords: 'Havenova reviews, customer feedback, testimonials, Berlin home services',
  openGraph: {
    title: 'Havenova Reviews - Trusted by Homeowners in Berlin',
    description:
      'See what customers are saying about Havenova’s services and why they recommend us.',
    type: 'website',
    url: 'https://havenova.de/reviews',
    images: [
      {
        url: 'https://havenova.de/images/og-reviews.jpg',
        width: 1200,
        height: 630,
        alt: 'Havenova Customer Reviews',
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
};

// Metadata for Privacy Policy page
export const privacyPolicyMetadata: PageMetadata = {
  title: 'Privacy Policy | Havenova',
  description:
    'Read Havenova’s privacy policy to understand how we protect and use your personal data.',
  keywords: 'privacy policy Havenova, data protection, user privacy, Berlin services',
  openGraph: {
    title: 'Privacy Policy - Havenova Home Services',
    description: 'Learn how Havenova handles and protects your personal data.',
    type: 'website',
    url: 'https://havenova.de/legal/privacy-policy',
    images: [
      {
        url: 'https://havenova.de/images/og-privacy-policy.jpg',
        width: 1200,
        height: 630,
        alt: 'Havenova Privacy Policy',
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
};

// Metadata for Terms of Service page
export const termsOfServiceMetadata: PageMetadata = {
  title: 'Terms of Service | Havenova Berlin',
  description:
    'Review Havenova’s terms of service for all professional handyman and home maintenance services in Berlin.',
  keywords: 'terms of service Havenova, service terms, user agreement, Berlin home services',
  openGraph: {
    title: 'Terms of Service - Havenova Home Services',
    description: 'Understand the terms and conditions of using Havenova’s services in Berlin.',
    type: 'website',
    url: 'https://havenova.de/legal/terms-of-service',
    images: [
      {
        url: 'https://havenova.de/images/og-terms.jpg',
        width: 1200,
        height: 630,
        alt: 'Havenova Terms of Service',
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
};

// Metadata for Cookie Policy page
export const cookiePolicyMetadata: PageMetadata = {
  title: 'Cookie Policy | Havenova Berlin',
  description: 'Learn how Havenova uses cookies to enhance user experience on our website.',
  keywords: 'cookie policy Havenova, cookies use, website tracking, Berlin home services',
  openGraph: {
    title: 'Cookie Policy - Havenova Home Services',
    description:
      'Read our cookie policy and understand how cookies are used on the Havenova website.',
    type: 'website',
    url: 'https://havenova.de/legal/cookie-policy',
    images: [
      {
        url: 'https://havenova.de/images/og-cookies.jpg',
        width: 1200,
        height: 630,
        alt: 'Havenova Cookie Policy',
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
};
export const checkoutMetadata: PageMetadata = {
  title: 'Checkout - Confirm Your Service Request | Havenova Berlin',
  description:
    'Review your selected services, choose a preferred date and time, and submit your home service request securely with Havenova.',
  keywords:
    'checkout, service request, confirm booking, Havenova Berlin, home services, handyman booking',
  openGraph: {
    title: 'Checkout - Book Your Home Services in Berlin',
    description:
      'Finalize your Havenova service request. Select appointment details and submit your booking in just a few steps.',
    type: 'website',
    url: 'https://havenova.de/checkout',
    images: [
      {
        url: 'https://havenova.de/images/og-checkout.jpg',
        width: 1200,
        height: 630,
        alt: 'Havenova Service Checkout',
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
};
export const userProfileMetadata: PageMetadata = {
  title: 'Havenova Profile – Manage Your Account and Services in Berlin',
  description:
    'Access your Havenova profile to manage your account, view and update your personal information, track your service requests, and discover exclusive tips and offers for home services in Berlin.',
  keywords:
    'havenova profile, account management, home services Berlin, track requests, exclusive offers, service tips',
  openGraph: {
    title: 'Havenova Profile – Effortless Account and Service Management',
    description:
      'Log in to your Havenova profile to easily manage your services, stay updated on your requests, and access personalized home maintenance tips.',
    type: 'website',
    url: 'https://havenova.de/profile',
    images: [
      {
        url: 'https://havenova.de/images/og-profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Havenova Profile Page',
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
};
