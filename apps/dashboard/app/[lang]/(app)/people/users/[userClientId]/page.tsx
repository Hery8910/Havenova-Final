import { redirect } from 'next/navigation';

type TenantUserDetailPageProps = {
  params: {
    lang: 'de' | 'en' | 'es';
    userClientId: string;
  };
};

export default function TenantUserDetailPage({ params }: TenantUserDetailPageProps) {
  redirect(
    `/${params.lang}/people/users?selected=${encodeURIComponent(params.userClientId)}&mode=detail`
  );
}
