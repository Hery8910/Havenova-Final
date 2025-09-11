"use strict";
// 'use client';
// import styles from './Sidebar.module.css';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { ReactNode, useEffect, useState } from 'react';
// import SupportModal from '../user/supportModal/SupportModal';
// import { logoutUser } from '../../services/userService';
// import { MdLogout } from 'react-icons/md';
// import { useUser } from '../../contexts/UserContext';
// import { useI18n } from '../../contexts/I18nContext';
// import { AlertPopup } from '../alertPopup/AlertPopup';
// import { LuLogOut } from 'react-icons/lu';
// export interface NavItem {
//   label: string;
//   href: string;
//   icon: ReactNode;
// }
// interface DashboardSidebarProps {
//   items: NavItem[];
//   context: 'user-profile' | 'admin-dashboard';
// }
// export default function Sidebar({ items, context }: DashboardSidebarProps) {
//   const pathname = usePathname();
//   const [isMobile, setIsMobile] = useState(false);
//   const router = useRouter();
//   const { texts } = useI18n();
//   const popups = texts.popups;
//   const { logout } = useUser();
//   const [alert, setAlert] = useState<{
//     type: 'success' | 'error';
//     title: string;
//     description: string;
//   } | null>(null);
//   const [loading, setLoading] = useState(false);
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 800);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);
//   const handleLogout = async () => {
//     setLoading(true);
//     try {
//       const response = await logoutUser();
//       if (response.success) {
//         const popupData = popups?.[response.code] || {};
//         logout(); // Limpia el contexto/localstorage, etc.
//         setAlert({
//           type: 'success',
//           title: popupData.title || popups.USER_LOGOUT_SUCCESS.title,
//           description: popupData.title || popups.USER_LOGOUT_SUCCESS.description,
//         });
//         setTimeout(() => {
//           setAlert(null);
//           router.push('/'); // Redirige a home o donde prefieras
//         }, 3000);
//       } else {
//         setAlert({
//           type: 'error',
//           title: popups.GLOBAL_INTERNAL_ERROR.title,
//           description: popups.GLOBAL_INTERNAL_ERROR.description,
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       setAlert({
//         type: 'error',
//         title: popups.GLOBAL_INTERNAL_ERROR.title,
//         description: popups.GLOBAL_INTERNAL_ERROR.description,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <nav className={`${styles.nav} ${isMobile ? `${styles.mobile}` : ''}`}>
//       <ul className={styles.ul}>
//         {items.map(({ label, href, icon }) => (
//           <li key={href} className={styles.li}>
//             <Link
//               key={href}
//               href={href}
//               className={`${styles.link} ${pathname === href ? styles.active : ''}`}
//             >
//               {icon} {!isMobile && <p>{label}</p>}
//             </Link>
//           </li>
//         ))}
//       </ul>
//       <ul className={styles.ul}>
//         <li className={styles.link}>
//           <SupportModal context={context} />
//         </li>
//         <li className={styles.link}>
//           <button className={styles.logout} onClick={handleLogout}>
//             <LuLogOut /> Logout
//           </button>
//         </li>
//       </ul>
//       {alert && (
//         <AlertPopup
//           type={alert.type}
//           title={alert.title}
//           description={alert.description}
//           onClose={() => setAlert(null)}
//         />
//       )}
//     </nav>
//   );
// }
