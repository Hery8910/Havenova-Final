import {
  ChoiceButtonField,
  CustomerTypeSelector,
  serviceRequestShellStyles as shellStyles,
} from '../../../shared';
import type {
  HomeServiceRequestFieldErrors,
  HomeServiceRequestFormState,
  HomeServiceRequestFormTexts,
} from '../homeServiceRequest.types';
import type { HomeServiceKind } from '../homeServiceTypes';
import { HOME_SERVICE_TYPE_ORDER } from '../homeServiceRequest.helpers';
import serviceTypeSelectorStyles from '../ServiceTypeSelector/ServiceTypeSelector.module.css';

interface CustomerServiceTypeStepProps {
  texts: HomeServiceRequestFormTexts;
  values: {
    customerType: HomeServiceRequestFormState['customerType'];
    serviceType: HomeServiceKind | '';
  };
  errors: Pick<HomeServiceRequestFieldErrors, 'customerType' | 'serviceType'>;
  onCustomerTypeChange: (customerType: Exclude<HomeServiceRequestFormState['customerType'], ''>) => void;
  onServiceTypeChange: (serviceType: HomeServiceKind) => void;
}

export default function CustomerServiceTypeStep({
  texts,
  values,
  errors,
  onCustomerTypeChange,
  onServiceTypeChange,
}: CustomerServiceTypeStepProps) {
  return (
    <section
      className={shellStyles.stepStack}
      aria-label={
        texts.process.steps.customerService.ariaLabel ?? texts.process.steps.customerService.heading
      }
    >
      <CustomerTypeSelector
        label={texts.customerType.label}
        options={texts.customerType.options}
        value={values.customerType}
        error={errors.customerType}
        onChange={onCustomerTypeChange}
      />
      <ChoiceButtonField
        legend={texts.serviceType.label}
        options={HOME_SERVICE_TYPE_ORDER.map((type) => ({
          value: type,
          label: texts.serviceType.options[type].title,
        }))}
        value={values.serviceType}
        error={errors.serviceType}
        listClassName={serviceTypeSelectorStyles.serviceGrid}
        itemClassName={serviceTypeSelectorStyles.serviceItem}
        buttonClassName={serviceTypeSelectorStyles.serviceButton}
        labelClassName={serviceTypeSelectorStyles.serviceTitle}
        onChange={onServiceTypeChange}
      />
    </section>
  );
}
