"use strict";
// 'use client';
// import { useEffect, useState } from 'react';
// import { useUser } from '../../../contexts/UserContext';
// import styles from './UserStats.module.css';
// import Image from 'next/image';
// const UserStats = () => {
//   const { user } = useUser();
//   const [hasMounted, setHasMounted] = useState(false);
//   useEffect(() => {
//     setHasMounted(true);
//   }, []);
//   if (!hasMounted || !user || !user.profileImage) return <p>Loading...</p>;
//   return (
//     <main className={styles.main}>
//       <article className={styles.article}>
//         <h3 className={styles.h3}>{user.name}</h3>
//         <h4 className={styles.h4}>Services Completed: {user.requests.length}</h4>
//         {user.requests.length !== 0 && (
//           <p className={styles.p}>
//             You have successfully completed {user.requests.length} services with us. Keep up the
//             great work!
//           </p>
//         )}
//       </article>
//       <Image
//         className={styles.image}
//         src="/images/stats.webp"
//         alt="Stats Image"
//         width={170}
//         height={130}
//       />
//     </main>
//   );
// };
// export default UserStats;
