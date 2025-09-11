export interface Logos {
    main: string;
    mainDark?: string;
    alt?: string;
    favicon?: string;
}
export interface Typography {
    fontFamily: string;
    isGoogleFont: boolean;
    googleFontUrl?: string;
    weights?: string[];
    secondaryFontFamily?: string;
}
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
    [day: string]: {
        start: string;
        end: string;
    };
}
export interface Texts {
    [lang: string]: any;
}
export interface LegalUpdateEntry {
    policy: 'privacy' | 'cookies' | 'terms';
    date: string;
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
//# sourceMappingURL=client.d.ts.map