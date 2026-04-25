import type {
  ClientBootstrapConfig,
  HomeServicesFeatureKey,
} from '../../types/client/clientTypes';
import { HOME_SERVICES_FEATURES } from '../../types/client/clientTypes';

const DEFAULT_SCHEDULE = {
  monday: { start: '08:00', end: '18:00' },
  tuesday: { start: '08:00', end: '18:00' },
  wednesday: { start: '08:00', end: '18:00' },
  thursday: { start: '08:00', end: '18:00' },
  friday: { start: '08:00', end: '18:00' },
  saturday: { start: '09:00', end: '14:00' },
  sunday: { start: '09:00', end: '14:00' },
} as const;

const HOME_SERVICES_FEATURE_FLAGS = Object.fromEntries(
  HOME_SERVICES_FEATURES.map((feature) => [feature, true])
) as Record<HomeServicesFeatureKey, boolean>;

export function createVisualFallbackClient(
  tenantKey: string = 'tnk_visual_fallback'
): ClientBootstrapConfig {
  return {
    _id: 'client_visual_fallback',
    identity: {
      companyName: 'Havenova Visual Fallback',
      displayName: 'Havenova',
      contactEmail: 'info@havenova.de',
      phone: '+49 000 000000',
      address: 'Visual fallback client',
    },
    operations: {
      schedule: DEFAULT_SCHEDULE,
      availabilityMessage: 'Visual fallback mode',
    },
    modules: {
      homeServices: {
        enabled: true,
        features: HOME_SERVICES_FEATURE_FLAGS,
        config: {
          slotDurationMinutes: 60,
          serviceTypesEnabled: ['cleaning', 'maintenance'],
          requiresInspection: false,
          requestApprovalMode: 'manual',
        },
      },
    },
    publicProfile: {
      domains: {
        primary: 'fallback.local',
      },
      branding: {
        colors: {
          primary: '#0768C9',
          secondary: '#0F172A',
        },
      },
      logos: {
        primary: '/logos/logo-dark.webp',
        primaryDark: '/logos/logo-light.webp',
        compact: '/logos/logo-small-dark.webp',
        compactDark: '/logos/logo-small-light.webp',
      },
      assets: {},
    },
    legal: {
      pages: {},
      updates: {},
    },
  };
}
