'use client';
import React, { useState } from 'react';
import styles from './FurnitureAssemblyRequestView.module.css';
import {
  FurnitureAssemblyDetails,
  FurnitureAssemblyRequest,
  ServiceRequestItem,
} from '../../../../types/services';
import Image from 'next/image';
import { useUser } from '../../../../contexts/user';
import { removeRequestItemFromStorage } from '../../../../utils/serviceRequest';
import { FurnitureAssemblyForm } from '../furnitureAssemblyForm';

interface Props {
  requests: FurnitureAssemblyRequest[];
  onClick: (id: string) => void;
}

const FurnitureAssemblyRequestView = ({ requests, onClick }: Props) => {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<FurnitureAssemblyDetails | null>(null);

  return (
    <ul className={styles.ul}>
      <li>Furniture Assembly</li>
      {requests.map((item) => (
        <li className={styles.li} key={item.id}>
          <main className={styles.main}>
            <article className={styles.first_div}>
              <Image
                className={styles.image}
                src={item.icon.src}
                alt={item.icon.alt}
                width={50}
                height={50}
              />
              <div className={styles.div}>
                <p>
                  <strong>{item.details.location}</strong>
                </p>
                <p>
                  {item.details.quantity}x {item.details.type}
                </p>
              </div>
            </article>

            <button
              key={item.id}
              className={styles.button}
              onMouseEnter={() => setHoverId(item.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => onClick(item.id)}
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
            <button
              onClick={() => {
                setSelectedRequest(item.details);
                setEdit(!edit);
              }}
            >
              Edit...
            </button>
          </main>
          {edit && selectedRequest && (
            <FurnitureAssemblyForm request={selectedRequest} setEdit={setEdit} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default FurnitureAssemblyRequestView;
