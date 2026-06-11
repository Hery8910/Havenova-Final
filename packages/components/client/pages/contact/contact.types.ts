import type { FooterHoursStatusCopy } from '../../footer/BusinessHoursStatus';
import type { PageHeroContent } from '../hero';

export interface ContactInfoAriaTexts {
  info: string;
  quickActions: string;
  call: string;
  email: string;
  whatsapp: string;
}

export interface ContactQuickActionTexts {
  call: string;
  email: string;
  whatsapp: string;
}

export interface ContactInfoTexts {
  contact: {
    title: string;
    email: string;
    phone: string;
    address: string;
  };
  hoursStatus?: FooterHoursStatusCopy;
  aria?: Partial<ContactInfoAriaTexts>;
  quickActions?: Partial<ContactQuickActionTexts>;
}

export interface ContactPageTexts {
  hero: PageHeroContent;
}
