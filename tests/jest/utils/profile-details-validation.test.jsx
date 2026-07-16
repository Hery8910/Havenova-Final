import { validateProfileDetailsForm } from '../../../packages/components/client/user/profile/profileSettings/details/controller/profileDetails.validation';

describe('validateProfileDetailsForm', () => {
  const formTexts = {
    error: {
      name: {
        invalid: 'Invalid name',
        required: 'Name is required',
      },
      phone: {
        invalid: 'Invalid phone',
        required: 'Phone is required',
      },
    },
    button: {
      edit: 'Save',
    },
  };

  const detailTexts = {
    form: {
      errors: {
        required: 'This field is required.',
      },
    },
  };

  it('returns required errors for missing identity and address fields', () => {
    const result = validateProfileDetailsForm({
      formState: {
        name: '',
        phone: '',
        primaryAddress: {
          street: '',
          streetNumber: '',
          postalCode: '',
          district: '',
          floor: '',
        },
        savedAddresses: [],
      },
      formTexts,
      detailTexts,
    });

    expect(result.nameError).toBe('Name is required');
    expect(result.phoneError).toBe('Phone is required');
    expect(result.primaryAddressErrors).toEqual({
      street: 'This field is required.',
      streetNumber: 'This field is required.',
      postalCode: 'This field is required.',
      district: 'This field is required.',
    });
    expect(result.hasErrors).toBe(true);
  });

  it('validates invalid identity fields and each saved secondary address', () => {
    const result = validateProfileDetailsForm({
      formState: {
        name: '1',
        phone: 'abc',
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
              street: '',
              streetNumber: '5',
              postalCode: '',
              district: 'Hamburg',
              floor: '',
            },
          },
        ],
      },
      formTexts,
      detailTexts,
    });

    expect(result.nameError).toBe('Invalid name');
    expect(result.phoneError).toBe('Invalid phone');
    expect(result.savedAddressErrors).toEqual([
      {
        street: 'This field is required.',
        streetNumber: '',
        postalCode: 'This field is required.',
        district: '',
      },
    ]);
    expect(result.hasErrors).toBe(true);
  });

  it('returns a clean result for a valid form state', () => {
    const result = validateProfileDetailsForm({
      formState: {
        name: "María O'Neill",
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
      },
      formTexts,
      detailTexts,
    });

    expect(result).toEqual({
      nameError: '',
      phoneError: '',
      primaryAddressErrors: {
        street: '',
        streetNumber: '',
        postalCode: '',
        district: '',
      },
      savedAddressErrors: [
        {
          street: '',
          streetNumber: '',
          postalCode: '',
          district: '',
        },
      ],
      hasErrors: false,
    });
  });
});
