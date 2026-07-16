import React from 'react';
import { act, renderHook } from '@testing-library/react';

import { useAlertBase } from '../../../packages/contexts/alert/useAlert';

describe('useAlertBase', () => {
  it('preserves confirm handlers on error alerts and applies default close label', () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useAlertBase());

    act(() => {
      result.current.showError({
        response: {
          status: 500,
          title: 'Unexpected error',
          description: 'Something failed.',
        },
        onConfirm,
      });
    });

    expect(result.current.alert).toMatchObject({
      response: {
        status: 500,
        title: 'Unexpected error',
        description: 'Something failed.',
        cancelLabel: 'Close',
      },
      onConfirm,
    });
  });

  it('creates confirm alerts with both CTAs and closes correctly', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const { result } = renderHook(() => useAlertBase());

    act(() => {
      result.current.showConfirm({
        response: {
          status: 403,
          title: 'Access forbidden',
          description: 'You do not have permission.',
          confirmLabel: 'Go to home',
          cancelLabel: 'Close',
        },
        onConfirm,
        onCancel,
      });
    });

    expect(result.current.alert).toMatchObject({
      response: {
        status: 403,
        title: 'Access forbidden',
        description: 'You do not have permission.',
        confirmLabel: 'Go to home',
        cancelLabel: 'Close',
      },
      onConfirm,
      onCancel,
    });

    act(() => {
      result.current.closeAlert();
    });

    expect(result.current.alert).toBeNull();
  });
});
