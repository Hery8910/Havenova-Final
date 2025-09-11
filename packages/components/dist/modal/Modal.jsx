import React from 'react';
import styles from './Modal.module.css';
const Modal = ({ show, onClose, iframeProps }) => {
    if (!show)
        return null;
    return (<div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          X
        </button>
        <iframe width={iframeProps.width || '100%'} height={iframeProps.height || 400} src={iframeProps.src} frameBorder={iframeProps.frameBorder ?? 0} scrolling={iframeProps.scrolling || 'auto'} allowFullScreen={iframeProps.allowFullScreen ?? true} style={iframeProps.style} title="Newsletter Subscription"></iframe>
      </div>
    </div>);
};
export default Modal;
