import { ProfileSubroutePlaceholder } from '../ProfileSubroutePlaceholder';
import { getProfileSubroutePlaceholder } from '../profileSubroutePlaceholders';

export default function OrdersPage({
  params,
}: {
  params: { lang: 'de' | 'en' | 'es' };
}) {
  const copy = getProfileSubroutePlaceholder('orders', params.lang);

  return <ProfileSubroutePlaceholder {...copy} routePath={`/${params.lang}/profile/orders`} />;
}
