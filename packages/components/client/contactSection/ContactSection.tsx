import { ContactMessageFormData } from '../../../types';
import ContactFormWrapper from './ContactFormWrapper';
import { ButtonProps } from '../button/Button';
import styles from './ContactSection.module.css';

export interface ContactSectionTexts {
  heading: string;
  description: string;
}

interface ContactSectionProps {
  texts: ContactSectionTexts;
  handleSubmit: (data: ContactMessageFormData) => void;
  button: ButtonProps;
  loading?: boolean;
  subjects: string[];
}

const ContactSection: React.FC<ContactSectionProps> = ({
  texts,
  handleSubmit,
  button,
  loading = false,
  subjects,
}) => {
  return (
    <section className={styles.section} role="region" aria-labelledby="contact-heading">
      <header className={styles.header}>
        <h2 id="contact-heading">{texts.heading}</h2>
        <p>{texts.description}</p>
      </header>

      <ContactFormWrapper
        onSubmit={handleSubmit}
        button={button}
        loading={loading}
        subjects={subjects}
      />
    </section>
  );
};

export default ContactSection;
