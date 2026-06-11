import type { WorkAddress } from '../../../../../types/services';

export interface ServiceRequestWorkAddressSelection extends WorkAddress {
  source: 'primary' | 'saved' | 'new';
  saveToProfile?: boolean;
  label?: string;
}
