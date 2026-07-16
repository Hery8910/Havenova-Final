import {
  buildAddressOptions,
  formatAddressLabel,
  isSameWorkAddressSelection,
  normalizeAddress,
} from '../../../packages/components/client/pages/shared/serviceRequest/WorkAddressSelector/workAddressHelpers';

describe('workAddressHelpers', () => {
  it('normalizes addresses before persistence', () => {
    expect(
      normalizeAddress({
        street: '  Main Street ',
        streetNumber: ' 10 ',
        postalCode: ' 10115 ',
        district: ' Berlin ',
        floor: ' 2 ',
      })
    ).toEqual({
      street: 'Main Street',
      streetNumber: '10',
      postalCode: '10115',
      district: 'Berlin',
      floor: '2',
    });
  });

  it('formats condensed address labels for cards', () => {
    expect(
      formatAddressLabel({
        street: 'Main Street',
        streetNumber: '10',
        postalCode: '10115',
        district: 'Berlin',
        floor: '',
      })
    ).toBe('Main Street, 10, 10115, Berlin');
  });

  it('compares work address selections including source, label, and save flag', () => {
    const baseAddress = {
      street: 'Main Street',
      streetNumber: '10',
      postalCode: '10115',
      district: 'Berlin',
      floor: '',
    };

    expect(
      isSameWorkAddressSelection(
        {
          source: 'new',
          address: baseAddress,
          label: 'Office',
          saveToProfile: true,
        },
        {
          source: 'new',
          address: { ...baseAddress },
          label: 'Office',
          saveToProfile: true,
        }
      )
    ).toBe(true);

    expect(
      isSameWorkAddressSelection(
        {
          source: 'new',
          address: baseAddress,
          label: 'Office',
          saveToProfile: true,
        },
        {
          source: 'new',
          address: { ...baseAddress },
          label: 'Warehouse',
          saveToProfile: true,
        }
      )
    ).toBe(false);
  });

  it('builds options with primary address first and saved addresses after it', () => {
    const options = buildAddressOptions(
      {
        street: 'Main Street',
        streetNumber: '10',
        postalCode: '10115',
        district: 'Berlin',
        floor: '',
      },
      [
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
      ]
    );

    expect(options.map((option) => option.id)).toEqual(['primary', 'saved-0']);
    expect(options[1].savedLabel).toBe('Parents');
  });
});
