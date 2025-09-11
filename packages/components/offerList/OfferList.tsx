// import { useEffect, useState } from 'react';
// import { deleteOffer, getAllOffers } from '../../services/offers';
// import { OfferDB } from '../../types/offers';
// import Image from 'next/image';
// import styles from './OfferList.module.css';
// import { useRouter } from 'next/navigation';
// import { FiEdit3 } from 'react-icons/fi';
// import { FaRegTrashCan } from 'react-icons/fa6';
// import ConfirmationAlert from '../confirmationAlert/ConfirmationAlert';
// import OfferCard from '../offerCard/OfferCard';

// interface OfferListProps {
//   offers: OfferDB[];
//   dashboard: boolean;
//   handleDelete?: (id: string) => void;
//   handleEdit?: (offer: OfferDB) => void;
// }

// export const OfferList = ({ offers, dashboard, handleEdit }: OfferListProps) => {
//   const router = useRouter();
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [openBlogId, setOpenBlogId] = useState<string | null>(null);

//   if (!offers) return <p>Loading...</p>;

//   const handleDelete = async (offerId: string) => {
//     try {
//       await deleteOffer(offerId);
//     } catch (err) {
//       console.error('Error deleting offer', err);
//     }
//   };

//   return (
//     <section className={styles.section}>
//       <ul className={styles.ul}>
//         {offers.map((offer) => (
//           <li key={offer._id} className={styles.li}>
//             <OfferCard offer={offer} preview dashboard />
//             {dashboard && handleEdit && handleDelete && (
//               <aside className={styles.aside}>
//                 <button className={styles.edit} onClick={() => handleEdit(offer)}>
//                   Edit <FiEdit3 />
//                 </button>
//                 <button
//                   type="button"
//                   className={styles.delete_button}
//                   onClick={() => setOpenBlogId(offer._id)}
//                 >
//                   <FaRegTrashCan />
//                 </button>
//                 {openBlogId === offer._id && (
//                   <ConfirmationAlert
//                     title="Are you sure you want to delete this Offer?"
//                     message=""
//                     onCancel={() => setOpenBlogId(null)}
//                     onConfirm={() => handleDelete(offer._id!)}
//                   />
//                 )}
//               </aside>
//             )}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// };
