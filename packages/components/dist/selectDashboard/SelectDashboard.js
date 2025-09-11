import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styles from './SelectDashboard.module.css';
import { IoIosArrowBack } from 'react-icons/io';
const offerOptions = [
    { name: 'Service Discount', value: 'SERVICE_DISCOUNT' },
    { name: 'Membership Discount', value: 'MEMBERSHIP_DISCOUNT' },
    { name: 'Referral Reward', value: 'REFERRAL_REWARD' },
    { name: 'New Client Discount', value: 'NEW_CLIENT_DISCOUNT' },
    { name: 'Register Page', value: '/user/register' },
    { name: 'Membership Page', value: '/user/membership' },
    { name: 'Furniture Assembly', value: '/services/furniture-assembly' },
    { name: 'Kitchen Assembly', value: '/services/kitchen-assembly' },
    { name: 'Home Service', value: '/services/home-service' },
    { name: 'House Cleaning', value: '/services/house-cleaning' },
    { name: 'Kitchen Cleaning', value: '/services/kitchen-cleaning' },
    { name: 'Windows Cleaning', value: '/services/windows-cleaning' },
    { name: 'Referral Program', value: '/referral' },
];
function getOfferTypeLabel(type) {
    const match = offerOptions.find((option) => option.value === type);
    return match ? match.name : 'Unknown';
}
const SelectDashboard = ({ label, options, defaultValue, onChange }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(getOfferTypeLabel(defaultValue || ''));
    const [selectedValue, setSelectedValue] = useState(defaultValue || '');
    const handleToggle = () => {
        setOpen((prev) => !prev);
    };
    const handleSelect = (option) => {
        if (option.value) {
            setSelectedValue(option.value);
            onChange(option.value);
        }
        else if (option.path) {
            setSelectedValue(option.path);
            onChange(option.path);
        }
        setSelected(option.name);
        setOpen(false);
    };
    return (_jsxs("section", { className: styles.section, children: [_jsxs("header", { onClick: handleToggle, className: styles.header, children: [_jsx("h4", { className: styles.h4, children: selected ? selected : label }), _jsx(IoIosArrowBack, { className: `${styles.icon} ${open ? styles.open : ''}` })] }), open && (_jsx("ul", { className: styles.ul, children: options.map((option) => (_jsx("li", { className: styles.li, onClick: () => handleSelect(option), children: _jsx("p", { children: option.name }) }, option.name))) }))] }));
};
export default SelectDashboard;
