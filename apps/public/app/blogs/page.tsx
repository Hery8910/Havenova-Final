'use client';
import BlogList from '../../../../packages/components/blog/blogList/BlogList';
import { BlogFromDB } from '../../../../packages/types/blog';
import { getAllBlogs } from '../../../../packages/services/blogServices';
import { useEffect, useState } from 'react';
import { useClient } from '../../../../packages/contexts/ClientContext';

export default function BlogPage() {
  const { client, loading } = useClient();
  const clientId = client?._id;
  const [blogs, setBlogs] = useState<BlogFromDB[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const limit = 10;

  const fetchBlogs = async () => {
    if (clientId)
      try {
        const response = await getAllBlogs(clientId, page, limit, search, order);
        setBlogs(response.blogs);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (loading) return <div>Loading...</div>;
  if (!client) return <div>Client not Found</div>;

  return (
    <main>
      <h1>Latest Blog Posts</h1>
      {/* <BlogList blogs={blogs} /> */}
    </main>
  );
}
