'use client';

import type { FormEvent } from 'react';
import { useMemo } from 'react';
import {
  getI18nFallbacks,
  useAuth,
  useGlobalAlert,
  useI18n,
  useProfile,
} from '../../../../../../../contexts';
import type { UpdateUserClientProfileInput, UserAddress } from '../../../../../../../types';
import { getPopup } from '../../../../../../../utils/alertType';
import {
  isSavedAddressEmpty,
  normalizeAddress,
  toSavedAddressPayload,
} from '../helpers/profileDetails.form.helpers';
import type { ProfileDetailsTexts } from '../types';
import { buildProfileDetailsViewModel } from './profileDetails.view-model';
import { validateProfileDetailsForm } from './profileDetails.validation';
import { useProfileDetailsFormState } from './useProfileDetailsFormState';

interface UseUserProfileDetailsControllerArgs {
  onCancel?: () => void;
  onAddressClick?: (address: UserAddress) => void;
}

export function useUserProfileDetailsController({
  onCancel,
  onAddressClick,
}: UseUserProfileDetailsControllerArgs) {
  const { texts, language } = useI18n();
  const { fallbackButtons, fallbackGlobalError, fallbackLoadingMessages, fallbackPopups } =
    getI18nFallbacks(language);
  const { profile, updateProfile, reloadProfile } = useProfile();
  const { auth } = useAuth();
  const { showError, showSuccess, showLoading, showConfirm, closeAlert } = useGlobalAlert();
  const popups = texts.popups;
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;
  const formTexts = texts.components.client.form;
  const detailTexts: ProfileDetailsTexts = texts?.pages?.client?.user?.profile?.details;

  const {
    isEditing,
    isAddingSecondaryAddress,
    selectedSavedAddressIndex,
    saving,
    formState,
    nameError,
    phoneError,
    primaryAddressErrors,
    savedAddressErrors,
    setIsEditing,
    setIsAddingSecondaryAddress,
    setSelectedSavedAddressIndex,
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
  } = useProfileDetailsFormState({ profile });

  const viewModel = useMemo(
    () =>
      buildProfileDetailsViewModel({
        profile,
        auth,
        texts,
        detailTexts,
      }),
    [auth, detailTexts, profile, texts]
  );
  const showSummary = viewModel.showSummary && !isEditing;
  const showFullForm = viewModel.showFullForm || isEditing;

  const handleStartEditing = () => {
    syncFormWithProfile();
    setIsAddingSecondaryAddress(false);
    setIsEditing(true);
    setSelectedSavedAddressIndex(null);
  };

  const handleCancel = () => {
    syncFormWithProfile();
    setIsEditing(false);
    resetQuickAddState();
    onCancel?.();
  };

  const handleRemoveSecondaryAddress = (index: number) => {
    const savedAddress = formState.savedAddresses[index];

    if (!savedAddress || isSavedAddressEmpty(savedAddress)) {
      removeSecondaryAddress(index);
      return;
    }

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
        cancelLabel: confirmPopup.close ?? texts.popups?.button?.close ?? fallbackButtons.close,
      },
      onConfirm: () => {
        closeAlert();
        removeSecondaryAddress(index);
      },
      onCancel: closeAlert,
    });
  };

  const submitProfileUpdate = async (payload: UpdateUserClientProfileInput) => {
    try {
      setSaving(true);

      const loadingData = loadingText.createUser ?? fallbackLoadingMessages.createUser;
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

  const handleFullSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateProfileDetailsForm({
      formState,
      formTexts,
      detailTexts,
    });

    setNameError(validation.nameError);
    setPhoneError(validation.phoneError);
    setPrimaryAddressErrors(validation.primaryAddressErrors);
    setSavedAddressErrors(validation.savedAddressErrors);

    if (validation.hasErrors) return;

    await submitProfileUpdate({
      name: formState.name.trim(),
      phone: formState.phone.trim(),
      primaryAddress: normalizeAddress(formState.primaryAddress),
      savedAddresses: toSavedAddressPayload(formState.savedAddresses),
    });
  };

  return {
    showSummary,
    showFullForm,
    summaryProps: {
      title: detailTexts?.eyebrow ?? 'Profile details',
      tableAriaLabel: detailTexts?.tableAriaLabel,
      editLabel: detailTexts?.editButton ?? 'Edit',
      onEdit: handleStartEditing,
      rows: viewModel.summaryRows,
    },
    identityProps: viewModel.identityProps,
    formProps: {
      mode: 'full' as const,
      formState,
      nameError,
      phoneError,
      primaryAddressErrors,
      savedAddressErrors,
      saving,
      texts: detailTexts,
      formButtonLabel: detailTexts?.saveButton ?? formTexts.button.edit,
      selectedSavedAddressIndex,
      onFieldChange: handleFieldChange,
      onPrimaryAddressChange: handlePrimaryAddressChange,
      onSavedAddressChange: handleSavedAddressChange,
      onSavedAddressLabelChange: handleSavedAddressLabelChange,
      onSelectSavedAddress: setSelectedSavedAddressIndex,
      onAddSecondaryAddress: handleAddSecondaryAddress,
      onRemoveSecondaryAddress: handleRemoveSecondaryAddress,
      onSubmit: handleFullSubmit,
      onCancel: handleCancel,
      onAddressClick,
    },
  };
}
