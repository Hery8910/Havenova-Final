import { ContactMessageFormData } from '../../../types';
import { FormWrapper } from '../../userForm';
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
}

const ContactSection: React.FC<ContactSectionProps> = ({
  texts,
  handleSubmit,
  button,
  loading = false,
}) => {
  return (
    <section className={styles.section} role="region" aria-labelledby="contact-heading">
      <header className={styles.header}>
        <h2 id="contact-heading">{texts.heading}</h2>
        <p>{texts.description}</p>
      </header>

      <FormWrapper<ContactMessageFormData>
        fields={['name', 'email', 'message'] as const}
        onSubmit={handleSubmit}
        button={button}
        initialValues={{
          name: '',
          email: '',
          message: '',
          clientId: '',
          userId: '',
        }}
        loading={loading}
      />
    </section>
  );
};

export default ContactSection;
