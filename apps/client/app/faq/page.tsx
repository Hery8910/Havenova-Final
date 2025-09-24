'use client';
import { FAQHero, FAQHeroSkeleton } from '@/packages/components/pages/faqHero';
import { FAQList, FAQListSkeleton } from '@/packages/components/common';
import { FormWrapper } from '@/packages/components/userForm/formWrapper';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import styles from './page.module.css';
import { useClient } from '../../../../packages/contexts/client/ClientContext';
import { useUser } from '../../../../packages/contexts/user/UserContext';
import { useState } from 'react';
import { FaqMessageData } from '../../../../packages/types';
import { sendFaqMessage } from '../../../../packages/services/userService';
import { AlertWrapper } from '../../../../packages/components/alert';

const QuestionsAnswers = () => {
  const { texts } = useI18n();
  const { client } = useClient();
  const { user } = useUser();
  const [alert, setAlert] = useState<any | null>(null);
  const popups = texts.popups;
  const faqListTexts = texts.pages.faq.items;
  const faqHeroTexts = texts.pages.faq.faqHero;
  const formText = texts.components.form;

  const handleSubmit = async (data: Partial<FaqMessageData>) => {
    try {
      if (!client?._id) {
        const popupData = popups?.INTERNAL_ERROR || {};
        setAlert({
          status: 500,
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          message: popupData.description || popups.GLOBAL_INTERNAL_ERROR.description,
        });
        return;
      }

      const payload: FaqMessageData = {
        name: data.name || user?.name || '',
        email: data.email || user?.email || '',
        message: data.message || '',
        clientId: client._id,
      };

      const response = await sendFaqMessage(payload);

      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setAlert({
          status: 200,
          title: popupData.title || popups.FAQ_MESSAGE_SUCCESS.title,
          message: popupData.description || response.message,
        });
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorKey = error.response.data.errorCode;
        const popupData = popups?.[errorKey] || {};
        setAlert({
          status: error.response.status,
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          message:
            popupData.description ||
            error.response.data.message ||
            popups.GLOBAL_INTERNAL_ERROR.description,
        });
      } else {
        setAlert({
          status: 500,
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          message: popups.GLOBAL_INTERNAL_ERROR.description,
        });
      }
    }
  };

  return (
    <main className={styles.main}>
      {faqHeroTexts ? <FAQHero {...faqHeroTexts} /> : <FAQHeroSkeleton />}

      {faqListTexts ? <FAQList categories={faqListTexts} /> : <FAQListSkeleton />}

      {alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}

      <FormWrapper
        fields={['name', 'email', 'message']}
        onSubmit={handleSubmit}
        submitLabel={formText.buttonLabel.contact}
      />
    </main>
  );
};

export default QuestionsAnswers;
