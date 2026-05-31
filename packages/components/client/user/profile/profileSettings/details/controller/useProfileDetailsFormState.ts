'use client';

import { useState } from 'react';
import type { UserAddress } from '../../../../../../../types';
import {
  buildFormState,
  createEmptySavedAddress,
} from '../helpers/profileDetails.form.helpers';
import type { AddressErrors, ProfileFormState } from '../types';

interface UseProfileDetailsFormStateArgs {
  profile?: {
    name?: string;
    phone?: string;
    primaryAddress?: UserAddress;
    savedAddresses?: { label?: string; address: UserAddress }[];
  } | null;
}

export function useProfileDetailsFormState({ profile }: UseProfileDetailsFormStateArgs) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSecondaryAddress, setIsAddingSecondaryAddress] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState<ProfileFormState>(() => buildFormState(profile));
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [primaryAddressErrors, setPrimaryAddressErrors] = useState<AddressErrors>({});
  const [savedAddressErrors, setSavedAddressErrors] = useState<AddressErrors[]>([]);

  const syncFormWithProfile = () => {
    setFormState(buildFormState(profile));
    setNameError('');
    setPhoneError('');
    setPrimaryAddressErrors({});
    setSavedAddressErrors([]);
  };

  const resetQuickAddState = () => {
    setIsAddingSecondaryAddress(false);
    setSavedAddressErrors([]);
    setFormState(buildFormState(profile));
  };

  const handleFieldChange = <K extends keyof ProfileFormState>(
    field: K,
    value: ProfileFormState[K]
  ) => {
    setFormState((current) => ({ ...current, [field]: value }));

    if (field === 'name') setNameError('');
    if (field === 'phone') setPhoneError('');
  };

  const handlePrimaryAddressChange = (value: UserAddress) => {
    setFormState((current) => ({ ...current, primaryAddress: value }));
    setPrimaryAddressErrors({});
  };

  const handleSavedAddressChange = (index: number, value: UserAddress) => {
    setFormState((current) => ({
      ...current,
      savedAddresses: current.savedAddresses.map((address, currentIndex) =>
        currentIndex === index ? { ...address, address: value } : address
      ),
    }));

    setSavedAddressErrors((current) =>
      current.map((entry, currentIndex) => (currentIndex === index ? {} : entry))
    );
  };

  const handleSavedAddressLabelChange = (index: number, value: string) => {
    setFormState((current) => ({
      ...current,
      savedAddresses: current.savedAddresses.map((address, currentIndex) =>
        currentIndex === index ? { ...address, label: value } : address
      ),
    }));
  };

  const handleAddSecondaryAddress = () => {
    setFormState((current) => ({
      ...current,
      savedAddresses: [...current.savedAddresses, createEmptySavedAddress()],
    }));
    setSavedAddressErrors((current) => [...current, {}]);
    setIsAddingSecondaryAddress(true);
  };

  const removeSecondaryAddress = (index: number) => {
    const isLastQuickAdd = isAddingSecondaryAddress && index === formState.savedAddresses.length - 1;

    setFormState((current) => ({
      ...current,
      savedAddresses: current.savedAddresses.filter((_, currentIndex) => currentIndex !== index),
    }));
    setSavedAddressErrors((current) =>
      current.filter((_, currentIndex) => currentIndex !== index)
    );

    if (isLastQuickAdd) {
      setIsAddingSecondaryAddress(false);
    }
  };

  return {
    isEditing,
    isAddingSecondaryAddress,
    saving,
    formState,
    nameError,
    phoneError,
    primaryAddressErrors,
    savedAddressErrors,
    setIsEditing,
    setIsAddingSecondaryAddress,
    setSaving,
    setNameError,
    setPhoneError,
    setPrimaryAddressErrors,
    setSavedAddressErrors,
    syncFormWithProfile,
    resetQuickAddState,
    handleFieldChange,
    handlePrimaryAddressChange,
    handleSavedAddressChange,
    handleSavedAddressLabelChange,
    handleAddSecondaryAddress,
    removeSecondaryAddress,
  };
}
