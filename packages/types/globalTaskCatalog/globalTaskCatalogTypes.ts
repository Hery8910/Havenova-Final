export type ApiResponse<T> = {
  success: boolean;
  code: 'CATALOG_FOUND';
  data: T;
};

export type CatalogTotals = {
  bundles: number;
  steps: number;
  billables: number;
};

export type CatalogBundleSummary = {
  bundleId: string;
  title: string;
  recurrence: string;
  area: string;
  stepsCount: number;
  billablesCount: number;
  isActive: boolean;
};

export type CatalogBundleSchedule = {
  frequency: string;
  intervalWeeks: number;
  anchorIsoWeek: number;
  note: string;
};

export type CatalogBundlePricing = {
  currency: string;
  clientGross: number;
  partnerGross: number;
  taxRatePct: number;
};

export type CatalogBundleStep = {
  _id: string;
  title: string;
  description: string;
  requirement: string;
  billable: boolean;
  sortOrder: number;
  isActive: boolean;
};

export type CatalogBundleDetail = {
  bundleId: string;
  title: string;
  description: string;
  recurrenceKey: string;
  areaKey: string;
  schedule: CatalogBundleSchedule;
  bundlePricing: CatalogBundlePricing;
  steps: CatalogBundleStep[];
  stepsCount: number;
  billablesCount: number;
  isActive: boolean;
  sortOrder: number;
  tags: string[];
  _id: string;
};

export type GlobalTaskCatalogSummary = {
  catalogId: string;
  name: string;
  version: number;
  isActive: boolean;
  totals: CatalogTotals;
  bundles: CatalogBundleSummary[];
  createdAt: string;
  updatedAt: string;
};
