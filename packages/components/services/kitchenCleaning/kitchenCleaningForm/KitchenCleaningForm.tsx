'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './KitchenCleaningForm.module.css';
import Image from 'next/image';
import { serviceIcon, ServiceRequestItem, KitchenCleaningData } from '../../../../types/services';
import { useUser } from '../../../../contexts/UserContext';
import { handleServiceRequest } from '../../../../services/serviceRequestHandler';
import successAnimation from '../../../../../public/animation/success.json';
import ConfirmationAlert from '../../../confirmationAlert/ConfirmationAlert';
import { useRouter } from 'next/navigation';
import Select from '../../../select/Select';

const KitchenCleaningForm = () => {
  const applianceOptions = [
    {
      name: 'Refrigerator',
      icon: { src: '/svg/refrigerator.svg', alt: 'Refrigerator' },
    },
    {
      name: 'Dishwasher',
      icon: { src: '/svg/dishwasher.svg', alt: 'Dishwasher' },
    },
    {
      name: 'Cooktop',
      icon: { src: '/svg/cooktop.svg', alt: 'Cooktop' },
    },
    {
      name: 'Oven',
      icon: { src: '/svg/oven.svg', alt: 'Oven' },
    },
    {
      name: 'Extractor',
      icon: { src: '/svg/extractor.svg', alt: 'Extractor' },
    },
    {
      name: 'Washing Machine',
      icon: {
        src: '/svg/washing-machine.svg',
        alt: 'Washing Machine',
      },
    },
    {
      name: 'Sink',
      icon: { src: '/svg/sink.svg', alt: 'Sink' },
    },
  ];
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const { user, refreshUser, addRequestToUser } = useUser();
  const [icon, setIcon] = useState<serviceIcon>({
    src: '/svg/windowColor.svg',
    alt: 'Kitchen icon',
  });
  const [formData, setFormData] = useState<KitchenCleaningData>({
    title: 'Kitchen Cleaning',
    icon: {
      src: '/svg/windows-cleaning.svg',
      alt: 'Window icon',
    },
    size: 0,
    appliances: [],
    notes: '',
  });

  const handleApplianceChange = (selected: string[]) => {
    setFormData((prev) => ({
      ...prev,
      appliances: selected,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const typedValue = type === 'number' ? parseFloat(value) || '' : value;

    setFormData((prev) => ({
      ...prev,
      [name]: typedValue,
      title: 'Kitchen Cleaning',
      icon: {
        src: icon.src,
        alt: icon.alt,
      },
    }));
  };

  const handleAdjust = (field: 'size', action: 'add' | 'subtract') => {
    setFormData((prev) => {
      const current = prev[field];
      const updated = action === 'add' ? current + 1 : Math.max(0, current - 1);
      return {
        ...prev,
        [field]: updated,
      };
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: ServiceRequestItem = {
      id: uuidv4(),
      serviceType: 'kitchen-cleaning',
      price: 0,
      estimatedDuration: 0,
      details: formData,
    };
    try {
      await handleServiceRequest({
        user,
        newRequest,
        addRequestToUser,
      });
      setFormData({
        title: 'Kitchen Cleaning',
        icon: {
          src: '/svg/kitchen-cleaning.svg',
          alt: 'Window icon',
        },
        appliances: [],
        size: 0,
        notes: '',
      });
      setAlertOpen(true);
      refreshUser();
    } catch (err) {
      console.error('❌ Error saving to cart:', err);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <header className={styles.header}>
          <Image
            className={styles.header_image}
            src="/svg/kitchen-cleaning.svg"
            priority={true}
            alt="Kitchen Icon"
            width={70}
            height={70}
          />
          <h3>{formData.title}</h3>
        </header>
        <div className={styles.form_div}>
          <label className={styles.label}>Size</label>
          <div className={styles.div}>
            <input
              className={styles.input}
              type="number"
              name="size"
              value={formData.size || ''}
              onChange={handleChange}
              placeholder="0"
            />
            <label className={styles.label}>m²</label>
          </div>
        </div>
        <Select
          label="Appliances"
          options={applianceOptions}
          onChange={handleApplianceChange}
          multiple
        />

        <textarea
          className={styles.textarea}
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="Leave us a comment"
        />

        <button className={styles.submit} type="submit">
          Submit
        </button>
      </form>
      {alertOpen && (
        <ConfirmationAlert
          title="Your request has been submitted!"
          message="Do you want to continue to checkout or keep browsing for more services?"
          animationData={successAnimation}
          confirmLabel="Go to Checkout"
          cancelLabel="Keep Browsing"
          extraClass="success"
          onCancel={() => setAlertOpen(false)}
          onConfirm={() => {
            router.push('/checkout');
          }}
        />
      )}
    </>
  );
};

export default KitchenCleaningForm;
