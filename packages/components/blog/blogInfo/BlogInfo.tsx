'use client';

import { BlogFromDB } from '../../../types/blog';
import Image from 'next/image';
import styles from './BlogInfo.module.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '../../../services/api';
import RenderComments from '../renderComments/RenderComments';
import CreateBlogForm from '../createBlogForm/CreateBlogForm';

import { FiEdit3 } from 'react-icons/fi';
import CommentForm from '../commentForm/CommentForm';

interface BlogCardProps {
  blogs: BlogFromDB[];
  blog: BlogFromDB;
  onClick: () => void;
  onRefresh: (blogId: string) => void;
}

export default function BlogInfo({ blogs, blog, onClick, onRefresh }: BlogCardProps) {
  const router = useRouter();
  const [edit, setEdit] = useState<boolean>(false);

  const handleClick = () => {
    router.push(`/blogs/${blog.slug}`);
  };

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h4 className={styles.path}>Blogs/ {blog.slug}</h4>
        <button onClick={onClick} className={styles.close} aria-label="Close">
          Close
        </button>
      </header>
      {edit ? (
        <CreateBlogForm blogs={blogs} editBlog={blog} />
      ) : (
        <section className={styles.info_section}>
          <div className={styles.buttons}>
            <button onClick={handleClick} className={styles.button} aria-label="Show details">
              Preview
            </button>
            <button className={styles.button} onClick={() => setEdit(true)}>
              Edit <FiEdit3 />
            </button>
          </div>
          <header className={styles.section_header}>
            <h2>{blog.title}</h2>
          </header>

          <main className={styles.main}>
            <article className={styles.article}>
              <p className={styles.article_p}>{blog.introduction}</p>
              <ul className={styles.ul}>
                <li className={styles.li}>
                  <p>Blog Status:</p>
                  <p>{blog.status}</p>
                </li>
                <li className={styles.li}>
                  <p>Created At:</p>
                  <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                </li>
                <li className={styles.li}>
                  <p>Updated At:</p>
                  <p> {blog.updatedAt ? blog.updatedAt : 'No Updates'}</p>
                </li>
              </ul>
            </article>
            <Image
              className={styles.image}
              src={blog.featuredImage || '/images/blog-image-mock.webp'}
              priority={true}
              alt={blog.title || 'Image'}
              width={1000}
              height={472}
            />
            <h2 className={styles.h3}>Comments</h2>
            <section className={styles.comment}>
              {blog.comments?.length !== 0 ? (
                <RenderComments
                  blog={blog}
                  comments={blog.comments}
                  isDashboard={true}
                  isPreview={false}
                  onRefresh={() => onRefresh(blog._id)}
                />
              ) : (
                <>
                  <p>No comment, be the first to write a comment.</p>
                  <CommentForm
                    blogId={blog._id}
                    isDashboard={true}
                    parentId={null}
                    onRefresh={() => {
                      onRefresh(blog._id);
                    }}
                  />
                </>
              )}
            </section>
          </main>
        </section>
      )}
    </section>
  );
}
