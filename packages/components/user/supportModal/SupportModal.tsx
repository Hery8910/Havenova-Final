// 'use client';
// import React, { useState } from 'react';
// import styles from './SupportModal.module.css';
// import { IoMdMail } from 'react-icons/io';
// import { FaWhatsapp } from 'react-icons/fa';
// import { IoClose } from 'react-icons/io5';
// import { BiSupport } from 'react-icons/bi';

// interface SupportModalProps {
//   context: 'user-profile' | 'admin-dashboard';
// }

// const SupportModal: React.FC<SupportModalProps> = ({ context }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const email =
//     context === 'admin-dashboard' ? 'contact@heribertosantana.de' : 'contact@havenova.de';
//   const whatsapp =
//     context === 'admin-dashboard'
//       ? 'https://wa.me/491777312606' // Tu número personal
//       : 'https://wa.me/4917670917803'; // Número de soporte general

//   return (
//     <>
//       {!isOpen ? (
//         <button className={styles.button} onClick={() => setIsOpen(true)}>
//           <BiSupport /> Support
//         </button>
//       ) : (
//         <div className={styles.overlay}>
//           <div className={styles.modal}>
//             <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
//               <IoClose size={20} />
//             </button>
//             <h2 className={styles.title}>¿Necesitas ayuda?</h2>
//             <p className={styles.text}>Elige una forma de contacto:</p>
//             <div className={styles.actions}>
//               <a href={`mailto:${email}`} className={styles.option}>
//                 <IoMdMail size={20} />
//                 <span>Enviar correo</span>
//               </a>
//               <a
//                 href={whatsapp}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className={styles.option}
//               >
//                 <FaWhatsapp size={20} />
//                 <span>WhatsApp</span>
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SupportModal;
