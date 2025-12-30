'use client';
import { useEffect, useState } from 'react';

import { useClient } from '../../../../../packages/contexts/client';
import { useI18n } from '../../../../../packages/contexts/i18n/I18nContext';
import { useLang } from '../../../../../packages/hooks/useLang';

import { useRouter } from 'next/navigation';

import { href } from '../../../../../packages/utils/navigation';
import { Loading } from '../../../../../packages/components';

export type HomeCtaCase = 'hero' | 'offer' | 'about' | 'services' | 'review' | 'faq' | 'ctaFinal';

export default function Home() {
  const { client, loading } = useClient();
  const router = useRouter();
  const lang = useLang();
  const { texts } = useI18n();

  // const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth <= 1000);
  //   };

  //   handleResize();
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  const handleNavigation = (section: HomeCtaCase) => {
    switch (section) {
      case 'hero':
        router.push(href(lang, '/services'));
        break;
      case 'offer':
        router.push(href(lang, '/user/register'));
        break;
      case 'about':
        router.push(href(lang, '/about'));
        break;
      case 'services':
        router.push(href(lang, '/services'));
        break;
      case 'review':
        router.push(href(lang, '/reviews'));
        break;
      case 'ctaFinal':
        router.push(href(lang, '/services'));
        break;
      default:
        console.warn(`No redirect defined for ${section}`);
    }
  };

  return (
    <main>
      <p>hero</p>
    </main>
  );
}
