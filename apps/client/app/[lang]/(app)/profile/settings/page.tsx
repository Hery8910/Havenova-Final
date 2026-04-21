'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useProfile } from '@/packages/contexts/profile/ProfileContext';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';

import {
  ProfileCompletionBadge,
  UserPreferencesCard,
  UserProfileDetailsForm,
  UserProfileDetailsSummary,
} from '../../../../../../../packages/components';
import {
  UpdateUserClientProfileInput,
  UserAddress,
  UserSavedAddress,
} from '../../../../../../../packages/types';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackPopups,
  useAuth,
  useGlobalAlert,
} from '../../../../../../../packages/contexts';
import { getPopup, validateName, validatePhone } from '../../../../../../../packages/utils';
import type {
  AddressErrors,
  ProfileDetailsTexts,
  ProfileFormState,
} from '../../../../../../../packages/components/client/user/profile/userProfileDetailsManager/types';

export interface UserProfileDetailsManagerProps {
  onCancel?: () => void;
  onAddressClick?: (address: UserAddress) => void;
}

const createEmptyAddress = (): UserAddress => ({
  street: '',
  streetNumber: '',
  postalCode: '',
  district: '',
  floor: '',
});

const toFormAddress = (address?: UserAddress): UserAddress => ({
  street: address?.street ?? '',
  streetNumber: address?.streetNumber ?? '',
  postalCode: address?.postalCode ?? '',
  district: address?.district ?? '',
  floor: address?.floor ?? '',
});

const normalizeAddress = (address: UserAddress): UserAddress => ({
  street: address.street.trim(),
  streetNumber: address.streetNumber.trim(),
  postalCode: address.postalCode.trim(),
  district: address.district.trim(),
  floor: address.floor?.trim() || '',
});

const isAddressComplete = (address?: UserAddress) =>
  Boolean(
    address?.street?.trim() &&
    address?.streetNumber?.trim() &&
    address?.postalCode?.trim() &&
    address?.district?.trim()
  );

const isProfileComplete = (profile: ReturnType<typeof useProfile>['profile']) =>
  Boolean(
    profile?.name?.trim() && profile?.phone?.trim() && isAddressComplete(profile?.primaryAddress)
  );

const buildFormState = (profile: ReturnType<typeof useProfile>['profile']): ProfileFormState => ({
  name: profile?.name ?? '',
  phone: profile?.phone ?? '',
  primaryAddress: toFormAddress(profile?.primaryAddress),
  savedAddresses: (profile?.savedAddresses ?? []).map((entry) => toFormAddress(entry.address)),
});

const toSavedAddressPayload = (
  savedAddresses: UserAddress[],
  fallbackLabel: string
): UserSavedAddress[] =>
  savedAddresses.filter(isAddressComplete).map((address, index) => ({
    label: `${fallbackLabel} ${index + 1}`,
    address: normalizeAddress(address),
  }));

export default function Edit() {
  const { texts } = useI18n();
  const { profile, updateProfile, reloadProfile } = useProfile();
  const { auth } = useAuth();
  const { showError, showSuccess, showLoading, showConfirm, closeAlert } = useGlobalAlert();
  const popups = texts.popups;
  const loadingText = texts.loadings?.message;
  const formTexts = texts.components.client.form;
  const detailTexts: ProfileDetailsTexts = texts?.pages?.client?.user?.profile?.details;
  const labels = texts.pages.client.user.profileHeader;
  const profileTexts = texts.pages.client.user.profile;

  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSecondaryAddress, setIsAddingSecondaryAddress] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState<ProfileFormState>(() => buildFormState(profile));
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [primaryAddressErrors, setPrimaryAddressErrors] = useState<AddressErrors>({});
  const [savedAddressErrors, setSavedAddressErrors] = useState<AddressErrors[]>([]);

  const secondaryAddressLabel = detailTexts?.labels?.additionalAddress ?? 'Additional address';
  const emptyValue = detailTexts?.emptyValue ?? 'Not provided';
  const profileCompleted = isProfileComplete(profile);
  const showFullForm = !profileCompleted || isEditing;

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
    setFormState((current) => ({
      ...current,
      savedAddresses: (profile?.savedAddresses ?? []).map((entry) => toFormAddress(entry.address)),
    }));
  };

  const handleStartEditing = () => {
    syncFormWithProfile();
    setIsAddingSecondaryAddress(false);
    setIsEditing(true);
  };

  const handleStartSecondaryAddress = () => {
    if (isAddingSecondaryAddress) return;

    syncFormWithProfile();
    setFormState((current) => ({
      ...current,
      savedAddresses: [...current.savedAddresses, createEmptyAddress()],
    }));
    setSavedAddressErrors((current) => [...current, {}]);
    setIsAddingSecondaryAddress(true);
  };

  const handleCancel = () => {
    syncFormWithProfile();
    setIsEditing(false);
    resetQuickAddState();
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
        currentIndex === index ? value : address
      ),
    }));

    setSavedAddressErrors((current) =>
      current.map((entry, currentIndex) => (currentIndex === index ? {} : entry))
    );
  };

  const handleAddSecondaryAddress = () => {
    setFormState((current) => ({
      ...current,
      savedAddresses: [...current.savedAddresses, createEmptyAddress()],
    }));
    setSavedAddressErrors((current) => [...current, {}]);
    setIsAddingSecondaryAddress(true);
  };

  const handleRemoveSecondaryAddress = (index: number) => {
    const confirmPopup = getPopup(
      popups,
      'PROFILE_ADDRESS_DELETE_CONFIRM',
      'PROFILE_ADDRESS_DELETE_CONFIRM',
      {
        title: 'Delete address?',
        description: 'This action is permanent. The address cannot be recovered after deletion.',
        confirm: 'Delete address',
        close: 'Cancel',
      }
    );

    showConfirm({
      response: {
        status: 400,
        title: confirmPopup.title,
        description: confirmPopup.description,
        confirmLabel: confirmPopup.confirm ?? 'Delete address',
        cancelLabel: confirmPopup.close ?? texts.popups?.button?.close,
      },
      onConfirm: () => {
        const isLastQuickAdd =
          isAddingSecondaryAddress && index === formState.savedAddresses.length - 1;

        closeAlert();
        setFormState((current) => ({
          ...current,
          savedAddresses: current.savedAddresses.filter(
            (_, currentIndex) => currentIndex !== index
          ),
        }));
        setSavedAddressErrors((current) =>
          current.filter((_, currentIndex) => currentIndex !== index)
        );

        if (isLastQuickAdd) {
          setIsAddingSecondaryAddress(false);
        }
      },
      onCancel: closeAlert,
    });
  };

  const validateAddress = (address: UserAddress): AddressErrors => {
    const requiredMessage = detailTexts?.form?.errors?.required ?? 'This field is required.';
    const normalized = normalizeAddress(address);

    return {
      street: normalized.street ? '' : requiredMessage,
      streetNumber: normalized.streetNumber ? '' : requiredMessage,
      postalCode: normalized.postalCode ? '' : requiredMessage,
      district: normalized.district ? '' : requiredMessage,
    };
  };

  const submitProfileUpdate = async (payload: UpdateUserClientProfileInput) => {
    try {
      setSaving(true);

      const loadingData = loadingText.createUser;
      showLoading({
        response: {
          status: 102,
          title: loadingData.title,
          description: loadingData.description,
        },
      });

      await updateProfile(payload);
      await reloadProfile();

      const successPopup = getPopup(
        popups,
        'AUTH_GET_SUCCESS',
        'AUTH_GET_SUCCESS',
        fallbackPopups.AUTH_GET_SUCCESS
      );

      showSuccess({
        response: {
          status: 200,
          title: successPopup.title,
          description: successPopup.description,
          cancelLabel: texts.popups?.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });

      setIsEditing(false);
      setIsAddingSecondaryAddress(false);
    } catch {
      const errorPopup = getPopup(
        popups,
        'GLOBAL_INTERNAL_ERROR',
        'GLOBAL_INTERNAL_ERROR',
        fallbackGlobalError
      );

      showError({
        response: {
          status: 500,
          title: errorPopup.title,
          description: errorPopup.description,
          cancelLabel: errorPopup.close ?? texts.popups?.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFullSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextNameError = formState.name.trim()
      ? validateName(formState.name)[0]
        ? formTexts.error.name.invalid
        : ''
      : formTexts.error.name.required;
    const nextPhoneError = formState.phone.trim()
      ? validatePhone(formState.phone)[0]
        ? formTexts.error.phone.invalid
        : ''
      : formTexts.error.phone.required;
    const nextPrimaryAddressErrors = validateAddress(formState.primaryAddress);
    const nextSavedAddressErrors = formState.savedAddresses.map(validateAddress);

    setNameError(nextNameError);
    setPhoneError(nextPhoneError);
    setPrimaryAddressErrors(nextPrimaryAddressErrors);
    setSavedAddressErrors(nextSavedAddressErrors);

    const hasAddressErrors = [
      ...Object.values(nextPrimaryAddressErrors),
      ...nextSavedAddressErrors.flatMap((entry) => Object.values(entry)),
    ].some(Boolean);

    if (nextNameError || nextPhoneError || hasAddressErrors) return;

    await submitProfileUpdate({
      name: formState.name.trim(),
      phone: formState.phone.trim(),
      primaryAddress: normalizeAddress(formState.primaryAddress),
      savedAddresses: toSavedAddressPayload(formState.savedAddresses, secondaryAddressLabel),
    });
  };

  const handleQuickAddSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const latestAddress = formState.savedAddresses[formState.savedAddresses.length - 1];
    if (!latestAddress) return;

    const nextSavedAddressErrors = formState.savedAddresses.map((address, index) =>
      index === formState.savedAddresses.length - 1 ? validateAddress(address) : {}
    );

    setSavedAddressErrors(nextSavedAddressErrors);

    const hasErrors = Object.values(
      nextSavedAddressErrors[nextSavedAddressErrors.length - 1] ?? {}
    ).some(Boolean);
    if (hasErrors) return;

    const existingAddresses = (profile?.savedAddresses ?? []).map((entry) => entry.address);

    await submitProfileUpdate({
      savedAddresses: toSavedAddressPayload(
        [...existingAddresses, latestAddress],
        secondaryAddressLabel
      ),
    });
  };

  return (
    <section className={`${styles.section} card`}>
      <header className={styles.header}>
        <h2 className={styles.title}>{profileTexts?.title ?? 'Account settings'}</h2>
        <p className={styles.description}>
          {profileTexts?.manageAccount ?? 'Manage your account information and preferences'}
        </p>
      </header>
      <>
        <UserProfileDetailsSummary onEdit={handleStartEditing} />

        {isEditing && (
          <UserProfileDetailsForm
            mode="full"
            formState={formState}
            nameError={nameError}
            phoneError={phoneError}
            primaryAddressErrors={primaryAddressErrors}
            savedAddressErrors={savedAddressErrors}
            saving={saving}
            texts={detailTexts}
            formButtonLabel={detailTexts?.saveButton ?? formTexts.button.edit}
            onFieldChange={handleFieldChange}
            onPrimaryAddressChange={handlePrimaryAddressChange}
            onSavedAddressChange={handleSavedAddressChange}
            onAddSecondaryAddress={handleAddSecondaryAddress}
            onRemoveSecondaryAddress={handleRemoveSecondaryAddress}
            onSubmit={handleFullSubmit}
            onCancel={handleCancel}
          />
        )}
      </>
      <UserPreferencesCard />
    </section>
  );
}
