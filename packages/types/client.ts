// Nueva interfaz para LOGOS
export interface Logos {
  main: string; // Logo principal (URL)
  mainDark?: string; // Logo para dark mode (URL)
  alt?: string; // Alternativo
  favicon?: string; // Favicon
}

// Nueva interfaz para TIPOGRAFÍA
export interface Typography {
  fontFamily: string; // Ej: 'Roboto'
  isGoogleFont: boolean; // true/false
  googleFontUrl?: string; // Solo si es Google Fonts
  weights?: string[]; // ["400", "700", ...]
  secondaryFontFamily?: string; // Opcional
}

// Interfaz simplificada del cliente
export interface Branding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  backgroundMain: string;
  backgroundSecondary: string;
  backgroundAccent: string;

  textColorPrimary: string;
  textColorSecondary: string;

  cardBackground: string;

  shadowDark: string;

  colorSuccess: string;
  bgSuccess: string;
  colorError: string;
  bgError: string;
  colorWarning: string;
  bgWarning: string;
  bgInfo: string;
  colorInfo: string;
}

export interface Images {
  backgroundImage?: string;
}

export interface Schedule {
  [day: string]: { start: string; end: string };
}

export interface Texts {
  [lang: string]: any; // puedes tipar más adelante si defines un esquema fijo
}
export interface LegalUpdateEntry {
  policy: 'privacy' | 'cookies' | 'terms';
  date: string; // ISO string
  updatedBy: string;
  note?: string;
}

export interface LegalUpdateMeta {
  lastPrivacyUpdate: string;
  lastCookiesUpdate: string;
  lastTermsUpdate: string;
  history: LegalUpdateEntry[];
}

export interface ClientConfig {
  _id: string;
  slug: string;
  companyName: string;
  branding: {
    light: Branding;
    dark: Branding;
  };
  images: Images;
  logos: Logos;
  typography: Typography;
  schedule: Schedule;
  texts: Texts;
  legalUpdates: LegalUpdateMeta;
}

export interface ClientContextProps {
  client: ClientConfig | null;
  loading: boolean;
}
