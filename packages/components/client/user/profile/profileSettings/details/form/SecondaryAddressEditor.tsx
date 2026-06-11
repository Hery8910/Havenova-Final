import { useId } from 'react';
import AddressFormFields from '../../../../../shared/addressFormFields/AddressFormFields';
import type { UserAddress } from '../../../../../../../types';
import type { AddressErrors, ProfileDetailsTexts } from '../types';

interface SecondaryAddressEditorProps {
  address: UserAddress;
  addressErrors: AddressErrors;
  label: string;
  labelError?: string;
  texts?: {
    title?: string;
    description?: string;
    label?: string;
    labelPlaceholder?: string;
    saveButton?: string;
    cancelButton?: string;
  };
  sharedTexts?: ProfileDetailsTexts;
  saving?: boolean;
  onAddressChange: (value: UserAddress) => void;
  onLabelChange: (value: string) => void;
  onCancel?: () => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
  actionsClassName?: string;
}

export function SecondaryAddressEditor({
  address,
  addressErrors,
  label,
  labelError,
  texts,
  sharedTexts,
  saving = false,
  onAddressChange,
  onLabelChange,
  onCancel,
  onSubmit,
  className,
  contentClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  fieldClassName,
  labelClassName,
  actionsClassName,
}: SecondaryAddressEditorProps) {
  const labelInputId = useId();
  const labelErrorId = useId();
  const body = (
    <>
      {(texts?.title || texts?.description) && (
        <header className={headerClassName}>
          {texts?.title ? <h4 className={titleClassName}>{texts.title}</h4> : null}
          {texts?.description ? <p className={descriptionClassName}>{texts.description}</p> : null}
        </header>
      )}

      <label className={fieldClassName} htmlFor={labelInputId}>
        <span className={labelClassName}>{texts?.label ?? 'Address name'}</span>
        <input
          id={labelInputId}
          className="input"
          type="text"
          value={label}
          onChange={(event) => onLabelChange(event.target.value)}
          placeholder={texts?.labelPlaceholder ?? 'Office, Parents, Storage...'}
          autoComplete="off"
          aria-invalid={Boolean(labelError)}
          aria-describedby={labelError ? labelErrorId : undefined}
        />
        {labelError ? (
          <p id={labelErrorId} className="type-caption" role="alert">
            {labelError}
          </p>
        ) : null}
      </label>

      <AddressFormFields
        value={address}
        onChange={onAddressChange}
        errors={addressErrors}
        texts={{
          addressDetailsAriaLabel: sharedTexts?.form?.secondaryAddressAriaLabel ?? 'Address details',
          fields: sharedTexts?.form?.fields,
        }}
      />

      {(onCancel || onSubmit) && (
        <footer className={actionsClassName}>
          {onCancel ? (
            <button
              type="button"
              className="button button--outline"
              onClick={onCancel}
              disabled={saving}
            >
              {texts?.cancelButton ?? 'Cancel'}
            </button>
          ) : null}
          {onSubmit ? (
            <button type="submit" className="button button--primary" disabled={saving} aria-busy={saving}>
              {saving ? sharedTexts?.form?.saving ?? 'Saving...' : texts?.saveButton ?? 'Save address'}
            </button>
          ) : null}
        </footer>
      )}
    </>
  );

  if (!onSubmit) {
    return <div className={className}>{body}</div>;
  }

  return (
    <form className={className} onSubmit={onSubmit} noValidate>
      <div className={contentClassName}>{body}</div>
    </form>
  );
}
