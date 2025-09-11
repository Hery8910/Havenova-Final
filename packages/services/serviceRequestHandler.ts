// import { User } from '../types/User';
// import { ServiceRequestItem } from '../types/services'; // suponiendo que lo tengas separado
// import { updateUser } from './userService';
// import { saveUserToStorage } from '../utils/guestUserStorage';

// interface Props {
//   user: User;
//   newRequest: ServiceRequestItem;
//   addRequestToUser: (req: ServiceRequestItem) => void;
// }

// export const handleServiceRequest = async ({ user, newRequest, addRequestToUser }: Props) => {
//   if (user.role === 'guest') {
//     // Opcional: puedes agregarle un ID a la request aquí si lo necesitas
//     const updatedRequests = [...user.requests, newRequest];
//     const updatedUser = { ...user, requests: updatedRequests };
//     saveUserToStorage(updatedUser); // 🔑 Guarda el usuario actualizado
//     addRequestToUser(newRequest); // Actualiza el contexto también
//   } else {
//     try {
//       await updateUser({
//         ...user,
//         requests: [...user.requests, newRequest],
//       });
//     } catch (err) {
//       console.error('❌ Failed to sync with backend:', err);
//     }
//   }
// };
