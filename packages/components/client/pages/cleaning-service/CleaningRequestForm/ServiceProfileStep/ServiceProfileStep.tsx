'use client';

import { ProfileBaseDetailsFields } from '../../../../user/profile/profileSettings/details/form';
import { useEmbeddedProfileCompletionController } from '../../../../user/profile/profileSettings/details/controller';
import { RequestStepIntro, WorkAddressSelector } from '../../shared';
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
  const {
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
    addressFormTexts,
    setFormState,
    handleSubmitProfile,
  } = useEmbeddedProfileCompletionController({
    texts: {
      profileStep: texts?.profileStep,
      addressForm: {
        addressDetailsAriaLabel: texts?.addressDetailsAriaLabel,
        fields: texts?.fields,
      },
    },
  });

  if (!profileCompleted) {
    return (
      <section className={styles.section}>
        <article className={styles.formCard}>
          <div className={styles.summaryHeader}>
            <RequestStepIntro
              title={profileTexts?.title ?? 'Complete your profile details'}
              description={
                profileTexts?.description ??
                'Before selecting the work address, we need your name, phone, and primary address.'
              }
              descriptionSecondary={`${profileTexts?.missingFieldsLabel ?? 'Missing'}: ${missingProfileFields.join(', ')}`}
              titleAs="h4"
            />
          </div>

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
                  addressDetailsAriaLabel: addressFormTexts?.addressDetailsAriaLabel,
                  fields: addressFormTexts?.fields,
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
