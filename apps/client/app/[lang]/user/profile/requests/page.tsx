'use client';
import React from 'react';
import styles from './page.module.css';
// import RequestTable from '../../../../../../packages/components/user/requestTable/RequestTable';

// 👉 Ejemplo de órdenes (mock)
// const mockOrders: ServiceOrder[] = [
//   {
//     id: "1",
//     status: "submitted",
//     createdAt: new Date().toISOString(),
//     contact: { user: { _id: "u1", name: "John", email: "john@example.com", role: "user", address: "", phone: "", isVerified: true, profileImage: "", requests: [], createdAt: new Date() } },
//     serviceAddress: "Alexanderplatz 1, Berlin",
//     preferredDate: "2025-06-20",
//     preferredTime: "10:00",
//     totalPrice: 120,
//     totalEstimatedDuration: 2,
//     services: [
//       {
//         id: "srv1",
//         serviceType: "furniture-assembly",
//         price: 120,
//         estimatedDuration: 2,
//         details: {
//           title: "Montaje de armario Pax",
//           icon: { src: "/icons/armario.svg", alt: "armario" },
//           type: "wardrobe",
//           location: "Bedroom",
//           quantity: "1",
//           position: "against wall",
//           width: "200",
//           height: "236",
//           depth: "60",
//           doors: 2,
//           drawers: 3,
//           notes: "Cliente necesita fijación a la pared"
//         }
//       }
//     ]
//   },
//   {
//     id: "2",
//     status: "completed",
//     createdAt: "2025-05-10T10:00:00.000Z",
//     contact: { user: { _id: "u1", name: "John", email: "john@example.com", role: "user", address: "", phone: "", isVerified: true, profileImage: "", requests: [], createdAt: new Date() } },
//     serviceAddress: "Prenzlauer Allee 100, Berlin",
//     preferredDate: "2025-05-12",
//     preferredTime: "14:00",
//     totalPrice: 90,
//     totalEstimatedDuration: 1.5,
//     services: [
//       {
//         id: "srv2",
//         serviceType: "window-cleaning",
//         price: 90,
//         estimatedDuration: 1.5,
//         details: {
//           title: "Limpieza de ventanas",
//           icon: { src: "/icons/windows.svg", alt: "ventanas" },
//           windows: 5,
//           doors: 2,
//           access: "desde interior",
//           notes: "Sin persianas"
//         }
//       }
//     ]
//   }
// ];

export default function RequestTableWithFilters() {
  // const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');

  // const filtered =
  //   statusFilter === "all"
  //     ? mockOrders
  //     : mockOrders.filter((o) => o.status === statusFilter);

  return (
    <div className={styles.wrapper}>
      {/* <div className={styles.controls}>
        <label>
          Estado:
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="submitted">Submitted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div> */}
      {/* <RequestTable orders={filtered} /> */}
    </div>
  );
}
