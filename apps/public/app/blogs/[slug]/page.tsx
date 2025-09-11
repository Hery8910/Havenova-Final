import { BlogFromDB } from '../../../../../packages/types/blog';
import api from '../../../../../packages/services/api';
import BlogContent from '../../../../../packages/components/blog/blogContent/BlogContent';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageProps } from '../../../../../packages/types/page';
import CommentForm from '../../../../../packages/components/blog/commentForm/CommentForm';

// Generar metadata dinámico basado en el contenido del post
export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  try {
    const { data: post } = await api.get<BlogFromDB>(`/api/blogs/slug/${params.slug}`);
    if (!post) return {};

    return {
      title: `${post.title} | Havenova`,
      description: post.metaDescription,
      openGraph: {
        title: `${post.title} | Havenova`,
        description: post.metaDescription,
        images: [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
    };
  } catch (error: any) {
    return {};
  }
}

export default async function BlogPage({ params }: PageProps<{ slug: string }>) {
  try {
    const { data: post } = await api.get<BlogFromDB>(`/api/blogs/slug/${params.slug}`);
    if (!post) {
      console.log('No post found, calling notFound()');
      return notFound();
    }

    return (
      <main>
        <BlogContent post={post} />
        <CommentForm blogId={post._id} isDashboard={false} />
      </main>
    );
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return notFound();
  }
}
