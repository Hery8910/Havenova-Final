import { GlobalTaskCatalogSummary } from '@/packages/types';

export const mockGlobalTaskCatalog: GlobalTaskCatalogSummary = {
  catalogId: '65f1c4f12ed9',
  name: 'Global Task Catalog',
  version: 3,
  isActive: true,
  totals: {
    bundles: 12,
    steps: 248,
    billables: 40,
  },
  bundles: [
    {
      bundleId: '66a1b3a1f2',
      title: 'Treppenhaus',
      recurrence: 'weekly',
      area: 'staircase',
      stepsCount: 12,
      billablesCount: 2,
      isActive: true,
    },
    {
      bundleId: '66a1b3a1f3',
      title: 'Lobby',
      recurrence: 'daily',
      area: 'entryway',
      stepsCount: 8,
      billablesCount: 1,
      isActive: true,
    },
    {
      bundleId: '66a1b3a1f4',
      title: 'Elevators',
      recurrence: 'weekly',
      area: 'elevators',
      stepsCount: 6,
      billablesCount: 0,
      isActive: false,
    },
  ],
  createdAt: '2026-01-01T10:20:00.000Z',
  updatedAt: '2026-01-01T10:20:00.000Z',
};
