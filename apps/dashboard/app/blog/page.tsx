'use client';
import { useEffect, useState } from 'react';
import BlogTable from '../../../../packages/components/blog/blogTable/BlogTable';
import styles from './page.module.css';
import { BlogFromDB } from '../../../../packages/types/blog';
import { Suspense } from 'react';
import BlogTableSkeleton from '../../../../packages/components/blog/blogTableSkeleton/BlogTableSkeleton';
import {
  getAllBlogs,
  getScheduledBlogs,
  getPublishedBlogs,
  getPendingBlogs,
} from '../../../../packages/services/blogServices';
import CreateBlogForm from '../../../../packages/components/blog/createBlogForm/CreateBlogForm';
import { useClient } from '../../../../packages/contexts/ClientContext';

const LIST_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'published', label: 'Published' },
  { key: 'pending', label: 'Pending' },
] as const;

export type ListType = (typeof LIST_OPTIONS)[number]['key'];
export type ListPath = (typeof LIST_OPTIONS)[number]['label'];

const Blog = () => {
  const { client } = useClient();
  const clientId = client?._id;
  const [activeList, setActiveList] = useState<ListType>('all');
  const [activePath, setActivePath] = useState<ListPath>('All');

  const [blogs, setBlogs] = useState<BlogFromDB[]>([]);
  const [open, setOpen] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const limit = 5;
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000); // 400ms delay

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeList, page, debouncedSearch, order]);

  const fetchBlogs = async () => {
    setLoading(true);
    if (clientId)
      try {
        let response;
        if (activeList === 'all') {
          response = await getAllBlogs(clientId, page, limit, search, order);
        } else if (activeList === 'scheduled') {
          response = await getScheduledBlogs(clientId, page, limit, order);
        } else if (activeList === 'published') {
          response = await getPublishedBlogs(clientId, page, limit, order);
        } else if (activeList === 'pending') {
          response = await getPendingBlogs(clientId, page, limit, order);
        }
        {
          response && setBlogs(response.blogs);
        }
        {
          response && setTotalPages(response.totalPages);
        }
      } catch (error) {
        setBlogs([]);
        setTotalPages(1);
        console.error('Error fetching blogs:', error);
      }
    setLoading(false);
  };

  const refreshBlog = async (blogId: string) => {
    // Opcional: refrescar un blog individual, según lógica de tu app.
    fetchBlogs();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault;
    setSearch(e.target.value);
    setPage(1);
  };

  const handleOrderChange = (order: 'desc' | 'asc') => {
    setOrder(order);
    setPage(1);
  };

  const handleListChange = (type: ListType, label: ListPath) => {
    setActivePath(label);
    setActiveList(type);
    setPage(1);
    setSearch('');
    // Puedes resetear otros filtros si quieres
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <aside className={styles.aside}>
          <button
            className={`${styles.button} ${open && styles.button_active}`}
            onClick={() => setOpen(true)}
          >
            Blog List
            <span className={`${styles.span} ${open && styles.span_active}`}></span>
          </button>
          <button
            className={`${styles.button} ${!open && styles.button_active}`}
            onClick={() => setOpen(false)}
          >
            New Blog
            <span className={`${styles.span} ${!open && styles.span_active}`}></span>
          </button>
        </aside>
        <h2>Blog Posts</h2>
      </header>

      {open ? (
        <BlogTable
          blogs={blogs}
          page={page}
          totalPages={totalPages}
          search={search}
          order={order}
          loading={loading}
          activeList={activeList}
          activePath={activePath}
          onChangePage={(newPage) => setPage(newPage)}
          onChangeSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onChangeOrder={(order) => {
            setOrder(order);
            setPage(1);
          }}
          onChangeList={(type, label) => {
            setActiveList(type);
            setActivePath(label);
            setPage(1);
            setSearch('');
          }}
          onRefresh={refreshBlog}
        />
      ) : (
        <CreateBlogForm blogs={blogs} />
      )}
    </main>
  );
};

export default Blog;
