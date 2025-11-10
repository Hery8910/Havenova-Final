'use client';
import React, { useState } from 'react';
import styles from './FurnitureAssemblyRequestView.module.css';
import { useGlobalAlert } from '../../../../contexts/alert/AlertContext';
import Image from 'next/image';
import {
  furnitureTypes,
  getServiceInputSchema,
} from '../furnitureAssemblyForm/furnitureAssembly.data';
import { FurnitureAssemblyForm } from '../furnitureAssemblyForm';
import { useI18n } from '../../../../contexts/i18n';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { FurnitureAssemblyRequest } from '../furnitureAssemblyForm/furnitureAssembly.types';
import { removeRequestItemFromStorage } from '../../../../utils/serviceRequest';

interface Props {
  requests: FurnitureAssemblyRequest[];
  onClick: (id: string) => void;
  reloadRequests: () => void;
}

const FurnitureAssemblyRequestView = ({ requests, onClick, reloadRequests }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const { texts } = useI18n();
  const viewText = texts?.components?.services?.furnitureAssembly.view;
  const furnitureAssembly = texts?.components?.services?.furnitureAssembly;
  const { showConfirm, closeAlert } = useGlobalAlert();

  const handleDelete = (id: string) => {
    showConfirm({
      response: {
        status: 400, // se usa para estilo “warning”
        title: viewText.deleteConfirm.title,
        description: viewText.deleteConfirm.description,
        confirmLabel: viewText.deleteConfirm.confirm,
        cancelLabel: viewText.deleteConfirm.cancel,
      },
      onConfirm: () => {
        removeRequestItemFromStorage(id);
        reloadRequests();
        closeAlert(); // 👈 cierra el modal tras eliminar
      },
      onCancel: closeAlert, // 👈 cierra sin eliminar
    });
  };

  return (
    <ul className={styles.ul}>
      {requests.map((item) => {
        const input = getServiceInputSchema(
          furnitureTypes,
          item.details.location,
          item.details.type
        );
        return (
          <li className={styles.li} key={item.id}>
            {editingId === item.id ? (
              <FurnitureAssemblyForm
                request={item}
                setEdit={() => setEditingId(null)} // 👈 cierra el form al guardar
                onUpdated={reloadRequests} // 👈 refresca los datos al terminar
              />
            ) : (
              <>
                <header className={styles.header}>
                  <Image className={styles.image} src={item.icon} alt="" width={50} height={50} />
                  <article className={styles.article}>
                    <p>
                      {' '}
                      <strong>{furnitureAssembly.form.header.title}</strong>
                    </p>
                    <p>{furnitureAssembly.furniture[item.details.type]}</p>
                  </article>
                  <button
                    className={styles.open_button}
                    onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  >
                    {openId !== item.id ? (
                      <span className={styles.span}>
                        {viewText.openButton.open} <IoIosArrowDown />
                      </span>
                    ) : (
                      <span className={styles.span}>
                        {viewText.openButton.close} <IoIosArrowUp />
                      </span>
                    )}
                  </button>
                </header>

                {openId === item.id && (
                  <aside className={styles.aside}>
                    <p>
                      <strong>{viewText.title}</strong>
                    </p>
                    <table className={styles.table}>
                      <tbody>
                        <tr>
                          <th>{furnitureAssembly.form.input.quantity}</th>
                          <td>{item.details.quantity}</td>
                        </tr>
                        {input.width && (
                          <tr>
                            <th>{furnitureAssembly.form.input.width}</th>
                            <td>{item.details.width} cm</td>
                          </tr>
                        )}
                        {input.height && (
                          <tr>
                            <th>{furnitureAssembly.form.input.height}</th>
                            <td>{item.details.height} cm</td>
                          </tr>
                        )}
                        {input.depth && (
                          <tr>
                            <th>{furnitureAssembly.form.input.depth}</th>
                            <td>{item.details.depth} cm</td>
                          </tr>
                        )}
                        {input.doors && (
                          <tr>
                            <th>{furnitureAssembly.form.input.doors}</th>
                            <td>{item.details.doors}</td>
                          </tr>
                        )}
                        {input.drawers && (
                          <tr>
                            <th>{furnitureAssembly.form.input.drawers}</th>
                            <td>{item.details.drawers}</td>
                          </tr>
                        )}
                        {input.wall && (
                          <tr>
                            <th>{furnitureAssembly.form.input.wall.title}</th>
                            <td>
                              {furnitureAssembly.form.input.wall[item.details.position] ??
                                furnitureAssembly.form.input.wall.title}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <th>{furnitureAssembly.form.input.details}</th>
                          <td>{item.details.notes}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className={styles.buttons}>
                      <button
                        className={styles.delete_button}
                        onClick={() => handleDelete(item.id)}
                      >
                        <span className={styles.span}>
                          {viewText.deleteButton} <MdDeleteForever />
                        </span>
                      </button>
                      <button
                        className={styles.open_button}
                        onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                      >
                        <span className={styles.span}>
                          {viewText.editButton} <MdEdit />
                        </span>
                      </button>
                    </div>
                  </aside>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default FurnitureAssemblyRequestView;
