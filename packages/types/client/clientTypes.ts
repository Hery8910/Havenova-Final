import type { WeeklySchedule } from '../calendar';
import type { ApiResponse } from '../api';

export const CLIENT_MODULES = ['homeServices', 'rideHailing', 'restaurant'] as const;
export type ClientModuleName = (typeof CLIENT_MODULES)[number];

export const HOME_SERVICES_FEATURES = [
  'profile',
  'workers',
  'companies',
  'buildings',
  'requirements',
  'annualPlans',
  'workOrders',
  'propertyManagers',
  'globalTaskCatalog',
  'serviceRequests',
  'taskPlans',
  'inspections',
  'offers',
  'workerAssignments',
  'calendar',
  'automation',
  'reports',
] as const;

export type HomeServicesFeatureKey = (typeof HOME_SERVICES_FEATURES)[number];

export type ClientStatus = 'active' | 'trial' | 'inactive' | 'suspended' | 'archived';
export type BillingStatus = 'active' | 'paused' | 'cancelled';
export type OnboardingStatus = 'pending' | 'in_progress' | 'completed';
export type LegalDocumentType = 'privacy' | 'cookies' | 'terms';

export interface ClientDaySchedule {
  start: string;
  end: string;
}

export interface ClientWeeklySchedule {
  monday: ClientDaySchedule;
  tuesday: ClientDaySchedule;
  wednesday: ClientDaySchedule;
  thursday: ClientDaySchedule;
  friday: ClientDaySchedule;
  saturday: ClientDaySchedule;
  sunday: ClientDaySchedule;
}

export interface HomeServicesConfig {
  calendarId?: string;
  slotDurationMinutes?: number;
  serviceTypesEnabled?: string[];
  requiresInspection?: boolean;
  serviceZone?: {
    active: boolean;
    allowedRegions?: string[];
    center?: { lat: number; lng: number };
    maxDistanceKm?: number;
  };
  autoAssignWorkers?: boolean;
  requestApprovalMode?: 'manual' | 'automatic';
}

export interface LegalSingleUpdate {
  version: string;
  updatedAt: Date | string;
}

export interface LegalHistoryEntry {
  type: LegalDocumentType;
  version: string;
  updatedAt: Date | string;
}

export interface ClientModuleAccess<
  TFeature extends string = string,
  TConfig = Record<string, unknown>,
> {
  enabled: boolean;
  features: Record<TFeature, boolean>;
  config?: TConfig;
}

export interface ClientIdentity {
  companyName: string;
  displayName?: string;
  legalName?: string;
  contactEmail: string;
  phone: string;
  address: string;
  emails?: {
    info?: string;
    support?: string;
    billing?: string;
    noReply?: string;
  };
}

export interface ClientPublicProfile {
  domains: {
    primary: string;
    dashboard?: string;
    customDomains?: string[];
  };
  branding: {
    colors: {
      primary: string;
      secondary?: string;
      accent?: string;
    };
    ui?: {
      textPrimary?: string;
      textSecondary?: string;
      background?: string;
      surface?: string;
      border?: string;
      link?: string;
    };
    email?: {
      background?: string;
      containerBackground?: string;
      headlineColor?: string;
      bodyTextColor?: string;
      mutedTextColor?: string;
      eyebrowColor?: string;
      linkColor?: string;
      dividerColor?: string;
      buttonBackground?: string;
      buttonTextColor?: string;
      footerTextColor?: string;
      footerMetaColor?: string;
      logoVariant?: 'primary' | 'primaryDark' | 'compact' | 'compactDark';
      footerLogoVariant?: 'primary' | 'primaryDark' | 'compact' | 'compactDark';
      headerImageVariant?: 'none' | 'emailHeader' | 'backgroundImage';
    };
  };
  logos: {
    primary: string;
    primaryDark?: string;
    compact?: string;
    compactDark?: string;
    favicon?: string;
    faviconDark?: string;
  };
  assets: {
    email?: {
      headerImage?: string;
      heroImage?: string;
    };
    dashboard?: {
      backgroundImage?: string;
      coverImages?: string[];
    };
    shared?: {
      gallery?: string[];
      documents?: string[];
    };
  };
}

export interface ClientOperations {
  schedule: ClientWeeklySchedule;
  availabilityMessage?: string;
}

export interface ClientModules {
  homeServices?: ClientModuleAccess<HomeServicesFeatureKey, HomeServicesConfig>;
  rideHailing?: ClientModuleAccess;
  restaurant?: ClientModuleAccess;
}

export interface ClientBilling {
  plan: string;
  pricePerMonth: number;
  currency: string;
  paymentMethod: string;
  renewalDate?: Date | string;
  contractType?: string;
  trialEndsAt?: Date | string;
  status: BillingStatus;
}

export interface ClientLegal {
  pages: {
    privacy?: string;
    cookies?: string;
    terms?: string;
    impressum?: string;
  };
  updates: {
    privacy?: LegalSingleUpdate;
    cookies?: LegalSingleUpdate;
    terms?: LegalSingleUpdate;
    history?: LegalHistoryEntry[];
  };
}

export interface ClientInternal {
  owner?: string | null;
  createdBy: string;
  notes?: string;
  tags?: string[];
  onboardingStatus?: OnboardingStatus;
}

export interface ClientPlatform {
  status: ClientStatus;
  tenantKey: string;
  lookupAliases?: string[];
  ownerUserId?: string | null;
  featureFlags?: string[];
  suspendedAt?: Date | string;
  archivedAt?: Date | string;
}

export interface ClientDocument {
  _id: string;
  identity: ClientIdentity;
  publicProfile: ClientPublicProfile;
  operations: ClientOperations;
  modules: ClientModules;
  billing: ClientBilling;
  legal: ClientLegal;
  internal: ClientInternal;
  platform: ClientPlatform;
}

export interface ClientPublicView {
  _id: string;
  identity: ClientIdentity;
  publicProfile: ClientPublicProfile;
  operations: ClientOperations;
  modules: ClientModules;
  legal: ClientLegal;
}

export interface ClientTenantBootstrapView {
  _id: string;
  identity: ClientIdentity;
  operations: ClientOperations;
  modules: ClientModules;
}

export interface ClientDashboardView extends ClientPublicView {
  billing: ClientBilling;
}

export interface ClientAdminView extends ClientDashboardView {
  internal: ClientInternal;
  platform: ClientPlatform;
}

export interface ClientRequestContext {
  _id: string;
  platform: {
    status: ClientStatus | string;
    tenantKey: string;
  };
  modules: ClientModules;
}

export type ClientLegalUpdates = ClientLegal['updates'];

export type ClientSchedule = WeeklySchedule;

// Tenant bootstrap is the canonical public client payload. Keep the legacy alias
// while some frontend consumers still import ClientPublicConfig.
export type ClientBootstrapConfig = ClientTenantBootstrapView &
  Partial<Pick<ClientPublicView, 'publicProfile' | 'legal'>>;

export type ClientPublicConfig = ClientBootstrapConfig;
export type ClientBootstrapResponse = ApiResponse<ClientBootstrapConfig>;
export type ClientDashboardResponse = ApiResponse<ClientDashboardView>;

export interface ClientContextProps {
  client: ClientBootstrapConfig;
  loading: boolean;
}
