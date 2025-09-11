"use strict";
// 'use client';
// import { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import styles from './WindowsCleaningForm.module.css';
// import Image from 'next/image';
// import { serviceIcon, ServiceRequestItem, WindowCleaningData } from '../../../../types/services';
// import { useUser } from '../../../../contexts/UserContext';
// import successAnimation from '../../../../../public/animation/success.json';
// import { handleServiceRequest } from '../../../../services/serviceRequestHandler';
// import { useRouter } from 'next/navigation';
// import ConfirmationAlert from '../../../confirmationAlert/ConfirmationAlert';
// const WindowsCleaningForm = () => {
//   const router = useRouter();
//   const [alertOpen, setAlertOpen] = useState<boolean>(false);
//   const { user, refreshUser, addRequestToUser } = useUser();
//   const [icon, setIcon] = useState<serviceIcon>({
//     src: '/svg/windowColor.svg',
//     alt: 'Window icon',
//   });
//   const [formData, setFormData] = useState<WindowCleaningData>({
//     title: 'Windows Cleaning',
//     icon: {
//       src: '/svg/windows-cleaning.svg',
//       alt: 'Window icon',
//     },
//     windows: 1,
//     doors: 0,
//     access: 'no',
//     notes: '',
//   });
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     const typedValue = type === 'number' ? parseFloat(value) || '' : value;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: typedValue,
//       title: 'Window Cleaning',
//       icon: {
//         src: icon.src,
//         alt: icon.alt,
//       },
//     }));
//   };
//   const handleAdjust = (field: 'doors' | 'windows', action: 'add' | 'subtract') => {
//     setFormData((prev) => {
//       const current = prev[field];
//       const updated =
//         action === 'add'
//           ? current + 1
//           : field === 'windows'
//           ? Math.max(1, current - 1)
//           : Math.max(0, current - 1);
//       return {
//         ...prev,
//         [field]: updated,
//       };
//     });
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const newRequest: ServiceRequestItem = {
//       id: uuidv4(),
//       serviceType: 'window-cleaning',
//       price: 0,
//       estimatedDuration: 0,
//       details: formData,
//     };
//     try {
//       await handleServiceRequest({
//         user,
//         newRequest,
//         addRequestToUser,
//       });
//       setFormData({
//         title: 'Windows Cleaning',
//         icon: {
//           src: '/svg/windows-cleaning.svg',
//           alt: 'Window icon',
//         },
//         windows: 1,
//         doors: 0,
//         access: 'no',
//         notes: '',
//       });
//       setAlertOpen(true);
//       refreshUser();
//     } catch (err) {
//       console.error('❌ Error saving to cart:', err);
//     }
//   };
//   return (
//     <>
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <header className={styles.header}>
//           <Image
//             className={styles.header_image}
//             src="/svg/windows-cleaning.svg"
//             priority={true}
//             alt="Window Icon"
//             width={70}
//             height={70}
//           />
//           <h3>{formData.title}</h3>
//         </header>
//         <div className={styles.form_div}>
//           <div className={styles.div}>
//             <Image
//               className={styles.image}
//               src="/svg/windowBlack.svg"
//               priority={true}
//               alt="Window Icon"
//               width={30}
//               height={30}
//             />
//             <p>Windows</p>
//           </div>
//           <div className={styles.counter}>
//             <button
//               className={styles.rest_button}
//               type="button"
//               onClick={() => handleAdjust('windows', 'subtract')}
//             >
//               -
//             </button>
//             <p className={styles.counter_p}>{formData.windows}</p>
//             <button
//               className={styles.add_button}
//               type="button"
//               onClick={() => handleAdjust('windows', 'add')}
//             >
//               +
//             </button>
//           </div>
//         </div>
//         <div className={styles.form_div}>
//           <div className={styles.div}>
//             <Image
//               className={styles.image}
//               src="/svg/door.svg"
//               priority={true}
//               alt="Door Icon"
//               width={30}
//               height={30}
//             />
//             <p>Doors</p>
//           </div>
//           <div className={styles.counter}>
//             <button
//               className={styles.rest_button}
//               type="button"
//               onClick={() => handleAdjust('doors', 'subtract')}
//             >
//               -
//             </button>
//             <p className={styles.counter_p}>{formData.doors}</p>
//             <button
//               className={styles.add_button}
//               type="button"
//               onClick={() => handleAdjust('doors', 'add')}
//             >
//               +
//             </button>
//           </div>
//         </div>
//         <div className={styles.form_div}>
//           <div className={styles.div}>
//             <Image
//               className={styles.image}
//               src="/svg/windowAccess.svg"
//               priority={true}
//               alt="Window Icon"
//               width={30}
//               height={30}
//             />
//             <label className={styles.label}>Exterior Access?</label>
//           </div>
//           <label className={styles.switch}>
//             <input
//               type="checkbox"
//               checked={formData.access === 'yes'}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   access: e.target.checked ? 'yes' : 'no',
//                 }))
//               }
//             />
//             <span className={styles.slider}></span>
//           </label>
//         </div>
//         <textarea
//           className={styles.textarea}
//           name="notes"
//           value={formData.notes || ''}
//           onChange={handleChange}
//           placeholder="Leave us a comment"
//         />
//         <button className={styles.submit} type="submit">
//           Submit
//         </button>
//       </form>
//       {alertOpen && (
//         <ConfirmationAlert
//           title="Your request has been submitted!"
//           message="Do you want to continue to checkout or keep browsing for more services?"
//           animationData={successAnimation}
//           confirmLabel="Go to Checkout"
//           cancelLabel="Keep Browsing"
//           extraClass="success"
//           onCancel={() => setAlertOpen(false)}
//           onConfirm={() => {
//             router.push('/checkout');
//           }}
//         />
//       )}
//     </>
//   );
// };
// export default WindowsCleaningForm;
