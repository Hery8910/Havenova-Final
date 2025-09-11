// import React, { useState } from 'react';
// import styles from './AvatarSelector.module.css';
// import Image from 'next/image';
// import ImageUpload from '../../imageUpload/ImageUpload';
// import { useUser } from '../../../contexts/UserContext';
// import { useClient } from '../../../contexts/ClientContext';
// import { AvatarSelectorPayload } from '../../../types/User';
// import { updateUser } from '../../../services/userService';
// import { AlertPopup } from '../../alertPopup/AlertPopup'; // Ajusta la ruta si es necesario
// import { useI18n } from '../../../contexts/I18nContext';
// import { IoClose } from 'react-icons/io5';

// const avatarList = Array.from({ length: 10 }, (_, i) => `/avatars/avatar-${i + 1}.svg`);

// export default function AvatarSelector() {
//   const [open, setOpen] = useState(false);
//   const { user, refreshUser } = useUser();
//   const { client } = useClient();
//   const { texts } = useI18n();
//   const popups = texts.popups;
//   const [formData, setFormData] = useState<AvatarSelectorPayload>({
//     email: user?.email || '',
//     profileImage: user?.profileImage || '',
//     clientId: client?._id || '',
//   });

//   const [alert, setAlert] = useState<{
//     type: 'success' | 'error';
//     title: string;
//     description: string;
//   } | null>(null);

//   const handleAvatarSelect = (src: string) => {
//     setFormData((prev) => ({ ...prev, profileImage: src }));
//   };

//   const handleImageUpload = (url: string) => {
//     setFormData((prev) => ({ ...prev, profileImage: url }));
//   };

//   // --- Handle Submit ---
//   const handleSubmit = async () => {
//     try {
//       if (!formData.email || !formData.clientId || !formData.profileImage) {
//         setAlert({
//           type: 'error',
//           title: popups.GLOBAL_INTERNAL_ERROR.title,
//           description: popups.GLOBAL_INTERNAL_ERROR.description,
//         });
//         return;
//       }
//       const response = await updateUser(formData);
//       if (response.success) {
//         const popupData = popups?.[response.code] || {};
//         setAlert({
//           type: 'success',
//           title: popupData.title || popups.USER_EDIT_USER_UPDATE_SUCCESS.title,
//           description: popupData.description || popups.USER_EDIT_USER_UPDATE_SUCCESS.description,
//         });
//         await refreshUser(); // Para refrescar el contexto y mostrar la nueva imagen
//         setOpen(false);
//         setTimeout(() => {
//           setAlert(null);
//         }, 3000);
//       }
//     } catch (error: any) {
//       if (error.response && error.response.data) {
//         const errorKey = error.response.data.errorCode;
//         const popupData = popups?.[errorKey] || {};
//         setAlert({
//           type: 'error',
//           title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
//           description:
//             popupData.description ||
//             error.response.data.message ||
//             popups.GLOBAL_INTERNAL_ERROR.description,
//         });
//       } else {
//         setAlert({
//           type: 'error',
//           title: popups.GLOBAL_INTERNAL_ERROR.title,
//           description: popups.GLOBAL_INTERNAL_ERROR.description,
//         });
//       }
//     }
//   };

//   return (
//     <>
//       <main className={styles.main}>
//         <button type="button" onClick={() => setOpen(true)} className="button_invert">
//           Change Profile Image
//         </button>
//         {open && (
//           <article className={styles.article}>
//             <button type="button" onClick={() => setOpen(false)} className="button_close">
//               <IoClose />
//             </button>
//             <aside className={styles.aside}>
//               <ul className={styles.ul}>
//                 {avatarList.map((src) => (
//                   <li className={styles.li} key={src}>
//                     <Image
//                       className={`${styles.image} ${
//                         formData.profileImage === src ? styles.selected : ''
//                       }`}
//                       src={src}
//                       alt="Profile Image"
//                       width={60}
//                       height={60}
//                       onClick={() => handleAvatarSelect(src)}
//                     />
//                   </li>
//                 ))}
//               </ul>
//               <ImageUpload
//                 label="Featured Image"
//                 uploadPreset="havenova_upload"
//                 cloudName="dd1i5d0iq"
//                 initialImage={''}
//                 onUpload={(url) => handleImageUpload(url)}
//                 width="350px"
//                 aspectRatio={1 / 1}
//               />
//             </aside>
//             <button type="button" onClick={handleSubmit} className="button_invert">
//               Choose Selected
//             </button>
//           </article>
//         )}
//       </main>
//       {alert && (
//         <AlertPopup
//           type={alert.type}
//           title={alert.title}
//           description={alert.description}
//           onClose={() => setAlert(null)}
//         />
//       )}
//     </>
//   );
// }
