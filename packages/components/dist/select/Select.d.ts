interface SelectOption {
    name: string;
    icon?: {
        src: string;
        alt: string;
    };
}
interface SelectProps {
    label: string;
    options: SelectOption[];
    onChange: (selected: string[]) => void;
    multiple?: boolean;
}
declare const Select: React.FC<SelectProps>;
export default Select;
//# sourceMappingURL=Select.d.ts.map