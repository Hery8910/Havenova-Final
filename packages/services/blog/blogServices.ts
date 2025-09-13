import api from './api/api';
import { BlogPaginationResponse, BlogPost } from '../types/blog';

export const createBlog = async (
  blog: BlogPost,
  clientId: string,
  status: string
): Promise<void> => {
  await api.post('/api/blogs', {
    ...blog,
    clientId,
    status,
  });
};

export const updateBlog = async (
  blog: BlogPost,
  blogId: string,
  clientId: string,
  status: string
): Promise<void> => {
  await api.patch(`/api/blogs/id/${blogId}`, {
    ...blog,
    clientId,
    status,
  });
};

// TODOS LOS BLOGS
export const getAllBlogs = async (
  clientId: string,
  page: number,
  limit: number,
  search: string,
  order: string
): Promise<BlogPaginationResponse> => {
  const { data } = await api.get('/api/blogs', {
    params: { clientId, page, limit, search, order },
  });
  return data;
};

// BLOGS PROGRAMADOS
export const getScheduledBlogs = async (
  clientId: string,
  page: number,
  limit: number,
  order: string
): Promise<BlogPaginationResponse> => {
  const { data } = await api.get('/api/blogs/scheduled', {
    params: { clientId, page, limit, order },
  });
  return data;
};

// BLOGS PUBLICADOS
export const getPublishedBlogs = async (
  clientId: string,
  page: number,
  limit: number,
  order: string
): Promise<BlogPaginationResponse> => {
  const { data } = await api.get('/api/blogs/published', {
    params: { clientId, page, limit, order },
  });
  return data;
};

// BLOGS CON COMENTARIOS PENDIENTES DE RESPONDER
export const getPendingBlogs = async (
  clientId: string,
  page: number,
  limit: number,
  order: string
): Promise<BlogPaginationResponse> => {
  const { data } = await api.get('/api/blogs/pendingComments', {
    params: { clientId, page, limit, order },
  });
  return data;
};

// BORRAR BLOG POR ID
export async function deleteBlogById(id: string, clientId: string): Promise<void> {
  await api.delete(`/api/blogs/id/${id}`, {
    data: { clientId }, // Para DELETE, axios usa 'data' no 'params'
  });
}
