// import BlogCard from '../blogCard/BlogCard';
// import Modal from '../../modal/Modal';
// import { IframeProps } from '../../../types/blog';
// import { BlogFromDB } from '../../../types/blog';
// import styles from './BlogList.module.css';
// import { useRef, useState, useEffect } from 'react';
// import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
// import Image from 'next/image';
// import { useI18n } from '../../../contexts/I18nContext';

// interface BlogProps {
//   title: string;
//   subTitle: string;
//   cta: {
//     title: string;
//     subTitle: string;
//     label: string;
//   };
// }
// const BlogList: React.FC = () => {
//   const { texts } = useI18n();
//   const blog: BlogProps = texts.home.blog;

//   return (
//     <section className={styles.section}>
//       <header>
//         <h2>{blog.title}</h2>
//         <h2>{blog.subTitle}</h2>
//       </header>
//       <aside>
//         <h4>{blog.cta.title}</h4>
//         <p>{blog.cta.subTitle}</p>
//         <button>{blog.cta.label}</button>
//       </aside>
//     </section>
//   );
// };

// export default BlogList;
