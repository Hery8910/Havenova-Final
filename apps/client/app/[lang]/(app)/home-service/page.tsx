import { resources, type Locale } from '@havenova/i18n';
import {
  HomeServicePageClient,
  type HomeServicePageTexts,
} from '../../../../../../packages/components/client/pages/home-service';
export default function HomeService({
  params,
}: {
  params: {
    lang: Locale;
  };
}) {
  const locale = resources[params.lang] ? params.lang : 'de';
  const texts = resources[locale];
  const homeService = texts?.pages?.client?.['home-service'] as HomeServicePageTexts | undefined;

  return <HomeServicePageClient homeService={homeService} lang={locale} />;
}
