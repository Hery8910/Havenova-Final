'use client';
import React from 'react';
import styles from './ConfirmationAlert.module.css';
const ConfirmationAlert = ({ title, message, animationData, confirmLabel = 'Confirm', cancelLabel = 'Cancel', extraClass = '', onConfirm, onCancel, }) => {
    return (<main className={styles.section_main}>
      <article className={styles.section_article}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.message}>{message}</p>
        <div className={styles.button_group}>
          <button className={styles.cancel_button} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={extraClass ? styles[`${extraClass}_button`] : styles.confirm_button} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </article>
    </main>);
};
export default ConfirmationAlert;
