import { resources, type Locale } from '@havenova/i18n';
import {
  CleaningServicePageClient,
  type CleaningServicePageTexts,
} from '../../../../../../packages/components/client/pages/cleaning-service';

export default function CleaningService({
  params,
}: {
  params: {
    lang: Locale;
  };
}) {
  const locale = resources[params.lang] ? params.lang : 'de';
  const texts = resources[locale];
  const cleaning = texts?.pages?.client?.cleaning as CleaningServicePageTexts | undefined;

  return <CleaningServicePageClient cleaning={cleaning} lang={locale} />;
}
