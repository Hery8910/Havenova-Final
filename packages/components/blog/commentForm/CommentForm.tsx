// 'use client';
// import React, { useEffect, useState } from 'react';
// import api from '../../../services/api';
// import { BlogComment } from '../../../types/blog';
// import styles from './CommentForm.module.css';
// import { IoClose } from 'react-icons/io5';
// import Image from 'next/image';
// import { useUser } from '../../../contexts/UserContext';

// interface CommentFormProps {
//   blogId: string;
//   isDashboard?: boolean;
//   parentId?: string | null; // Si se trata de responder a otro comentario
//   onCommentsUpdate?: (comments: any[]) => void;
//   onRefresh?: (blogId: string) => void;
//   onClose?: () => void;
// }

// const initialComment: BlogComment = {
//   author: '',
//   profileImage: '',
//   content: '',
//   parentId: null,
//   approved: false,
// };

// const CommentForm: React.FC<CommentFormProps> = ({
//   blogId,
//   isDashboard,
//   parentId,
//   onCommentsUpdate,
//   onRefresh,
//   onClose,
// }) => {
//   const { user, setUser } = useUser();
//   if (!user) return;
//   const [comment, setComment] = useState<BlogComment>({
//     ...initialComment,
//     parentId,
//     author: isDashboard
//       ? 'Havenova Team'
//       : user.role === 'guest' && user.name === 'Guest'
//       ? ''
//       : user.name,
//     profileImage: user.profileImage,
//     approved: isDashboard ? true : false,
//   });
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setComment((prev) => ({
//       ...prev,
//       parentId,
//       author: isDashboard
//         ? 'Havenova Team'
//         : user.role === 'guest' && user.name === 'Guest'
//         ? ''
//         : user.name,
//       profileImage: user.profileImage,
//       approved: isDashboard ? true : false,
//     }));
//   }, [parentId, isDashboard, user.profileImage, user.name, user.role]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setComment((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(false);

//     if (!comment.author.trim() || !comment.content.trim()) {
//       setError('Please fill in all fields.');
//       return;
//     }

//     setLoading(true);

//     const payload: any = {
//       author: comment.author,
//       profileImage: comment.profileImage,
//       content: comment.content,
//       approved: comment.approved,
//     };
//     if (comment.parentId) {
//       payload.parentId = comment.parentId;
//     }

//     try {
//       // 1. Si es guest y puso un nombre, actualiza el contexto y localStorage
//       if (user.role === 'guest' && comment.author !== 'Guest' && comment.author.trim()) {
//         setUser({
//           ...user,
//           name: comment.author.trim(),
//         });
//         // ¡El contexto hará el guardado automático en localStorage!
//       }

//       const response = await api.post(`/api/blogs/id/${blogId}/comments`, payload);
//       setLoading(false);
//       setSuccess(true);
//       setComment({
//         ...initialComment,
//         parentId,
//         author: isDashboard ? 'Havenova Team' : user.role === 'guest' ? '' : user.name,
//         approved: isDashboard ? true : false,
//       });
//       if (onRefresh) onRefresh(blogId);
//       if (onClose) onClose();
//       if (onCommentsUpdate) onCommentsUpdate(response.data);
//       setTimeout(() => setSuccess(false), 3000);
//     } catch (err: any) {
//       setLoading(false);
//       setError(err.response?.data?.message || 'Error creating blog comment');
//     }
//   };

//   return (
//     <form className={styles.form} onSubmit={handleSubmit}>
//       <aside className={styles.aside}>
//         <input
//           className={styles.input}
//           type="text"
//           name="author"
//           placeholder="Your name"
//           value={comment.author}
//           onChange={handleChange}
//           readOnly={isDashboard}
//           disabled={loading}
//           required
//         />
//         <textarea
//           className={styles.input}
//           name="content"
//           placeholder="Your comment..."
//           value={comment.content}
//           onChange={handleChange}
//           disabled={loading}
//           rows={3}
//           required
//         />
//       </aside>
//       <div className={styles.form_div}>
//         <button
//           onClick={onClose}
//           className={styles.close_button}
//           type="button"
//           style={
//             !onClose
//               ? {
//                   visibility: 'hidden',
//                   pointerEvents: 'none',
//                   userSelect: 'none',
//                 }
//               : {}
//           }
//         >
//           <IoClose />
//         </button>
//         <button
//           className={styles.button}
//           type="submit"
//           disabled={loading || !comment.author || !comment.content}
//         >
//           <Image className={styles.image} src="/svg/send.svg" alt="Avatar" width={30} height={30} />
//         </button>
//       </div>

//       {success && <div style={{ color: 'green', marginTop: 6 }}>Comment sent for review!</div>}

//       {error && <div style={{ color: 'red', marginTop: 6 }}>{error}</div>}
//     </form>
//   );
// };

// export default CommentForm;
