'use client';

import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  getI18nFallbacks,
  useAuth,
  useGlobalAlert,
  useI18n,
  useProfile,
} from '../../../../../../contexts';
import {
  buildFormState,
  normalizeAddress,
  validateAddress,
} from '../../../../user/profile/profileSettings/details/helpers';
import { ProfileBaseDetailsFields } from '../../../../user/profile/profileSettings/details/form';
import type { AddressErrors } from '../../../../user/profile/profileSettings/details/types';
import { type UpdateUserClientProfileInput } from '../../../../../../types';
import {
  getMissingProfileFields,
  isProfileComplete,
} from '../../../../user/profile/profileCompletionBadge/profileCompletion.helpers';
import { getPopup } from '../../../../../../utils/alertType';
import { validateName, validatePhone } from '../../../../../../utils/validators';
import WorkAddressSelector from '../WorkAddressSelector/WorkAddressSelector';
import type { CleaningWorkAddressSelection } from '../cleaningRequest.types';
import styles from './ServiceProfileStep.module.css';
import { CgProfile } from 'react-icons/cg';
import { HiOutlineMail } from 'react-icons/hi';
import { LuPhone } from 'react-icons/lu';

type ServiceProfileStepTexts = {
  title?: string;
  description?: string;
  loading?: string;
  optionsLegend?: string;
  useDifferentAddressLabel?: string;
  useDifferentAddressHint?: string;
  emptyState?: string;
  manualHint?: string;
  saveToProfileLabel?: string;
  savedAddressLabel?: string;
  savedAddressPlaceholder?: string;
  manualSectionTitle?: string;
  addressDetailsAriaLabel?: string;
  sourceLabels?: {
    primary?: string;
    saved?: string;
  };
  fields?: {
    street?: string;
    streetNumber?: string;
    postalCode?: string;
    district?: string;
    floor?: string;
  };
  profileStep?: {
    title?: string;
    description?: string;
    missingFieldsLabel?: string;
    summaryTitle?: string;
    summaryDescription?: string;
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
};

interface ServiceProfileStepProps {
  value: CleaningWorkAddressSelection | null;
  onChange: (value: CleaningWorkAddressSelection | null) => void;
  texts?: ServiceProfileStepTexts;
}

export default function ServiceProfileStep({ value, onChange, texts }: ServiceProfileStepProps) {
  const { texts: i18nTexts, language } = useI18n();
  const { fallbackButtons, fallbackGlobalError, fallbackLoadingMessages, fallbackPopups } =
    getI18nFallbacks(language);
  const { auth } = useAuth();
  const { profile, updateProfile, reloadProfile } = useProfile();
  const { showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();

  const [formState, setFormState] = useState(() => buildFormState(profile));
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

  const summaryAddress = useMemo(() => {
    if (!profile?.primaryAddress) return '';

    return [
      profile.primaryAddress.street,
      profile.primaryAddress.streetNumber,
      profile.primaryAddress.postalCode,
      profile.primaryAddress.district,
    ]
      .map((part) => part?.trim() ?? '')
      .filter(Boolean)
      .join(', ');
  }, [profile?.primaryAddress]);

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
        'AUTH_GET_SUCCESS',
        'AUTH_GET_SUCCESS',
        fallbackPopups.AUTH_GET_SUCCESS
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

  if (!profileCompleted) {
    return (
      <section className={styles.section}>
        <article className={styles.formCard}>
          <header className={styles.summaryHeader}>
            <h4 className={`${styles.title} type-title-sm`}>
              {profileTexts?.title ?? 'Complete your profile details'}
            </h4>
            <p className={styles.description}>
              {profileTexts?.description ??
                'Before selecting the work address, we need your name, phone, and primary address.'}
            </p>
            <p className={styles.description}>
              {`${profileTexts?.missingFieldsLabel ?? 'Missing'}: ${missingProfileFields.join(', ')}`}
            </p>
          </header>

          <form className={styles.form} onSubmit={handleSubmitProfile} noValidate>
            <ProfileBaseDetailsFields
              formState={formState}
              nameError={nameError}
              phoneError={phoneError}
              primaryAddressErrors={primaryAddressErrors}
              texts={{
                labels: {
                  name: profileTexts?.labels?.name,
                  phone: profileTexts?.labels?.phone,
                  primaryAddress: profileTexts?.labels?.primaryAddress,
                },
                form: {
                  addressDetailsAriaLabel: texts?.addressDetailsAriaLabel,
                  fields: texts?.fields,
                },
              }}
              onFieldChange={(field, nextValue) =>
                setFormState((current) => ({ ...current, [field]: nextValue }))
              }
              onPrimaryAddressChange={(nextAddress) =>
                setFormState((current) => ({ ...current, primaryAddress: nextAddress }))
              }
            />

            <footer className={styles.actions}>
              <button
                type="submit"
                className="button button--primary"
                disabled={saving}
                aria-busy={saving}
              >
                {saving
                  ? (profileTexts?.saving ?? 'Saving...')
                  : (profileTexts?.saveButton ?? 'Save profile and continue')}
              </button>
            </footer>
          </form>
        </article>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <section
        className={styles.summaryCard}
        aria-label={profileTexts?.summaryAriaLabel ?? 'Profile details summary'}
      >
        <dl className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <dt className={styles.summaryLabel}>
              <CgProfile />
            </dt>
            <dd className={styles.summaryValue}>{profile?.name?.trim() || '-'}</dd>
          </div>
          <div className={styles.summaryItem}>
            <dt className={styles.summaryLabel}>
              <HiOutlineMail />
            </dt>
            <dd className={styles.summaryValue}>{auth?.email?.trim() || '-'}</dd>
          </div>
          <div className={styles.summaryItem}>
            <dt className={styles.summaryLabel}>
              <LuPhone />
            </dt>
            <dd className={styles.summaryValue}>{profile?.phone?.trim() || '-'}</dd>
          </div>
        </dl>
      </section>

      <WorkAddressSelector showHeader={false} value={value} onChange={onChange} texts={texts} />
    </section>
  );
}
