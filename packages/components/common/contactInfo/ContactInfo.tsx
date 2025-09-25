import Image from 'next/image';
import styles from './ContactInfo.module.css';

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
  name: NameItem;
  phone: PhoneItem;
  email: EmailItem;
  address: AddressItem;
  weekHours: weekItem;
  weekendHours: weekendItem;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  name,
  phone,
  address,
  email,
  weekHours,
  weekendHours,
}) => {
  return (
    <section className={styles.section} role="region" aria-labelledby="company-contact-heading">
      <header className={styles.header}>
        <h2 id="company-contact-heading">{name.value}</h2>
        <h4>{name.description}</h4>
      </header>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Image
            className={styles.image}
            src={email.image}
            alt={`${email.label} icon`}
            width={25}
            height={25}
          />
          <a href={`mailto:${email.value}`} aria-label={`Send email to ${email.value}`}>
            {email.value}
          </a>
        </li>
        <li className={styles.item}>
          <Image
            className={styles.image}
            src={phone.image}
            alt={`${phone.label} icon`}
            width={25}
            height={25}
          />
          <a href={`tel:${phone.value}`} aria-label={`Call ${phone.value}`}>
            {phone.value}
          </a>
        </li>
        <li className={styles.item}>
          <Image
            className={styles.image}
            src={address.image}
            alt={`${address.label} icon`}
            width={25}
            height={25}
          />
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
