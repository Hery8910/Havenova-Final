'use client';

import { CgProfile } from 'react-icons/cg';
import { HiOutlineMail } from 'react-icons/hi';
import { LuPhone } from 'react-icons/lu';
import { useEmbeddedProfileCompletionController } from '../../../../user/profile/profileSettings/details/controller';
import { ProfileBaseDetailsFields } from '../../../../user/profile/profileSettings/details/form';
import { RequestStepIntro } from '../RequestStepIntro';
import { WorkAddressSelector } from '../WorkAddressSelector';
import type {
  ServiceRequestAddressTexts,
  ServiceRequestWorkAddressSelection,
} from '../serviceRequestUi.types';
import styles from './ServiceRequestAddressStep.module.css';

interface ServiceRequestAddressStepProps {
  value: ServiceRequestWorkAddressSelection | null;
  onChange: (value: ServiceRequestWorkAddressSelection | null) => void;
  texts?: ServiceRequestAddressTexts;
}

export function ServiceRequestAddressStep({
  value,
  onChange,
  texts,
}: ServiceRequestAddressStepProps) {
  const {
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
            <dd className={styles.summaryValue}>{profile?.contactEmail?.trim() || '-'}</dd>
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
