import styles from './ContactInfo.module.css';
import { MdOutlineEmail } from 'react-icons/md';
import { FiPhone } from 'react-icons/fi';
import { LuMapPin } from 'react-icons/lu';

interface NameItem {
  label: string;
  value: string;
  description: string;
}
interface PhoneItem {
  label: string;
  value: string;
  image: string;
}
interface EmailItem {
  label: string;
  value: string;
  image: string;
}
interface AddressItem {
  label: string;
  value: string;
  image: string;
  mapUrl: string;
}
interface weekItem {
  label: string;
  value: string;
}
interface weekendItem {
  label: string;
  value: string;
}

export interface ContactInfoProps {
  title: string;
  havenova: {
    name: NameItem;
    phone: PhoneItem;
    email: EmailItem;
    address: AddressItem;
    weekHours: weekItem;
    weekendHours: weekendItem;
  };
  theme: 'dark' | 'light';
  isMobile: boolean;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  title,
  havenova: { phone, address, email, weekHours, weekendHours },
}) => {
  return (
    <section className={styles.section} role="region" aria-labelledby="company-contact-heading">
      <h2 id="company-contact-heading">{title}</h2>
      <ul className={styles.list}>
        <li className={styles.item}>
          <MdOutlineEmail />
          <a href={`mailto:${email.value}`} aria-label={`Send email to ${email.value}`}>
            {email.value}
          </a>
        </li>
        <li className={styles.item}>
          <FiPhone />
          <a href={`tel:${phone.value}`} aria-label={`Call ${phone.value}`}>
            {phone.value}
          </a>
        </li>
        <li className={styles.item}>
          <LuMapPin />
          <a
            href={address.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open map for ${address.value}`}
          >
            {address.value}
          </a>
        </li>
        <li className={styles.item}>
          <p>{weekHours.label}</p>
          <p>{weekHours.value}</p>
        </li>
        <li className={styles.item}>
          <p>{weekendHours.label}</p>
          <p>{weekendHours.value}</p>
        </li>
      </ul>
    </section>
  );
};

export default ContactInfo;
