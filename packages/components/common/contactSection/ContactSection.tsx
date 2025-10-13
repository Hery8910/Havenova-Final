import { FaqMessageData } from '../../../types';
import { FormWrapper } from '../../userForm';
import { ButtonProps } from '../button/Button';
import styles from './ContactSection.module.css';

export interface ContactSectionTexts {
  heading: string;
  description: string;
}

interface ContactSectionProps {
  texts: ContactSectionTexts;
  handleSubmit: (data: any) => void;
  button: ButtonProps;
}

const ContactSection: React.FC<ContactSectionProps> = ({ texts, handleSubmit, button }) => {
  return (
    <section className={styles.section} role="region" aria-labelledby="contact-heading">
      <header className={styles.header}>
        <h2 id="contact-heading">{texts.heading}</h2>
        <p>{texts.description}</p>
      </header>

      <FormWrapper<FaqMessageData>
        fields={['name', 'email', 'message']}
        onSubmit={handleSubmit}
        button={button}
        initialValues={{
          name: '',
          email: '',
          message: '',
          language: '',
          clientId: '',
          originPath: '',
        }}
      />
    </section>
  );
};

export default ContactSection;
