export interface ClientLegalUpdateEntry {
  version?: string;
  updatedAt?: string;
}

export interface ClientLegalUpdates {
  privacy?: ClientLegalUpdateEntry;
  cookies?: ClientLegalUpdateEntry;
  terms?: ClientLegalUpdateEntry;
}
export interface ClientSchedule {
  monday: { start: string; end: string };
  tuesday: { start: string; end: string };
  wednesday: { start: string; end: string };
  thursday: { start: string; end: string };
  friday: { start: string; end: string };
  saturday?: { start: string; end: string };
  sunday?: { start: string; end: string };
}

export interface ClientPublicConfig {
  _id: string;
  companyName: string;
  domain: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  legalUpdates: ClientLegalUpdates;
  schedule: ClientSchedule;
}

export interface ClientContextProps {
  client: ClientPublicConfig;
  loading: boolean;
}
