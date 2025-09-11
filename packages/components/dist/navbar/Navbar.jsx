"use strict";
// 'use client';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import styles from './Navbar.module.css';
// import Image from 'next/image';
// import { useUser } from '../../contexts/UserContext';
// import Avatar from '../user/avatar/Avatar';
// import { HiMenuAlt3 } from 'react-icons/hi';
// import ThemeToggler from '../themeToggler/ThemeToggler';
// import LanguageSwitcher from '../languageSwitcher/LanguageSwitcher';
// import { useI18n } from '../../contexts/I18nContext';
// import Loading from '../layout/loading/Loading';
// // Tipos base
// export interface BaseNavItem {
//   label: string;
//   href: string;
// }
// export interface IconNavItem extends BaseNavItem {
//   image: string; // ruta al icono (svg, webp, etc.)
//   alt: string; // texto alternativo accesible
// }
// // Secciones específicas
// export type ServiceNavItem = IconNavItem;
// export interface SimpleNavItem extends BaseNavItem {} // p.ej. "About", "Contact"
// export type ProfileAuth = 'guest' | 'user' | 'admin';
// export interface ProfileNavItem extends IconNavItem {
//   auth: ProfileAuth; // quién ve el ítem
// }
// export type HeadersItem = {
//   services: string;
//   about: string;
//   profile: string;
// };
// // Configuración completa del navbar
// export interface NavbarConfig {
//   headers: HeadersItem;
//   services: ServiceNavItem[];
//   about: SimpleNavItem[];
//   profile: ProfileNavItem;
//   register: ProfileNavItem[];
// }
// // (Opcional) Helpers útiles
// export type NavbarSectionKey = keyof NavbarConfig; // "services" | "about" | "profile"
// // (Opcional) Estructura por localización si manejas varios idiomas en memoria
// export type Locales = 'de' | 'en';
// export type NavbarI18nMap = Record<Locales, NavbarConfig>;
// export default function Navbar({}) {
//   const { user } = useUser();
//   const router = useRouter();
//   const { texts } = useI18n();
//   const theme = user?.theme || 'light';
//   const navbar: NavbarConfig | undefined = texts?.components?.navbar;
//   const [isDesktop, setIsDesktop] = useState(true);
//   const [scrolled, setScrolled] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 1000);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);
//   const getLogoSrc = () => {
//     if (theme === 'dark') {
//       return isDesktop ? '/svg/logos/logo-small-light.svg' : '/svg/logos/logo-light.svg';
//     } else {
//       return isDesktop ? '/svg/logos/logo-small-dark.svg' : '/svg/logos/logo-dark.svg';
//     }
//   };
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);
//   const handleMouseLeave = () => {
//     setMenuOpen(false);
//   };
//   if (!user) return <Loading />;
//   return (
//     <nav className={styles.nav}>
//       <header className={styles.nav_header}>
//         <Link className={styles.logo} href="/">
//           <Image
//             className={styles.logo}
//             src={getLogoSrc()}
//             alt="Havenova Logo"
//             width={isDesktop ? 40 : 200}
//             height={isDesktop ? 40 : 50}
//           />
//         </Link>
//         <aside className={styles.nav_aside}>
//           {!isMobile && (
//             <>
//               <ThemeToggler />
//               <LanguageSwitcher />
//             </>
//           )}
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className={styles.icon}
//             aria-label="Toggle menu"
//           >
//             <HiMenuAlt3 />
//           </button>
//         </aside>
//       </header>
//       <ul
//         onMouseLeave={handleMouseLeave}
//         className={`${styles.nav_main} ${menuOpen ? styles.open : styles.close}`}
//       >
//         <li className={styles.main_li}>
//           <h4 className={styles.h4}>{navbar?.headers?.services}</h4>
//           <ul className={styles.li_ul}>
//             {navbar?.services.map((link) => (
//               <li
//                 className={styles.li}
//                 key={link.label}
//                 onClick={() => {
//                   router.push(`${link.href}`);
//                   setMenuOpen(false);
//                 }}
//               >
//                 {link.image && (
//                   <Image
//                     className={styles.image}
//                     src={link.image}
//                     priority={true}
//                     alt={link.alt || link.label}
//                     width={35}
//                     height={35}
//                   />
//                 )}
//                 <p className={styles.p}>{link.label}</p>
//               </li>
//             ))}
//           </ul>
//         </li>
//         <li className={styles.main_li}>
//           <h4 className={styles.h4}>{navbar?.headers?.about}</h4>
//           <ul className={styles.li_ul}>
//             {navbar?.about.map((link) => (
//               <li
//                 className={styles.li}
//                 key={link.label}
//                 onClick={() => {
//                   router.push(`${link.href}`);
//                   setMenuOpen(false);
//                 }}
//               >
//                 <p className={styles.p}>{link.label}</p>
//               </li>
//             ))}
//           </ul>
//         </li>
//         <li className={styles.main_li}>
//           <h4 className={styles.h4}>{navbar?.headers?.profile}</h4>
//           <ul className={styles.li_ul}>
//             {isMobile && (
//               <>
//                 <li key="prefer" className={styles.li}>
//                   <ThemeToggler />
//                   <LanguageSwitcher />
//                 </li>
//               </>
//             )}
//             {user?.role === 'guest' ? (
//               navbar?.register.map((link) => (
//                 <li
//                   onClick={() => {
//                     router.push(`${link.href}`);
//                     setMenuOpen(false);
//                   }}
//                   className={styles.li}
//                   key={link.label}
//                 >
//                   <p className={styles.p}>{link.label}</p>
//                 </li>
//               ))
//             ) : (
//               <li>
//                 <Avatar />
//               </li>
//             )}
//           </ul>
//         </li>
//       </ul>
//     </nav>
//   );
// }
