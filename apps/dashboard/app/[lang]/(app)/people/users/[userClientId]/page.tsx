import { redirect } from 'next/navigation';

type TenantUserDetailPageProps = {
  params: {
    lang: 'de' | 'en' | 'es';
    userClientId: string;
  };
};

export default function TenantUserDetailPage({ params }: TenantUserDetailPageProps) {
  const entryId = `user:${params.userClientId}`;

  redirect(
    `/${params.lang}/people/users?selected=${encodeURIComponent(entryId)}&mode=detail`
  );
}
