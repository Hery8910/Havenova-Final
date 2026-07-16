'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import {
  getI18nFallbacks,
  useAuth,
  useGlobalAlert,
  useI18n,
  useProfile,
} from '../../../../../../../contexts';
import type { UpdateUserClientProfileInput } from '../../../../../../../types';
import { getPopup } from '../../../../../../../utils/alertType';
import {
  validateName,
  validatePhone,
} from '../../../../../../../utils/validators/profileFormValidator';
import {
  buildFormState,
  normalizeAddress,
  validateAddress,
} from '../helpers/profileDetails.form.helpers';
import type { AddressErrors, ProfileFormState } from '../types';
import {
  getMissingProfileFields,
  isProfileComplete,
} from '../../../profileCompletionBadge/profileCompletion.helpers';

type EmbeddedProfileStepTexts = {
  title?: string;
  description?: string;
  missingFieldsLabel?: string;
  summaryAriaLabel?: string;
  saveButton?: string;
  saving?: string;
  labels?: {
    name?: string;
    email?: string;
    phone?: string;
    primaryAddress?: string;
  };
  errors?: {
    required?: string;
    invalidName?: string;
    invalidPhone?: string;
  };
};

type EmbeddedProfileAddressTexts = {
  addressDetailsAriaLabel?: string;
  fields?: {
    street?: string;
    streetNumber?: string;
    postalCode?: string;
    district?: string;
    floor?: string;
  };
};

interface UseEmbeddedProfileCompletionControllerArgs {
  texts?: {
    profileStep?: EmbeddedProfileStepTexts;
    addressForm?: EmbeddedProfileAddressTexts;
  };
}

export function useEmbeddedProfileCompletionController({
  texts,
}: UseEmbeddedProfileCompletionControllerArgs) {
  const { texts: i18nTexts, language } = useI18n();
  const { fallbackButtons, fallbackGlobalError, fallbackLoadingMessages, fallbackPopups } =
    getI18nFallbacks(language);
  const { auth } = useAuth();
  const { profile, updateProfile, reloadProfile } = useProfile();
  const { showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();

  const [formState, setFormState] = useState<ProfileFormState>(() => buildFormState(profile));
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [primaryAddressErrors, setPrimaryAddressErrors] = useState<AddressErrors>({});
  const [saving, setSaving] = useState(false);

  const profileTexts = texts?.profileStep;
  const popups = i18nTexts.popups;
  const formTexts = i18nTexts.components.client.form;
  const loadingText = i18nTexts.loadings?.message ?? fallbackLoadingMessages;
  const missingProfileFields = getMissingProfileFields(profile);
  const profileCompleted = isProfileComplete(profile);

  const syncFormWithProfile = () => {
    setFormState(buildFormState(profile));
    setNameError('');
    setPhoneError('');
    setPrimaryAddressErrors({});
  };

  useEffect(() => {
    if (!saving) {
      syncFormWithProfile();
    }
  }, [profile, saving]);

  const handleSubmitProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredMessage = profileTexts?.errors?.required ?? 'This field is required.';
    const nextNameError = formState.name.trim()
      ? validateName(formState.name)[0]
        ? (profileTexts?.errors?.invalidName ?? formTexts.error.name.invalid)
        : ''
      : (profileTexts?.errors?.required ?? formTexts.error.name.required);
    const nextPhoneError = formState.phone.trim()
      ? validatePhone(formState.phone)[0]
        ? (profileTexts?.errors?.invalidPhone ?? formTexts.error.phone.invalid)
        : ''
      : (profileTexts?.errors?.required ?? formTexts.error.phone.required);
    const nextPrimaryAddressErrors = validateAddress(formState.primaryAddress, requiredMessage);

    setNameError(nextNameError);
    setPhoneError(nextPhoneError);
    setPrimaryAddressErrors(nextPrimaryAddressErrors);

    const hasAddressErrors = Object.values(nextPrimaryAddressErrors).some(Boolean);
    if (nextNameError || nextPhoneError || hasAddressErrors) return;

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

      const payload: UpdateUserClientProfileInput = {
        name: formState.name.trim(),
        phone: formState.phone.trim(),
        primaryAddress: normalizeAddress(formState.primaryAddress),
      };

      await updateProfile(payload);
      await reloadProfile();

      const successPopup = getPopup(
        popups,
        'USER_CLIENT_PROFILE_UPDATED',
        'USER_CLIENT_PROFILE_UPDATED',
        fallbackPopups.USER_CLIENT_PROFILE_UPDATED
      );

      showSuccess({
        response: {
          status: 200,
          title: successPopup.title,
          description: successPopup.description,
          cancelLabel: i18nTexts.popups?.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });

      syncFormWithProfile();
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
          cancelLabel: errorPopup.close ?? i18nTexts.popups?.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    auth,
    profile,
    formState,
    nameError,
    phoneError,
    primaryAddressErrors,
    saving,
    profileCompleted,
    missingProfileFields,
    profileTexts,
    addressFormTexts: texts?.addressForm,
    setFormState,
    handleSubmitProfile,
  };
}
