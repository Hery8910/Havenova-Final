import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import WorkAddressSelector from '../../../packages/components/client/pages/shared/serviceRequest/WorkAddressSelector/WorkAddressSelector';

const mockUseProfile = jest.fn();

jest.mock('../../../packages/contexts', () => ({
  useProfile: () => mockUseProfile(),
}));

describe('WorkAddressSelector', () => {
  const primaryAddress = {
    street: 'Main Street',
    streetNumber: '10',
    postalCode: '10115',
    district: 'Berlin',
    floor: '',
  };

  beforeEach(() => {
    mockUseProfile.mockReset();
    mockUseProfile.mockReturnValue({
      loading: false,
      profile: {
        primaryAddress,
        savedAddresses: [
          {
            label: 'Parents',
            address: {
              street: 'Second Street',
              streetNumber: '5',
              postalCode: '20095',
              district: 'Hamburg',
              floor: '',
            },
          },
        ],
      },
    });
  });

  it('selects the primary address by default when profile addresses exist', async () => {
    const onChange = jest.fn();

    render(<WorkAddressSelector value={null} onChange={onChange} />);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        address: {
          ...primaryAddress,
          floor: undefined,
        },
        source: 'primary',
        label: undefined,
      });
    });

    expect(screen.getByRole('radio', { name: /primary address/i })).toBeChecked();
  });

  it('lets the user switch to another saved address', async () => {
    const onChange = jest.fn();

    render(<WorkAddressSelector value={null} onChange={onChange} />);

    fireEvent.click(screen.getByRole('radio', { name: /parents/i }));

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        address: {
          street: 'Second Street',
          streetNumber: '5',
          postalCode: '20095',
          district: 'Hamburg',
          floor: undefined,
        },
        source: 'saved',
        label: 'Parents',
      });
    });
  });

  it('emits a new manual address and keeps the request label even when not saving to profile', async () => {
    const onChange = jest.fn();

    render(<WorkAddressSelector value={null} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /use a different address/i }));

    fireEvent.change(screen.getByLabelText(/^label$/i), {
      target: { value: 'Warehouse access' },
    });
    fireEvent.change(screen.getByLabelText(/^street$/i), {
      target: { value: 'Third Street' },
    });
    fireEvent.change(screen.getByLabelText(/^number$/i), {
      target: { value: '22B' },
    });
    fireEvent.change(screen.getByLabelText(/^postal code$/i), {
      target: { value: '50667' },
    });
    fireEvent.change(screen.getByLabelText(/^district$/i), {
      target: { value: 'Cologne' },
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        address: {
          street: 'Third Street',
          streetNumber: '22B',
          postalCode: '50667',
          district: 'Cologne',
          floor: undefined,
        },
        source: 'new',
        saveToProfile: false,
        label: 'Warehouse access',
      });
    });
  });
});
