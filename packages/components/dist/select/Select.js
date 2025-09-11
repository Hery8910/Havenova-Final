import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styles from './Select.module.css';
import { IoIosArrowBack } from 'react-icons/io';
import Image from 'next/image';
const Select = ({ label, options, onChange, multiple = true }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState([]);
    const handleToggle = () => {
        setOpen((prev) => !prev);
    };
    const handleSelect = (name) => {
        let updated;
        if (multiple) {
            updated = selected.includes(name)
                ? selected.filter((item) => item !== name)
                : [...selected, name];
        }
        else {
            updated = [name];
            setOpen(false);
        }
        setSelected(updated);
        onChange(updated);
        console.log(updated);
    };
    return (_jsxs("section", { className: styles.section, children: [_jsxs("header", { onClick: handleToggle, className: styles.header, children: [_jsx("h4", { className: styles.h4, children: label }), _jsx(IoIosArrowBack, { className: `${styles.icon} ${open ? styles.open : ''}` })] }), selected.length > 0 && (_jsxs("ul", { className: styles.selected_ul, children: [_jsx("p", { className: styles.selected_p, children: _jsxs("strong", { children: [label, " :"] }) }), selected.map((name, index) => (_jsxs("li", { className: styles.selected_li, children: [name, selected.length > 1 && selected.length - 1 !== index && ','] }, name)))] })), open && (_jsx("ul", { className: styles.ul, children: options.map((option) => (_jsxs("li", { className: `${styles.li} ${selected.includes(option.name) ? styles.selected : ''}`, onClick: () => handleSelect(option.name), children: [option.icon && (_jsx(Image, { className: styles.image, src: option.icon.src, alt: option.icon.alt, width: 50, height: 50 })), _jsx("p", { children: option.name })] }, option.name))) }))] }));
};
export default Select;
