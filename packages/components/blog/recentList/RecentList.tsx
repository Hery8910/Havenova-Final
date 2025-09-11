'use client';
import BlogCard from '../blogCard/BlogCard';
import { BlogFromDB } from '../../../types/blog';
import styles from './RecentList.module.css';

interface BlogListProps {
  blogs: BlogFromDB[];
}

export default function RecentList({ blogs }: BlogListProps) {
  return (
    <section className={styles.section}>
      <ul className={styles.ul}>
        {blogs.map((blog) => (
          <li className={styles.li} key={blog._id}>
            <BlogCard key={blog._id} blog={blog} />
          </li>
        ))}
      </ul>
    </section>
  );
}
