'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Calendar } from '@/packages/components/dashboard/calendar';
import { CheckoutCart } from '@/packages/components/services/checkoutCart';
import { useI18n } from '@/packages/contexts/i18n';
import { Loading } from '../../../../../packages/components/loading';
import { useClient } from '../../../../../packages/contexts/client/ClientContext';
import { getCalendarAvailability } from '@/packages/services/calendar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useServiceCart } from '../../../../../packages/contexts';
import { Slot } from '../../../../../packages/utils/calendar/calendarUtils';
import { useRequireLogin } from '../../../../../packages/hooks/useRequireLogin';

export interface CalendarData {
  year: number;
  role: 'INSPECTOR';
  serviceType: string;
  months: {
    month: string;
    blockedSlots: {
      date: string;
      start: string;
      end: string;
      reason: 'holiday' | 'vacation' | 'manual' | 'other';
    }[];
  }[];
}

const CheckoutPage = () => {
  const { client } = useClient();
  const { totalCount } = useServiceCart();
  const { texts } = useI18n();
  const router = useRouter();

  const header = texts?.pages?.checkout.header;
  const denied = texts?.pages?.checkout.denied;

  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<any>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot>({
    start: '',
    end: '',
    available: true,
  });

  useRequireLogin();

  useEffect(() => {
    const loadCalendar = async () => {
      if (!client?._id) return;
      setLoading(true);
      try {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const data = await getCalendarAvailability({
          clientId: client._id,
          year: currentYear,
          month: currentMonth,
          role: 'INSPECTOR',
          serviceType: 'inspection',
        });
        setCalendarData(data);
      } catch (err) {
        console.error('Calendar fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCalendar();
  }, [client?._id]);

  return (
    <main className={styles.main}>
      <header className={`${styles.header} card`}>
        <Image
          src="/svg/check-list.svg"
          priority
          alt={denied.alt}
          width={100}
          height={100}
          className={styles.image}
        />
        <article className={styles.article}>
          <h1 className={styles.heading}>{header.heading}</h1>
          <p>{header.description}</p>
        </article>
      </header>

      <section className={styles.content}>
        <Calendar
          calendarData={calendarData}
          onSelectDate={(date, slot) => {
            setSelectedDate(date);
            setSelectedSlot(slot);
          }}
        />

        <CheckoutCart />
      </section>
    </main>
  );
};

export default CheckoutPage;
