import { ProfileSubroutePlaceholder } from '../ProfileSubroutePlaceholder';
import { getProfileSubroutePlaceholder } from '../profileSubroutePlaceholders';

export default function ProfileRequestsPage({
  params,
}: {
  params: { lang: 'de' | 'en' | 'es' };
}) {
  const copy = getProfileSubroutePlaceholder('requests', params.lang);

  return <ProfileSubroutePlaceholder {...copy} routePath={`/${params.lang}/profile/requests`} />;
}
