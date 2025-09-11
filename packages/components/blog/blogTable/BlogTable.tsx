// import React, { useState } from 'react';
// import { BlogFromDB } from '../../../types/blog';
// import styles from './BlogTable.module.css';
// import BlogInfo from '../blogInfo/BlogInfo';
// import { Suspense } from 'react';

// import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
// import { IoSearch } from 'react-icons/io5';
// import { HiMiniArrowsUpDown } from 'react-icons/hi2';
// import { HiOutlineArrowSmDown, HiOutlineArrowSmUp } from 'react-icons/hi';
// import BlogTableSkeleton from '../blogTableSkeleton/BlogTableSkeleton';
// import { deleteBlogById } from '../../../services/blogServices';
// import { FaRegTrashCan } from 'react-icons/fa6';
// import ConfirmationAlert from '../../confirmationAlert/ConfirmationAlert';
// import { useClient } from '../../../contexts/ClientContext';

// const LIST_OPTIONS = [
//   { key: 'all', label: 'All' },
//   { key: 'scheduled', label: 'Scheduled' },
//   { key: 'published', label: 'Published' },
//   { key: 'pending', label: 'Pending' },
// ] as const;

// export type ListType = (typeof LIST_OPTIONS)[number]['key'];
// export type ListPath = (typeof LIST_OPTIONS)[number]['label'];

// interface BlogListProps {
//   blogs: BlogFromDB[];
//   page: number;
//   totalPages: number;
//   search: string;
//   order: 'desc' | 'asc';
//   loading: boolean;
//   activeList: ListType;
//   activePath: ListPath;
//   onChangePage: (page: number) => void;
//   onChangeSearch: (value: string) => void;
//   onChangeOrder: (order: 'desc' | 'asc') => void;
//   onChangeList: (type: ListType, label: ListPath) => void;
//   onRefresh: (blogId: string) => void;
// }

// export default function BlogTable({
//   blogs,
//   page,
//   totalPages,
//   search,
//   order,
//   loading,
//   activeList,
//   activePath,
//   onChangePage,
//   onChangeSearch,
//   onChangeOrder,
//   onChangeList,
//   onRefresh,
// }: BlogListProps) {
//   const { client } = useClient();
//   const clientId = client?._id;
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
//   const [orderOpen, setOrderOpen] = React.useState(false);
//   const [openBlogId, setOpenBlogId] = useState<string | null>(null);

//   if (loading) return <div>Loading...</div>;
//   if (!client) return <div>Client not Found</div>;

//   return (
//     <>
//       {showModal && selectedBlogId ? (
//         <BlogInfo
//           blogs={blogs}
//           blog={blogs.find((b) => b._id === selectedBlogId)!}
//           onClick={() => {
//             setSelectedBlogId(null);
//             setShowModal(false);
//           }}
//           onRefresh={onRefresh}
//         />
//       ) : (
//         <main className={styles.main}>
//           <section className={styles.section}>
//             <header className={styles.header}>
//               <p className={styles.path}>Blogs/ Blogs List/ {activePath}</p>
//               <div className={styles.buttons}>
//                 {LIST_OPTIONS.map((option) => (
//                   <button
//                     key={option.key}
//                     className={`${styles.button} ${
//                       activeList === option.key ? styles.button_active : ''
//                     }`}
//                     onClick={() => onChangeList(option.key, option.label)}
//                   >
//                     {option.label}
//                     <span
//                       className={`${styles.span} ${
//                         activeList === option.key ? styles.span_active : ''
//                       }`}
//                     ></span>
//                   </button>
//                 ))}
//               </div>
//               <article className={styles.article}>
//                 <div className={styles.search}>
//                   <p className={styles.search_p}>
//                     <IoSearch />
//                   </p>
//                   <input
//                     type="text"
//                     value={search}
//                     onChange={(e) => onChangeSearch(e.target.value)}
//                     placeholder="Search blogs by title..."
//                     className={styles.input}
//                     disabled={loading}
//                   />
//                 </div>
//                 <div className={styles.select}>
//                   <p>Order</p>
//                   <button
//                     type="button"
//                     className={styles.select_button}
//                     onClick={() => setOrderOpen((open) => !open)}
//                     aria-haspopup="listbox"
//                     aria-expanded={orderOpen}
//                     disabled={loading}
//                   >
//                     {order === 'desc' ? 'Newest' : 'Oldest'}
//                     <HiMiniArrowsUpDown />
//                   </button>
//                   {orderOpen && (
//                     <ul className={styles.select_ul} role="listbox" tabIndex={-1}>
//                       <li
//                         className={`${styles.select_li_1} ${
//                           order === 'desc' ? styles.select_active : ''
//                         }`}
//                         role="option"
//                         aria-selected={order === 'desc'}
//                         onClick={() => {
//                           onChangeOrder('desc');
//                           setOrderOpen(false);
//                         }}
//                       >
//                         Newest <HiOutlineArrowSmDown />
//                       </li>
//                       <li
//                         className={`${styles.select_li_2} ${
//                           order === 'asc' ? styles.select_active : ''
//                         }`}
//                         role="option"
//                         aria-selected={order === 'asc'}
//                         onClick={() => {
//                           onChangeOrder('asc');
//                           setOrderOpen(false);
//                         }}
//                       >
//                         Oldest <HiOutlineArrowSmUp />
//                       </li>
//                     </ul>
//                   )}
//                 </div>
//               </article>
//             </header>

//             <main className={styles.section_main}>
//               <Suspense fallback={<BlogTableSkeleton />}>
//                 <ul className={styles.ul}>
//                   <li className={`${styles.li} ${styles.header_li}`}>
//                     <p className={styles.p}>Name</p>
//                     <p className={styles.p}>Created at</p>
//                     <p className={styles.p}>Comments</p>
//                     <p className={styles.p}>Status</p>
//                     <p className={styles.p}></p>
//                     <p className={styles.p}></p>
//                   </li>
//                   {blogs.map((blog) => (
//                     <li key={blog._id} className={styles.li}>
//                       <p className={styles.p}>
//                         <strong>{blog.title}</strong>
//                       </p>
//                       <p className={styles.p}>{new Date(blog.createdAt).toLocaleDateString()}</p>
//                       <p className={styles.p}>
//                         {blog.comments ? blog.comments.length : 0}
//                         {blog.comments
//                           ? `(${
//                               blog.comments.filter((comment) => !comment.approved).length
//                             }) unread`
//                           : '0'}
//                       </p>
//                       <p className={styles.p}>{blog.status}</p>
//                       <button
//                         type="button"
//                         className={styles.more_button}
//                         onClick={() => {
//                           setSelectedBlogId(blog._id);
//                           setShowModal(true);
//                         }}
//                       >
//                         More...
//                       </button>
//                       <button
//                         type="button"
//                         className={styles.delete_button}
//                         onClick={() => setOpenBlogId(blog._id)}
//                       >
//                         <FaRegTrashCan />
//                       </button>
//                       {clientId && blog._id === openBlogId && (
//                         <ConfirmationAlert
//                           title="Are you sure you want to delete this blog?"
//                           message=""
//                           onCancel={() => setOpenBlogId(null)}
//                           onConfirm={() => {
//                             setOpenBlogId(null);
//                             deleteBlogById(clientId, blog._id);
//                             onRefresh(blog._id);
//                           }}
//                         />
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </Suspense>
//               <aside className={styles.aside_buttons}>
//                 <button
//                   className={styles.aside_button}
//                   disabled={page === 1 || loading}
//                   onClick={() => onChangePage(page - 1)}
//                 >
//                   <IoIosArrowBack />
//                 </button>
//                 <p>
//                   Page {page} / {totalPages}
//                 </p>
//                 <button
//                   className={styles.aside_button}
//                   disabled={page === totalPages || loading}
//                   onClick={() => onChangePage(page + 1)}
//                 >
//                   <IoIosArrowForward />
//                 </button>
//               </aside>
//             </main>
//           </section>
//         </main>
//       )}
//     </>
//   );
// }
