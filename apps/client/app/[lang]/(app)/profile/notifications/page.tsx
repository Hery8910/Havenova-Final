import { ProfileSubroutePlaceholder } from '../ProfileSubroutePlaceholder';
import { getProfileSubroutePlaceholder } from '../profileSubroutePlaceholders';

export default function NotificationsPage({
  params,
}: {
  params: { lang: 'de' | 'en' | 'es' };
}) {
  const copy = getProfileSubroutePlaceholder('notifications', params.lang);

  return (
    <ProfileSubroutePlaceholder
      {...copy}
      routePath={`/${params.lang}/profile/notifications`}
    />
  );
}
