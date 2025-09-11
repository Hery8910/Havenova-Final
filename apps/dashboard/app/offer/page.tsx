'use client';

import React, { useEffect, useState } from 'react';
import { getAllOffers } from '../../../../packages/services/offers';
import styles from './page.module.css';
import { Offer, OfferDB } from '../../../../packages/types/offers';
// import OfferForm from '../../../../packages/components/offerForm/OfferForm';
// import { OfferList } from '../../../../packages/components/offerList/OfferList';

const OfferDashboard: React.FC = () => {
  const [offers, setOffers] = useState<OfferDB[]>([]);
  const [editingOffer, setEditingOffer] = useState<OfferDB | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadOffers = async () => {
    try {
      const data = await getAllOffers();
      setOffers(data);
    } catch (err) {
      console.error('Error loading offers', err);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleEdit = (offer: OfferDB) => {
    setEditingOffer(offer);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setEditingOffer(null);
    setShowForm(true);
  };

  return (
    <main className={styles.main}>
      {/* <header className={styles.header}>
        <h2 className={styles.h2}>Manage Offers</h2>
        <aside className={styles.aside}>
          <button
            className={`${styles.button} ${!showForm && styles.button_active}`}
            onClick={() => setShowForm(false)}
          >
            Offers List
          </button>
          <button
            className={`${styles.button} ${showForm && styles.button_active}`}
            onClick={handleCreateNew}
          >
            Create Offer
            <span className={`${styles.span} ${showForm && styles.span_active}`}></span>
          </button>
        </aside>
      </header>
      {showForm ? (
        <OfferForm
          editOffer={editingOffer}
          onSuccess={() => {
            setShowForm(false);
            setEditingOffer(null);
            loadOffers();
          }}
        />
      ) : (
        <OfferList offers={offers} dashboard handleEdit={handleEdit} />
      )} */}
    </main>
  );
};

export default OfferDashboard;
