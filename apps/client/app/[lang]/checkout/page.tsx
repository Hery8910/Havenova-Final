'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Calendar } from '@/packages/components/dashboard/calendar';
import {
  getRequestItemsFromStorage,
  removeRequestItemFromStorage,
  clearAllRequestItemsFromStorage,
} from '@/packages/utils/serviceRequest';
import { Button } from '@/packages/components/common';
import { ServicesRequestList } from '@/packages/components/services/servicesRequestList';
import Image from 'next/image';
import { useUser } from '@/packages/contexts/user';
import { useI18n } from '@/packages/contexts/i18n';
import { ServiceRequestItem } from '../../../../../packages/types';
import { Loading } from '../../../../../packages/components/loading';
import { AlertWrapper } from '../../../../../packages/components/alert';
import { useClient } from '../../../../../packages/contexts/client/ClientContext';
import { getCalendarAvailability } from '@/packages/services/calendar';

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
  const { user } = useUser();
  const { client } = useClient();
  const { texts } = useI18n();

  const checkoutTexts = texts?.pages?.checkout || {
    heading: 'Checkout',
    description: 'Review your service requests before submitting them.',
    empty: 'No requests found. Please add a service first.',
    total: 'Total estimated price',
    clearAll: 'Clear all',
    sendRequest: 'Submit request',
  };
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<any>(null);
  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);

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
        console.log(data);

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
      {loading && <Loading theme={user?.theme || 'light'} />}
      {!loading && alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}
      <header className={styles.header}>
        <h1>{checkoutTexts.heading}</h1>
        <p>{checkoutTexts.description}</p>
      </header>
      <Calendar />
      <ServicesRequestList />
    </main>
  );
};

export default CheckoutPage;
