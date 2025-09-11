"use strict";
// 'use client';
// import { useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { CSSTransition } from 'react-transition-group';
// import { Offer, OfferType } from '../../types/offers';
// import styles from './OfferCard.module.css';
// import { IoIosArrowForward } from 'react-icons/io';
// import { TbPointFilled } from 'react-icons/tb';
// interface OfferCardProps {
//   offer: Offer;
//   preview?: boolean;
//   dashboard?: boolean;
// }
// const OfferCard: React.FC<OfferCardProps> = ({ offer, preview, dashboard }) => {
//   const router = useRouter();
//   const nodeRef = useRef(null);
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const offerOptions = [
//     { name: 'Service Discount', value: 'SERVICE_DISCOUNT' },
//     { name: 'Membership Discount', value: 'MEMBERSHIP_DISCOUNT' },
//     { name: 'Referral Reward', value: 'REFERRAL_REWARD' },
//     { name: 'New Client Discount', value: 'NEW_CLIENT_DISCOUNT' },
//   ];
//   function getOfferTypeLabel(type: OfferType): string {
//     const match = offerOptions.find((option) => option.value === type);
//     return match ? match.name : 'Unknown';
//   }
//   return (
//     <main
//       onClick={() => {
//         setDetailsOpen(!detailsOpen);
//       }}
//       className={detailsOpen ? styles.main : styles.details_main}
//     >
//       <header className={!detailsOpen ? styles.header : styles.details_header}>
//         <Image
//           className={!detailsOpen ? styles.image : styles.details_image}
//           src={offer.featuredImage || '/images/blog-image-mock.webp'}
//           alt={offer.title}
//           width={350}
//           height={235}
//         />
//         <aside className={styles.aside}>
//           <h4 className={!detailsOpen ? styles.h4 : styles.details_h3}>{offer.title}</h4>
//           <p className={!detailsOpen ? styles.p : styles.pdetails_p}>{offer.description}</p>
//         </aside>
//         <div className={styles.div}>
//           <button
//             className="button_invert"
//             onClick={() => {
//               setDetailsOpen(!detailsOpen);
//             }}
//           >
//             {detailsOpen ? 'Close' : 'More'}
//           </button>
//           <button
//             className="button"
//             onClick={() => {
//               if (!preview) {
//                 router.push(offer.ctaAction);
//               }
//             }}
//           >
//             {offer.ctaText}
//           </button>
//         </div>
//       </header>
//       <CSSTransition
//         nodeRef={nodeRef}
//         in={detailsOpen}
//         timeout={500}
//         classNames={{
//           enter: styles.articleEnter,
//           enterActive: styles.articleEnterActive,
//           exit: styles.articleExit,
//           exitActive: styles.articleExitActive,
//         }}
//         unmountOnExit
//       >
//         <article ref={nodeRef} className={styles.article}>
//           <p className={styles.p}>{offer.details}</p>
//           <ul className={styles.ul}>
//             <li className={styles.li}>
//               <p>Status:</p>
//               <p
//                 style={{
//                   color: offer.active ? '#16a34a' : '#dc2626',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                 }}
//               >
//                 <TbPointFilled />
//                 {offer.active ? 'Active' : 'Inactive'}
//               </p>
//             </li>
//             <li className={styles.li}>
//               <p>Offer Percentage:</p>
//               <p>{offer.percentage} %</p>
//             </li>
//             <li className={styles.li}>
//               <p>Offer Type:</p>
//               <p>{getOfferTypeLabel(offer.type)}</p>
//             </li>
//             <li className={styles.li}>
//               <p>Start Date:</p>
//               <p>{new Date(offer.startDate).toLocaleDateString()}</p>
//             </li>
//             <li className={styles.li}>
//               <p>End Date:</p>
//               <p>{new Date(offer.endDate).toLocaleDateString()}</p>
//             </li>
//           </ul>
//         </article>
//       </CSSTransition>
//     </main>
//   );
// };
// export default OfferCard;
