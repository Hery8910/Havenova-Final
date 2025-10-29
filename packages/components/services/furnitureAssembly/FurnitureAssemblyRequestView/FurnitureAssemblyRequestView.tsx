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
import { useI18n } from '../../../../contexts/i18n';

interface Props {
  requests: FurnitureAssemblyRequest[];
  onClick: (id: string) => void;
  reloadRequests: () => void;
}

const FurnitureAssemblyRequestView = ({ requests, onClick, reloadRequests }: Props) => {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const { texts } = useI18n();
  const furnitureAssembly = texts?.components?.services?.furnitureAssembly;
  return (
    <ul className={styles.ul}>
      <li className={styles.header_li}>
        <h4>{furnitureAssembly.form.header.title}</h4>
      </li>
      {requests.map((item) => (
        <li className={`${styles.li} card`} key={item.id}>
          <header className={styles.header}>
            <h4>{furnitureAssembly.steps.step3.step}</h4>
            <Image className={styles.image} src={item.icon} alt="" width={70} height={70} />
          </header>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>{furnitureAssembly.furniture.title}</th>
                <td>{furnitureAssembly.furniture[item.details.type]}</td>
              </tr>
              <tr>
                <th>{furnitureAssembly.locations.title}</th>
                <td>{furnitureAssembly.locations[item.details.location]}</td>
              </tr>
              <tr>
                <th>{furnitureAssembly.form.input.quantity}</th>
                <td>{item.details.quantity}</td>
              </tr>
            </tbody>
          </table>
          <button
            className={styles.edit_button}
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
          >
            {editingId === item.id ? 'Close' : 'More...'}
          </button>
          {openId === item.id && (
            <div className={styles.div}>
              <p>
                <strong>{furnitureAssembly.locations[item.details.location]}</strong>
              </p>
              <p>{furnitureAssembly.furniture[item.details.type]}</p>
            </div>
          )}
          {/* <button
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
            className={styles.edit_button}
            onClick={() => setEditingId(editingId === item.id ? null : item.id)}
          >
            {editingId === item.id ? 'Cancel' : 'Edit...'}
          </button> */}
          {editingId === item.id && (
            <FurnitureAssemblyForm
              request={item}
              setEdit={() => setEditingId(null)} // 👈 cierra el form al guardar
              onUpdated={reloadRequests} // 👈 refresca los datos al terminar
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default FurnitureAssemblyRequestView;
