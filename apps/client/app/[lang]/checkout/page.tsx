'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import {
  getRequestItemsFromStorage,
  removeRequestItemFromStorage,
  clearAllRequestItemsFromStorage,
} from '@/packages/utils/serviceRequest';
import { Button } from '@/packages/components/common';
import { ServiceCart } from '@/packages/components/services';
import Image from 'next/image';
import { useUser } from '@/packages/contexts/user';
import { useI18n } from '@/packages/contexts/i18n';
import { ServiceRequestItem } from '../../../../../packages/types';
import { Loading } from '../../../../../packages/components/loading';
import { AlertWrapper } from '../../../../../packages/components/alert';

const CheckoutPage = () => {
  const { user } = useUser();
  const { texts } = useI18n();
  const checkoutTexts = texts?.pages?.checkout || {
    heading: 'Checkout',
    description: 'Review your service requests before submitting them.',
    empty: 'No requests found. Please add a service first.',
    total: 'Total estimated price',
    clearAll: 'Clear all',
    sendRequest: 'Submit request',
  };

  const [requests, setRequests] = useState<ServiceRequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const items = getRequestItemsFromStorage();
    setRequests(items);
  }, []);

  // const handleRemove = (index: number) => {
  //   removeRequestItemFromStorage(index);
  //   const updated = getRequestItemsFromStorage();
  //   setRequests(updated);

  //   setAlert({
  //     status: 200,
  //     title: 'Item removed',
  //     description: 'The service request has been removed successfully.',
  //   });
  // };

  // const handleClearAll = () => {
  //   clearAllRequestItemsFromStorage();
  //   setRequests([]);

  //   setAlert({
  //     status: 200,
  //     title: 'All cleared',
  //     description: 'All service requests have been removed.',
  //   });
  // };

  // const handleSubmitAll = async () => {
  //   if (!requests.length) {
  //     setAlert({
  //       status: 400,
  //       title: 'No requests',
  //       description: 'You have no requests to submit.',
  //     });
  //     return;
  //   }

  //   // 🟢 Este será el paso donde conectaremos con el backend más adelante
  //   // Por ahora solo mostramos un mensaje simulado
  //   setAlert({
  //     status: 200,
  //     title: 'Submitted!',
  //     description: 'Your service requests have been submitted successfully.',
  //   });

  //   clearAllRequestItemsFromStorage();
  //   setRequests([]);
  // };

  // const totalPrice = requests.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <section className={styles.main}>
      {loading && <Loading theme={user?.theme || 'light'} />}
      {!loading && alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}

      <header className={styles.header}>
        <h1>{checkoutTexts.heading}</h1>
        <p>{checkoutTexts.description}</p>
      </header>

      {requests.length === 0 ? (
        <p className={styles.empty}>{checkoutTexts.empty}</p>
      ) : (
        // <>
        //   <ul className={styles.list}>
        //     {requests.map((req, index) => (
        //       <li key={req.id} className={`${styles.item} card`}>
        //         <div className={styles.item_info}>
        //           {req.icon && (
        //             <Image
        //               src={req.icon.src}
        //               alt={req.icon.alt}
        //               width={50}
        //               height={50}
        //               className={styles.icon}
        //             />
        //           )}
        //           <div className={styles.texts}>
        //             <h3>{req.details.title}</h3>
        //             {/* <p>
        //               {req.serviceType.replace('-', ' ')} —{' '}
        //               {req.details.location || 'No location specified'}
        //             </p> */}
        //             {/* {req.details.type && (
        //               <p>
        //                 <strong>Type:</strong> {req.details.type}
        //               </p>
        //             )} */}
        //             {req.details.notes && <p>{req.details.notes}</p>}
        //           </div>
        //         </div>
        //         <div className={styles.actions}>
        //           <p className={styles.price}>{req.price ? `${req.price} €` : '—'}</p>
        //           <Button
        //             cta="Remove"
        //             variant="solid"
        //             icon={'cancel'}
        //             onClick={() => handleRemove(index)}
        //           />
        //         </div>
        //       </li>
        //     ))}
        //   </ul>

        //   <footer className={styles.footer}>
        //     <div className={styles.total}>
        //       <strong>{checkoutTexts.total}:</strong>
        //       <span>{totalPrice.toFixed(2)} €</span>
        //     </div>
        //     <div className={styles.footer_buttons}>
        //       <Button
        //         cta={checkoutTexts.clearAll}
        //         variant="outline"
        //         icon={'back'}
        //         onClick={handleClearAll}
        //       />
        //       <Button
        //         cta={checkoutTexts.sendRequest}
        //         variant="solid"
        //         icon={'forward'}
        //         onClick={handleSubmitAll}
        //       />
        //     </div>
        //   </footer>
        // </>
        <ServiceCart />
      )}
    </section>
  );
};

export default CheckoutPage;
