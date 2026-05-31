'use client';

import { useI18n } from '@/packages/contexts/i18n/I18nContext';

export default function OrdersPage() {
  const { texts } = useI18n();
  const title = texts.components?.dashboard?.sideNav?.user?.pages?.workOrders ?? 'Work orders';

  return (
    <section aria-labelledby="profile-orders-title">
      <h2 id="profile-orders-title">{title}</h2>
    </section>
  );
}
