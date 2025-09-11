"use strict";
// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import styles from './Avatar.module.css';
// import { useUser } from '../../../contexts/UserContext';
// import { IoIosArrowForward } from 'react-icons/io';
// import Image from 'next/image';
// const Avatar = () => {
//   const router = useRouter();
//   const { user, refreshUser } = useUser();
//   const [isMobile, setIsMobile] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [hasMounted, setHasMounted] = useState(false);
//   useEffect(() => {
//     setHasMounted(true);
//   }, []);
//   useEffect(() => {
//     if (hasMounted) refreshUser();
//     // eslint-disable-next-line
//   }, [hasMounted]);
//   useEffect(() => {
//     if (!hasMounted) return;
//     const handleResize = () => setIsMobile(window.innerWidth <= 1000);
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [hasMounted]);
//   const handleClick = () => setMenuOpen(!menuOpen);
//   const handleLink = () => router.push('/user/profile');
//   // --- NUEVO: solo renderiza skeleton si no está montado (evita el error de mismatch)
//   if (!hasMounted || !user || !user.profileImage) {
//     return (
//       <section className={styles.section}>
//         <div className={styles.button} aria-label="Avatar loading">
//           <span
//             style={{
//               display: 'inline-block',
//               width: 40,
//               height: 40,
//               borderRadius: '50%',
//               background: 'linear-gradient(135deg, #888 40%, #ddd 60%)',
//               animation: 'pulse 1.5s infinite',
//             }}
//           />
//           <span
//             style={{
//               width: 80,
//               height: 18,
//               borderRadius: 8,
//               background: 'linear-gradient(135deg, #aaa 40%, #eee 60%)',
//               display: 'inline-block',
//               animation: 'pulse 1.5s infinite',
//               marginLeft: 8,
//             }}
//           />
//           <style>{`
//             @keyframes pulse {
//               0% { opacity: 0.8; }
//               50% { opacity: 0.45; }
//               100% { opacity: 0.8; }
//             }
//           `}</style>
//         </div>
//       </section>
//     );
//   }
//   if (user.role === 'guest') {
//     return (
//       <section className={styles.section}>
//         <button
//           onClick={handleClick}
//           className={`${styles.button} ${isMobile ? styles.mobile : ''}`}
//           aria-label="Toggle menu"
//         >
//           <Image
//             className={styles.image}
//             src={user.profileImage}
//             alt="Profile Image"
//             width={40}
//             height={40}
//           />
//           {!isMobile && <p>Register</p>}
//         </button>
//         {menuOpen && (
//           <ul className={styles.ul}>
//             <li onClick={handleClick} className={styles.li}>
//               <Link className={styles.link} href="/user/register">
//                 <p>Register</p> <IoIosArrowForward />
//               </Link>
//             </li>
//             <li onClick={handleClick} className={styles.li}>
//               <Link className={styles.link} href="/user/login">
//                 <p>Login</p> <IoIosArrowForward />
//               </Link>
//             </li>
//           </ul>
//         )}
//       </section>
//     );
//   }
//   return (
//     <section className={styles.section}>
//       <button
//         onClick={handleLink}
//         className={`${styles.button} ${isMobile ? styles.mobile : ''}`}
//         aria-label="Go to profile"
//       >
//         <Image
//           className={styles.image}
//           src={user.profileImage}
//           alt="Profile Image"
//           width={40}
//           height={40}
//         />
//         {!isMobile && <p>{user.name}</p>}
//       </button>
//     </section>
//   );
// };
// export default Avatar;
