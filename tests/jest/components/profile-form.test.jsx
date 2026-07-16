import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import { FormWrapper } from '../../../packages/components/client/user/profile';
import { renderWithAppProviders } from '../utils/test-providers';

describe('Profile form', () => {
  it('renders without AuthContext and only exposes profile fields', async () => {
    renderWithAppProviders(
      <FormWrapper
        fields={['name', 'phone']}
        onSubmit={jest.fn()}
        button="Save"
        initialValues={{
          name: '',
          phone: '',
        }}
        loading={false}
      />,
      { language: 'en' }
    );

    expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  it('moves focus to the first invalid field and shows an error summary', async () => {
    renderWithAppProviders(
      <FormWrapper
        fields={['name', 'phone']}
        onSubmit={jest.fn()}
        button="Save"
        initialValues={{
          name: '',
          phone: '',
        }}
        loading={false}
      />,
      { language: 'en' }
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /please review the highlighted fields/i
    );
    expect(screen.getByLabelText(/name/i)).toHaveFocus();
  });

  it('submits valid profile values', async () => {
    const onSubmit = jest.fn();

    renderWithAppProviders(
      <FormWrapper
        fields={['name', 'phone']}
        onSubmit={onSubmit}
        button="Save"
        initialValues={{
          name: '',
          phone: '',
        }}
        loading={false}
      />,
      { language: 'en' }
    );

    fireEvent.change(await screen.findByLabelText(/name/i), {
      target: { value: "maría-josé o'neill" },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '+49 157 12345678' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "maría-josé o'neill",
      phone: '+49 157 12345678',
    });
  });
});
