import {
  getMissingProfileFields,
  getProfileCompletionPercentage,
  getSelectableProfileAddresses,
  hasPrimaryAddress,
  isProfileComplete,
} from '../../../packages/components/client/user/profile/profileCompletionBadge/profileCompletion.helpers';

describe('profileCompletion.helpers', () => {
  const primaryAddress = {
    street: 'Main Street',
    streetNumber: '10',
    postalCode: '10115',
    district: 'Berlin',
    floor: '2',
  };

  it('reports all required fields when profile is missing', () => {
    expect(getMissingProfileFields(null)).toEqual(['name', 'phone', 'primaryAddress']);
    expect(isProfileComplete(null)).toBe(false);
    expect(hasPrimaryAddress(null)).toBe(false);
  });

  it('detects incomplete profiles field by field', () => {
    const profile = {
      name: '  Maria  ',
      phone: '',
      primaryAddress,
      savedAddresses: [],
    };

    expect(getMissingProfileFields(profile)).toEqual(['phone']);
    expect(getProfileCompletionPercentage(profile)).toBe(67);
    expect(isProfileComplete(profile)).toBe(false);
    expect(hasPrimaryAddress(profile)).toBe(true);
  });

  it('builds selectable addresses from primary and secondary addresses', () => {
    const profile = {
      name: 'Maria',
      phone: '+49 157 12345678',
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
    };

    expect(isProfileComplete(profile)).toBe(true);
    expect(getProfileCompletionPercentage(profile)).toBe(100);
    expect(getSelectableProfileAddresses(profile)).toEqual([
      {
        id: 'primary',
        source: 'primary',
        address: primaryAddress,
        isPrimary: true,
      },
      {
        id: 'saved-0',
        source: 'saved',
        address: profile.savedAddresses[0].address,
        savedLabel: 'Parents',
        isPrimary: false,
      },
    ]);
  });
});
