'use client';
import React, { useState } from 'react';
import { useUser } from '../../../../contexts/UserContext';
import styles from './KitchenAssemblyRequest.module.css';
import { ServiceRequestItem } from '../../../../types/services';
import Image from 'next/image';
import attentionAnimation from '../../../../../public/animation/attention.json';
import ConfirmationAlert from '../../../confirmationAlert/ConfirmationAlert';

interface Props {
  requests: Extract<ServiceRequestItem, { serviceType: 'kitchen-assembly' }>[];
}

const KitchenAssemblyRequest = ({ requests }: Props) => {
  const { removeRequestFromUser } = useUser();
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className={styles.ul}>
      {requests.map((item) => (
        <li className={styles.li} key={item.id}>
          <header className={styles.header}>
            <h3>{item.details.title}</h3>
          </header>

          <main className={styles.main}>
            <article className={styles.first_div}>
              <Image
                className={styles.image}
                src={item.details.icon.src}
                alt={item.details.icon.alt}
                width={50}
                height={50}
              />
              <div className={styles.div}>
                <p>
                  <strong>{item.details.length} m</strong>
                </p>
                <p>{item.details.layout} Layout Kitchen</p>
              </div>
            </article>

            <button
              key={item.id}
              className={styles.button}
              onMouseEnter={() => setHoverId(item.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => setOpenId(item.id)}
            >
              <Image
                className={styles.image}
                src="/svg/delete.svg"
                alt="Delete icon"
                width={20}
                height={20}
              />{' '}
              {hoverId === item.id && <p className={styles.delete}>Delete</p>}
            </button>
          </main>
          {openId === item.id && (
            <ConfirmationAlert
              title="Are you sure you want to delete this request?"
              message="This action cannot be undone."
              animationData={attentionAnimation}
              onCancel={() => setOpenId(null)}
              onConfirm={() => {
                removeRequestFromUser(item.id);
                setOpenId(null);
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default KitchenAssemblyRequest;
