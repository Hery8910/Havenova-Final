import { act, renderHook } from '@testing-library/react';

import { useProfileDetailsFormState } from '../../../packages/components/client/user/profile/profileSettings/details/controller/useProfileDetailsFormState';

describe('useProfileDetailsFormState', () => {
  const profile = {
    name: 'Maria',
    phone: '+49 157 12345678',
    primaryAddress: {
      street: 'Main Street',
      streetNumber: '10',
      postalCode: '10115',
      district: 'Berlin',
      floor: '',
    },
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
  };

  it('initializes from the profile and can sync back to it', () => {
    const { result } = renderHook(() => useProfileDetailsFormState({ profile }));

    expect(result.current.formState.name).toBe('Maria');
    expect(result.current.formState.savedAddresses).toHaveLength(1);

    act(() => {
      result.current.handleFieldChange('name', 'Changed');
      result.current.setNameError('Invalid');
      result.current.syncFormWithProfile();
    });

    expect(result.current.formState.name).toBe('Maria');
    expect(result.current.nameError).toBe('');
    expect(result.current.selectedSavedAddressIndex).toBeNull();
  });

  it('adds a quick secondary address and focuses the new entry', () => {
    const { result } = renderHook(() => useProfileDetailsFormState({ profile }));

    act(() => {
      result.current.handleAddSecondaryAddress();
    });

    expect(result.current.isAddingSecondaryAddress).toBe(true);
    expect(result.current.selectedSavedAddressIndex).toBe(1);
    expect(result.current.formState.savedAddresses).toHaveLength(2);
    expect(result.current.savedAddressErrors).toEqual([{}]);
  });

  it('removes secondary addresses and keeps selection/indexes consistent', () => {
    const { result } = renderHook(() => useProfileDetailsFormState({ profile }));

    act(() => {
      result.current.handleAddSecondaryAddress();
    });

    act(() => {
      result.current.removeSecondaryAddress(1);
    });

    expect(result.current.isAddingSecondaryAddress).toBe(false);
    expect(result.current.formState.savedAddresses).toHaveLength(1);
    expect(result.current.selectedSavedAddressIndex).toBe(0);
  });

  it('updates saved address labels and clears per-address errors on address change', () => {
    const { result } = renderHook(() => useProfileDetailsFormState({ profile }));

    act(() => {
      result.current.setSavedAddressErrors([{ street: 'Required' }]);
      result.current.handleSavedAddressLabelChange(0, 'Office');
      result.current.handleSavedAddressChange(0, {
        street: 'Updated Street',
        streetNumber: '7',
        postalCode: '50667',
        district: 'Cologne',
        floor: '',
      });
    });

    expect(result.current.formState.savedAddresses[0].label).toBe('Office');
    expect(result.current.formState.savedAddresses[0].address.street).toBe('Updated Street');
    expect(result.current.savedAddressErrors).toEqual([{}]);
  });
});
