'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useProfile } from '../../../../../../contexts';
import type { UserAddress } from '../../../../../../types/profile';
import type { WorkAddressSelection } from '../../../../../../types/services';
import AddressFormFields from '../../../../shared/addressFormFields/AddressFormFields';
import {
  buildAddressOptions,
  createEmptyUserAddress,
  formatAddressLabel,
  isAddressComplete,
  isSameAddress,
  isSameWorkAddressSelection,
  normalizeAddress,
  type NormalizedAddressOption,
} from './workAddressHelpers';
import styles from './WorkAddressSelector.module.css';

export interface WorkAddressSelectorProps {
  showHeader?: boolean;
  value: WorkAddressSelection | null;
  onChange: (value: WorkAddressSelection | null) => void;
  texts?: {
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
  };
}

type SelectionMode = 'primary' | 'saved' | 'new';

export default function WorkAddressSelector({
  showHeader = true,
  value,
  onChange,
  texts,
}: WorkAddressSelectorProps) {
  const titleId = useId();
  const manualSectionTitleId = useId();
  const { profile, loading } = useProfile();
  const isInternalSyncRef = useRef(false);
  const addressOptions = useMemo(
    () => buildAddressOptions(profile.primaryAddress, profile.savedAddresses),
    [profile.primaryAddress, profile.savedAddresses]
  );
  const hasProfileAddresses = addressOptions.length > 0;

  const [selectionMode, setSelectionMode] = useState<SelectionMode>(
    value?.source ?? (hasProfileAddresses ? 'primary' : 'new')
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    value?.source === 'saved' ? null : value?.source === 'primary' ? 'primary' : null
  );
  const [manualAddress, setManualAddress] = useState<UserAddress>(
    value?.source === 'new' ? value.address : createEmptyUserAddress()
  );
  const [saveToProfile, setSaveToProfile] = useState(Boolean(value?.source === 'new' && value.saveToProfile));
  const [savedAddressLabel, setSavedAddressLabel] = useState(value?.source === 'new' ? value.label || '' : '');

  useEffect(() => {
    if (!hasProfileAddresses) {
      setSelectionMode('new');
      setSelectedOptionId(null);
    } else if (selectionMode !== 'new' && !selectedOptionId) {
      setSelectedOptionId(addressOptions[0]?.id ?? null);
      setSelectionMode(addressOptions[0]?.source ?? 'new');
    }
  }, [addressOptions, hasProfileAddresses, selectedOptionId, selectionMode]);

  useEffect(() => {
    if (isInternalSyncRef.current) {
      isInternalSyncRef.current = false;
      return;
    }

    if (!value) return;

    if (value.source === 'new') {
      setSelectionMode('new');
      setSelectedOptionId(null);
      setManualAddress(value.address);
      setSaveToProfile(Boolean(value.saveToProfile));
      setSavedAddressLabel(value.label || '');
      return;
    }

    const matchingOption = addressOptions.find(
      (option) => option.source === value.source && isSameAddress(option.address, value.address)
    );

    setSelectionMode(value.source);
    setSelectedOptionId(matchingOption?.id ?? (value.source === 'primary' ? 'primary' : null));
  }, [addressOptions, value]);

  const selectedOption = useMemo<NormalizedAddressOption | null>(() => {
    if (selectionMode === 'primary') {
      return addressOptions.find((option) => option.source === 'primary') ?? null;
    }

    if (selectionMode === 'saved') {
      return addressOptions.find((option) => option.id === selectedOptionId) ?? null;
    }

    return null;
  }, [addressOptions, selectedOptionId, selectionMode]);

  useEffect(() => {
    if (loading) return;

    let nextValue: WorkAddressSelection | null = null;

    if (selectionMode === 'new') {
      if (isAddressComplete(manualAddress)) {
        nextValue = {
          address: normalizeAddress(manualAddress),
          source: 'new',
          saveToProfile,
          label: saveToProfile ? savedAddressLabel.trim() || undefined : undefined,
        };
      }
    } else if (selectedOption) {
      nextValue = {
        address: normalizeAddress(selectedOption.address),
        source: selectionMode,
        label: selectionMode === 'saved' ? selectedOption.savedLabel : undefined,
      };
    }

    if (!isSameWorkAddressSelection(nextValue, value)) {
      isInternalSyncRef.current = true;
      onChange(nextValue);
    }
  }, [
    loading,
    manualAddress,
    onChange,
    saveToProfile,
    savedAddressLabel,
    selectedOption,
    selectionMode,
    value,
  ]);

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      {showHeader ? (
        <header className={styles.header}>
          <h3 id={titleId} className={`${styles.title} type-title-sm`}>
            {texts?.title ?? 'Service address'}
          </h3>
          <p className={`${styles.description} type-body-md`}>
            {texts?.description ??
              'Choose your main address, a saved one, or enter a different location for this request.'}
          </p>
        </header>
      ) : null}

      {loading ? (
        <p className={styles.helper}>{texts?.loading ?? 'Loading your saved addresses...'}</p>
      ) : (
        <>
          {hasProfileAddresses ? (
            <fieldset className={styles.optionsGroup}>
              <legend className={styles.legend}>{texts?.optionsLegend ?? 'Available address options'}</legend>
              {addressOptions.map((option) => {
                const isChecked =
                  (option.source === 'primary' && selectionMode === 'primary') ||
                  (option.source === 'saved' &&
                    selectionMode === 'saved' &&
                    selectedOptionId === option.id);
                const optionLabel =
                  option.source === 'primary'
                    ? texts?.sourceLabels?.primary ?? 'Primary address'
                    : option.savedLabel || texts?.sourceLabels?.saved || 'Saved address';
                const optionHint = formatAddressLabel(option.address);

                return (
                  <label key={option.id} className={`${styles.optionCard} ${isChecked ? styles.optionSelected : ''}`}>
                    <input
                      className={styles.optionInput}
                      type="radio"
                      name="work-address-selection"
                      checked={isChecked}
                      onChange={() => {
                        setSelectionMode(option.source);
                        setSelectedOptionId(option.id);
                      }}
                    />
                    <span className={styles.optionLabel}>{optionLabel}</span>
                    <span className={styles.optionHint}>{optionHint}</span>
                  </label>
                );
              })}

              <label
                className={`${styles.optionCard} ${selectionMode === 'new' ? styles.optionSelected : ''}`}
              >
                <input
                  className={styles.optionInput}
                  type="radio"
                  name="work-address-selection"
                  checked={selectionMode === 'new'}
                  onChange={() => {
                    setSelectionMode('new');
                    setSelectedOptionId(null);
                  }}
                />
                <span className={styles.optionLabel}>
                  {texts?.useDifferentAddressLabel ?? 'Use a different address'}
                </span>
                <span className={styles.optionHint}>
                  {texts?.useDifferentAddressHint ?? 'Enter a new work location for this request.'}
                </span>
              </label>
            </fieldset>
          ) : (
            <p className={styles.helper}>
              {texts?.emptyState ??
                'No saved addresses found yet. Enter the service address below and save it if you want.'}
            </p>
          )}

          {(selectionMode === 'new' || !hasProfileAddresses) && (
            <section className={styles.manualSection} aria-labelledby={manualSectionTitleId}>
              <h4 id={manualSectionTitleId} className={styles.manualTitle}>
                {texts?.manualSectionTitle ?? texts?.useDifferentAddressLabel ?? 'Use a different address'}
              </h4>
              <p className={styles.manualHint}>
                {texts?.manualHint ?? 'Enter the address where the visit or inspection should take place.'}
              </p>

              <AddressFormFields value={manualAddress} onChange={setManualAddress} texts={texts} />

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={saveToProfile}
                  onChange={(event) => setSaveToProfile(event.target.checked)}
                />
                <span>{texts?.saveToProfileLabel ?? 'Save this address to my profile'}</span>
              </label>

              {saveToProfile && (
                <label className={styles.labelField}>
                  <span className={styles.label}>{texts?.savedAddressLabel ?? 'Label'}</span>
                  <input
                    className={styles.textInput}
                    type="text"
                    value={savedAddressLabel}
                    onChange={(event) => setSavedAddressLabel(event.target.value)}
                    placeholder={texts?.savedAddressPlaceholder ?? 'Home office, Building A, Parents...'}
                  />
                </label>
              )}
            </section>
          )}
        </>
      )}
    </section>
  );
}
