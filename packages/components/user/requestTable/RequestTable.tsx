// import { ServiceOrder } from '../../../types/services';
// import styles from './RequestTable.module.css';

// interface RequestTableProps {
//   orders: ServiceOrder[];
// }

// export default function RequestTable({ orders }: RequestTableProps) {
//   function translateStatus(status: string) {
//     switch (status) {
//       case 'submitted':
//         return 'Submitted';
//       case 'in progress':
//         return 'In Progress';
//       case 'completed':
//         return 'Completed';
//       case 'cancelled':
//         return 'Cancelled';
//       default:
//         return status;
//     }
//   }

//   if (orders.length === 0) {
//     return <p>No tienes solicitudes registradas todavía.</p>;
//   }

//   return (
//     <table className={styles.table}>
//       <thead className={styles.thead}>
//         <tr className={styles.tr}>
//           <th className={styles.th}>Service</th>
//           <th className={styles.th}>Preferred date</th>
//           <th className={styles.th}>Address</th>
//           <th className={styles.th}>State</th>
//         </tr>
//       </thead>
//       <tbody className={styles.body}>
//         {orders.map((order) => (
//           <tr className={styles.tr} key={order.id}>
//             <td className={styles.td}>
//               <ul className={styles.ul}>
//                 {order.services.map((s) => (
//                   <li key={s.id}>{s.details.title}</li>
//                 ))}
//               </ul>
//             </td>
//             <td className={styles.td1}>
//               {new Date(order.preferredDate).toLocaleDateString()} - {order.preferredTime} hr.
//             </td>
//             <td className={styles.td}>{order.serviceAddress}</td>
//             <td className={styles.td1}>{translateStatus(order.status)}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }
