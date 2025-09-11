interface InputProps {
    heading: string;
    value: string;
    onChange: (value: string, idx?: number) => void;
    onBlur: (value: string) => void;
    placeholder?: string;
    maxLength?: number;
    height?: string;
}
export default function Input({ heading, value, onChange, onBlur, placeholder, maxLength, height, }: InputProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Input.d.ts.map