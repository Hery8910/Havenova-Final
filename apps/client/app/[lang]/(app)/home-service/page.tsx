'use client';

import { useState } from 'react';
import { AuthRequiredAlert } from '../../../../../../packages/components/client/pages/cleaning-service';
import { HomeServiceRequestForm } from '../../../../../../packages/components/client/pages/home-service';
import { PageHero, type PageHeroContent } from '../../../../../../packages/components/client/pages/hero';
import {
  useAuth,
  useI18n,
} from '../../../../../../packages/contexts';
import { useLang } from '../../../../../../packages/hooks';
import styles from './page.module.css';

interface HomeServicePageTexts {
  hero: PageHeroContent;
  authAlert: {
    title: string;
    description: string;
    closeLabel: string;
    ctas: {
      login: { label: string; href: string };
      register: { label: string; href: string };
    };
  };
  form: import('../../../../../../packages/components/client/pages/home-service').HomeServiceRequestFormTexts;
}

export default function HomeService() {
  const lang = useLang();
  const { texts } = useI18n();
  const { auth } = useAuth();
  const [isAlertClosed, setIsAlertClosed] = useState(false);

  const homeService = texts.pages.client['home-service'] as HomeServicePageTexts;

  return (
    <main className={styles.main}>
      {!auth?.isLogged && !isAlertClosed && (
        <AuthRequiredAlert
          texts={homeService.authAlert}
          lang={lang}
          onClose={() => setIsAlertClosed(true)}
        />
      )}

      <PageHero texts={homeService.hero} lang={lang} />

      <section className={styles.content}>
        <article className={styles.panel}>
          <HomeServiceRequestForm
            texts={homeService.form}
            canSubmit={Boolean(auth?.isLogged)}
            onRequireAuth={() => setIsAlertClosed(false)}
            onSubmit={async () => {
              return;
            }}
          />
        </article>
      </section>
    </main>
  );
}
