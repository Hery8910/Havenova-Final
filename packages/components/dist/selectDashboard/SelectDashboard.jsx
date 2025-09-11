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
    return (<section className={styles.section}>
      <header onClick={handleToggle} className={styles.header}>
        <h4 className={styles.h4}>{selected ? selected : label}</h4>
        <IoIosArrowBack className={`${styles.icon} ${open ? styles.open : ''}`}/>
      </header>
      {open && (<ul className={styles.ul}>
          {options.map((option) => (<li key={option.name} className={styles.li} onClick={() => handleSelect(option)}>
              <p>{option.name}</p>
            </li>))}
        </ul>)}
    </section>);
};
export default SelectDashboard;
