'use client';

import { BlogPost } from '../../../types/blog/blogTypes';
import Image from 'next/image';
import styles from './BlogCard.module.css';
import { IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';

interface BlogCardProps {
  blog: BlogPost;
  isPreview?: boolean;
}

export default function BlogCard({ blog, isPreview }: BlogCardProps) {
  return (
    <section className={isPreview ? styles.preview_section : styles.section}>
      <main className={styles.main}>
        <h3 className={styles.h3}>
          {blog.title || 'The title will appear as the main headline of your blog post.'}
        </h3>
        {isPreview && (
          <p className={styles.p}>
            {blog.introduction ||
              'A short summary of your blog post. This description helps readers and search engines quickly understand the main topic of your article. It should be concise and engaging, usually between 60 and 160 characters.'}
          </p>
        )}
        <Link href={`/blogs/${blog.slug}`} className={styles.link}>
          View <IoIosArrowForward />
        </Link>
      </main>
      <Image
        className={isPreview ? styles.preview_image : styles.image}
        src={blog.featuredImage || '/images/blog-image-mock.webp'}
        priority={true}
        alt={blog.title || 'Image'}
        width={200}
        height={95}
      />
    </section>
  );
}
