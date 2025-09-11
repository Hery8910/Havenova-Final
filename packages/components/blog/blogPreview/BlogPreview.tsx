// import Image from 'next/image';
// import { BlogPost } from '../../../types/blog';
// import styles from './BlogPreview.module.css';

// interface BlogContentProps {
//   post: BlogPost;
//   isPreview?: boolean;
// }

// const BlogPreview = ({ post, isPreview = false }: BlogContentProps) => (
//   <main className={`${isPreview ? styles.main_preview : styles.main}`}>
//     <header className={`${isPreview ? styles.header_preview : styles.header}`}>
//       <div className={`${isPreview ? styles.header_div_preview : styles.header_div}`}>
//         <h1 className={isPreview ? styles.h1_preview : ''}>
//           {post.title || 'The title will appear as the main headline of your blog post.'}
//         </h1>
//         <p className={isPreview ? styles.p_preview : ''}>
//           {post.introduction ||
//             'A short summary of your blog post. This description helps readers and search engines quickly understand the main topic of your article. It should be concise and engaging, usually between 60 and 160 characters.'}
//         </p>
//       </div>
//       <Image
//         className={isPreview ? styles.image_preview : styles.image}
//         src={post.featuredImage || '/images/blog-image-mock.webp'}
//         alt={post.title || 'Image'}
//         width={1000}
//         height={472}
//       />
//     </header>
//     {post.sections.map((section, index) => (
//       <section className={`${isPreview ? styles.section_preview : styles.section}`} key={index}>
//         <h2 className={isPreview ? styles.h2_preview : ''}>{section.heading}</h2>
//         {section.content &&
//           section.content.map((contentBlock, idx) => (
//             <div className={`${isPreview ? styles.div_preview : styles.div}`} key={idx}>
//               {contentBlock.points && (
//                 <ul className={`${isPreview ? styles.ul_preview : styles.ul}`}>
//                   {contentBlock.points.map((point) => (
//                     <li className={`${isPreview ? styles.li_preview : styles.li}`} key={point.id}>
//                       <p className={isPreview ? styles.p_preview : ''}>{point.value}</p>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//               {contentBlock.paragraph && (
//                 <p className={isPreview ? styles.p_preview : ''}>
//                   {typeof contentBlock.paragraph === 'object'
//                     ? contentBlock.paragraph.value
//                     : contentBlock.paragraph}
//                 </p>
//               )}
//             </div>
//           ))}
//       </section>
//     ))}

//     {post.faq && post.faq.length > 0 && (
//       <section className={`${isPreview ? styles.section_preview : styles.section}`}>
//         <h2 className={isPreview ? styles.h2_preview : ''}>Frequently Asked Questions</h2>
//         {post.faq.map((faq, i) => (
//           <div className={`${isPreview ? styles.div_preview : styles.div}`} key={i}>
//             <strong className={isPreview ? styles.strong_preview : ''}>{faq.question}</strong>
//             <p className={isPreview ? styles.p_preview : ''}>{faq.answer}</p>
//           </div>
//         ))}
//       </section>
//     )}
//   </main>
// );

// export default BlogPreview;
