import { OfferType } from '../../types/offers';
interface SelectOption {
    name: string;
    value?: OfferType;
    path?: string;
}
interface SelectProps {
    label: string;
    options: SelectOption[];
    defaultValue?: OfferType | string;
    onChange: (selectedValue: OfferType | string) => void;
}
declare const SelectDashboard: React.FC<SelectProps>;
export default SelectDashboard;
//# sourceMappingURL=SelectDashboard.d.ts.map