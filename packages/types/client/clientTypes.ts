import type { WeeklySchedule } from '../calendar';

export interface ClientLegalUpdateEntry {
  version?: string;
  updatedAt?: string;
}

export interface ClientLegalUpdates {
  privacy?: ClientLegalUpdateEntry;
  cookies?: ClientLegalUpdateEntry;
  terms?: ClientLegalUpdateEntry;
}

export type ClientSchedule = WeeklySchedule;

export interface ClientPublicConfig {
  _id: string;
  companyName: string;
  domain: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  legalUpdates: ClientLegalUpdates;
  schedule: ClientSchedule;
  slotDurationMinutes: number;
}

export interface ClientContextProps {
  client: ClientPublicConfig;
  loading: boolean;
}
