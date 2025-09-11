'use client';
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { BlogFAQ, BlogFromDB, BlogPost, BlogStatus, SectionContent } from '../../../types/blog';
import ImageUpload from '../../imageUpload/ImageUpload';
import styles from './CreateBlogForm.module.css';
import Input from '../input/Input';
import {
  validateIntroduction,
  validateMetaDescription,
  validateSlug,
  validateTitle,
} from '../../../utils/validators';
import Info from '../../info/Info';
import ConfirmationAlert from '../../confirmationAlert/ConfirmationAlert';
import { GrList } from 'react-icons/gr';
import { HiMenuAlt2 } from 'react-icons/hi';
import BlogCard from '../blogCard/BlogCard';
import BlogPreview from '../blogPreview/BlogPreview';
import { useRouter } from 'next/navigation';
import { FaRegTrashCan } from 'react-icons/fa6';
import { useClient } from '../../../contexts/ClientContext';
import { createBlog, updateBlog } from '../../../services/blogServices';

const initialBlog: BlogPost = {
  title: '',
  slug: '',
  featuredImage: '',
  metaDescription: '',
  introduction: '',
  sections: [],
  faq: [],
  status: 'draft',
  scheduledAt: null,
  comments: [],
  author: 'Havenova Team',
};
interface CreateBlogFormProps {
  blogs: BlogPost[];
  editBlog?: BlogFromDB | null;
}

export default function CreateBlogForm({ blogs, editBlog = null }: CreateBlogFormProps) {
  const { client } = useClient();
  const [blog, setBlog] = useState<BlogPost>(editBlog ?? initialBlog);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [error, setError] = useState<string | null>(null);
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [openContentId, setOpenContentId] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [hoverFaqId, setHoverFaqId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<number | null>(null);
  const [submitType, setSubmitType] = useState<BlogStatus>('draft');
  const router = useRouter();

  useEffect(() => {
    if (editBlog) {
      // Asegura IDs únicos en FAQ
      const faqWithIds = (editBlog.faq || []).map((faq) =>
        faq.id ? faq : { ...faq, id: `${Date.now()}-${Math.random()}` }
      );

      // Asegura IDs únicos en sections y en sus content blocks
      const sectionsWithIds = (editBlog.sections || []).map((section) => ({
        ...section,
        content: (section.content || []).map((content) =>
          content.id ? content : { ...content, id: `${Date.now()}-${Math.random()}` }
        ),
      }));

      setBlog({
        ...editBlog,
        faq: faqWithIds,
        sections: sectionsWithIds,
      });
    } else {
      setBlog(initialBlog);
    }
  }, [editBlog]);

  function validateBlog(blog: BlogPost): string | null {
    if (!blog.title.trim()) return 'Title is required';
    if (!blog.metaDescription.trim()) return 'Meta description is required';
    if (!blog.introduction.trim()) return 'Introduction is required';
    if (!blog.slug.trim()) return 'Slug is required';
    if (!blog.featuredImage.trim()) return 'Featured image is required';
    return null;
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove all non-word chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/--+/g, '-'); // Replace multiple - with single -
  };

  const handleTitleChange = (title: string) => {
    setBlog((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  // Secciones
  const addSection = () => {
    setBlog({
      ...blog,
      sections: [...blog.sections, { heading: '', content: [] }],
    });
  };

  const removeSection = (idx: number) => {
    const newSections = blog.sections.filter((_, i) => i !== idx);
    setBlog({ ...blog, sections: newSections });
  };

  const updateSectionHeading = (idx: number, value: string) => {
    const newSections = [...blog.sections];
    newSections[idx].heading = value;
    setBlog({ ...blog, sections: newSections });
  };

  // Agrega un nuevo bloque de contenido (párrafo o lista)
  const addSectionContent = (sectionIdx: number, type: 'paragraph' | 'points') => {
    const newSections = [...blog.sections];
    if (type === 'paragraph') {
      const newParagraph = { id: `${Date.now()}-${Math.random()}`, value: '' };
      newSections[sectionIdx].content.push({
        id: `${Date.now()}-${Math.random()}`,
        type: 'paragraph',
        paragraph: { id: `${Date.now()}-${Math.random()}`, value: '' },
      });
    } else {
      const newPoint = { id: `${Date.now()}-${Math.random()}`, value: '' };
      newSections[sectionIdx].content.push({
        id: `${Date.now()}-${Math.random()}`,
        type: 'points',
        points: [newPoint],
      });
    }
    setBlog({ ...blog, sections: newSections });
  };
  // Eliminar un bloque de contenido completo
  const removeSectionContent = (sectionIdx: number, contentIdx: number) => {
    const newSections = [...blog.sections];
    newSections[sectionIdx].content.splice(contentIdx, 1);
    setBlog({ ...blog, sections: newSections });
  };

  // Actualiza campos del bloque de contenido
  const updateSectionContentField = (
    sectionIdx: number,
    contentIdx: number,
    field: keyof SectionContent,
    value: any
  ) => {
    const newSections = [...blog.sections];
    const contentBlock = newSections[sectionIdx].content[contentIdx];

    if (field === 'paragraph' && contentBlock.type === 'paragraph') {
      if (typeof contentBlock.paragraph === 'object') {
        contentBlock.paragraph.value = value;
      } else {
        // Crea el objeto si por alguna razón no existe
        contentBlock.paragraph = {
          id: `${Date.now()}-${Math.random()}`,
          value,
        };
      }
    }
    setBlog({ ...blog, sections: newSections });
  };

  // Agrega un punto a la lista
  const addPoint = (sectionIdx: number, contentIdx: number) => {
    const newSections = [...blog.sections];
    const newPoint = { id: `${Date.now()}-${Math.random()}`, value: '' };
    const contentBlock = newSections[sectionIdx].content[contentIdx];
    if (contentBlock.type === 'points') {
      if (!contentBlock.points) contentBlock.points = [];
      contentBlock.points.push(newPoint);
    }
    setBlog({ ...blog, sections: newSections });
  };

  // Actualiza un punto
  const updatePoint = (sectionIdx: number, contentIdx: number, pointId: string, value: string) => {
    const newSections = [...blog.sections];
    const points = newSections[sectionIdx].content[contentIdx].points!;
    const idx = points.findIndex((p) => p.id === pointId);
    if (idx > -1) {
      points[idx].value = value;
      setBlog({ ...blog, sections: newSections });
    }
  };

  // Elimina un punto de la lista
  const removePoint = (sectionIdx: number, contentIdx: number, pointId: string) => {
    const newSections = [...blog.sections];
    const contentBlock = newSections[sectionIdx].content[contentIdx];
    if (contentBlock.type === 'points') {
      contentBlock.points = contentBlock.points!.filter((p) => p.id !== pointId);
      setBlog({ ...blog, sections: newSections });
    }
  };

  // FAQ
  const addFaq = () => {
    setBlog((prev) => ({
      ...prev,
      faq: [...prev.faq, { id: `${Date.now()}-${Math.random()}`, question: '', answer: '' }],
    }));
  };

  // Actualizar FAQ
  const updateFaq = (faqId: string, field: keyof BlogFAQ, value: string) => {
    const newFaq = blog.faq.map((item) => (item.id === faqId ? { ...item, [field]: value } : item));
    setBlog((prev) => ({ ...prev, faq: newFaq }));
  };

  // Eliminar FAQ
  const removeFaq = (faqId: string) => {
    const newFaq = blog.faq.filter((item) => item.id !== faqId);
    setBlog((prev) => ({ ...prev, faq: newFaq }));
  };
  const updateSchedule = (value: string) => {
    setBlog((prev) => ({
      ...prev,
      scheduledAt: value ? new Date(value) : null,
      status: value ? 'scheduled' : prev.status, // ¡opcional! cambia status si hay fecha
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    const validationError = validateBlog(blog);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!client || !client._id) {
      setError('No clientId');
      return;
    }

    try {
      if (editBlog && editBlog._id) {
        await updateBlog(blog, editBlog._id, client._id, submitType);
        setSuccess(true);
      } else {
        await createBlog(blog, client._id, submitType);
        setSuccess(true);
        setBlog(initialBlog);
      }
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving blog post');
    }
  };

  return (
    <main className={styles.main}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section_header}>
          <article className={styles.header_article}>
            <aside className={styles.aside}>
              <div className={styles.div}>
                <h3 className={styles.h3}>Title</h3>
                <Info
                  direction="left"
                  info={{
                    question: 'Title',
                    answer: 'The title will appear as the main headline of your blog post.',
                  }}
                />
              </div>
              <Input
                heading="subheading"
                value={blog.title}
                onChange={handleTitleChange}
                onBlur={(value) =>
                  setErrors((errs) => ({
                    ...errs,
                    title: validateTitle(value),
                  }))
                }
                placeholder="Enter your blog title"
              />
            </aside>
            <aside className={styles.aside}>
              <div className={styles.div}>
                <h3 className={styles.h3}>Introduction</h3>
                <Info
                  direction="left"
                  info={{
                    question: 'Introduction',
                    answer:
                      'A short summary of your blog post. This description helps readers and search engines quickly understand the main topic of your article. It should be concise and engaging, usually between 60 and 160 characters.',
                  }}
                />
              </div>
              <Input
                heading="paragraph"
                value={blog.introduction}
                onChange={(value) =>
                  setBlog((prev) => ({
                    ...prev,
                    introduction: value,
                  }))
                }
                onBlur={(value) =>
                  setErrors((errs) => ({
                    ...errs,
                    introduction: validateIntroduction(value),
                  }))
                }
                height="150px"
                placeholder="Introduction"
              />
              {errors.introduction && <p className={styles.error}>{errors.introduction}</p>}
            </aside>
          </article>
          <aside className={styles.aside}>
            <div className={styles.div}>
              <h3>Blog Image</h3>
              <Info
                direction="left"
                info={{
                  question: 'Blog Image',
                  answer:
                    'The image should have a 1:1 aspect ratio (square). It will be shown as the blog’s header and in the blog card preview.',
                }}
              />
            </div>
            <ImageUpload
              label="Featured Image"
              uploadPreset="havenova_upload"
              cloudName="dd1i5d0iq"
              initialImage={blog.featuredImage}
              onUpload={(url) => setBlog((prev) => ({ ...prev, featuredImage: url }))}
              width="800px"
              aspectRatio={16 / 9}
            />
            {errors.featuredImage && <p className={styles.error}>{errors.featuredImage}</p>}
          </aside>
        </section>

        {/* Sections */}
        <section className={styles.section}>
          <div className={styles.section_div}>
            <h3>Sections</h3>
            <Info
              direction="left"
              info={{
                question: 'Section',
                answer:
                  'You can add multiple content blocks to your blog. Each block can be a paragraph (text) or a points list (bulleted). Use points for steps, recommendations, or checklists.”',
              }}
            />
          </div>
          {blog.sections.map((section, sectionIdx) => (
            <article key={sectionIdx} className={styles.section_article}>
              <button
                type="button"
                key={sectionIdx}
                className={styles.delete_button}
                onMouseEnter={() => {
                  setTimeout(() => {
                    setHoverId(sectionIdx);
                  }, 400);
                }}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => setSectionId(sectionIdx)}
              >
                <FaRegTrashCan />
              </button>
              {sectionId === sectionIdx && (
                <ConfirmationAlert
                  title="Are you sure you want to delete this section?"
                  message=""
                  onCancel={() => setSectionId(null)}
                  onConfirm={() => {
                    setSectionId(null);
                    removeSection(sectionIdx);
                  }}
                />
              )}
              <section className={styles.sections_heading}>
                <h3 className={styles.h3}>Heading</h3>
                <Input
                  heading="paragraph"
                  value={section.heading}
                  onChange={(value) => {
                    updateSectionHeading(sectionIdx, value);
                  }}
                  onBlur={() =>
                    setErrors((errs) => ({
                      ...errs,
                      sectionHeading: 'Please introduce a heading line',
                    }))
                  }
                  placeholder="Section Heading"
                />
                {errors.introduction && <p className={styles.error}>{errors.sectionHeading}</p>}
              </section>

              <section className={styles.content_section}>
                <h3>Content</h3>
                {section.content.map((content, contentIdx) => (
                  <div key={content.id} className={styles.content_div}>
                    {/* Paragraph */}
                    {content.type === 'paragraph' && (
                      <Input
                        heading="paragraph"
                        value={content.paragraph?.value || ''}
                        onChange={(value) => {
                          updateSectionContentField(sectionIdx, contentIdx, 'paragraph', value);
                        }}
                        onBlur={(value) => {
                          if (value === '') {
                            setErrors((errs) => ({
                              ...errs,
                              contentParagraph: 'Please introduce a paragraph',
                            }));
                          }
                        }}
                        height="150px"
                        placeholder="Paragraph"
                      />
                    )}
                    {errors.contentParagraph && (
                      <p className={styles.error}>{errors.contentParagraph}</p>
                    )}

                    {/* Points */}
                    {content.type === 'points' && (
                      <ul className={styles.ul}>
                        {content.points?.map((point) => (
                          <li key={point.id} className={styles.li}>
                            <Input
                              heading="paragraph"
                              value={point.value}
                              onChange={(value) => {
                                updatePoint(sectionIdx, contentIdx, point.id, value);
                              }}
                              onBlur={(value) => {
                                if (value === '') {
                                  setErrors((errs) => ({
                                    ...errs,
                                    contentPoint: 'Please introduce a point',
                                  }));
                                }
                              }}
                              placeholder="Point..."
                            />
                            <button
                              type="button"
                              className={styles.delete_button}
                              onClick={() => setOpenContentId(point.id)}
                              disabled={content.points && content.points.length <= 1}
                            >
                              <FaRegTrashCan />
                            </button>
                            {openContentId === point.id && (
                              <ConfirmationAlert
                                title="Are you sure you want to delete this point?"
                                message=""
                                onCancel={() => setOpenContentId(null)}
                                onConfirm={() => {
                                  setOpenContentId(null);
                                  removePoint(sectionIdx, contentIdx, point.id);
                                }}
                              />
                            )}
                          </li>
                        ))}
                        <button
                          type="button"
                          onClick={() => addPoint(sectionIdx, contentIdx)}
                          className={styles.button}
                        >
                          + Point
                        </button>
                      </ul>
                    )}

                    <button
                      type="button"
                      className={styles.delete_button}
                      onClick={() => setOpenContentId(content.id)}
                    >
                      <FaRegTrashCan />
                    </button>
                    {openContentId === content.id && (
                      <ConfirmationAlert
                        title="Are you sure you want to delete this content?"
                        message=""
                        onCancel={() => setOpenContentId(null)}
                        onConfirm={() => {
                          setOpenContentId(null);
                          removeSectionContent(sectionIdx, contentIdx);
                        }}
                      />
                    )}
                  </div>
                ))}
              </section>

              <div className={styles.content_buttons}>
                <button
                  className={styles.content_button}
                  type="button"
                  onClick={() => addSectionContent(sectionIdx, 'paragraph')}
                >
                  + Paragraph <HiMenuAlt2 />
                </button>
                <button
                  className={styles.content_button}
                  type="button"
                  onClick={() => addSectionContent(sectionIdx, 'points')}
                >
                  + Points List <GrList />
                </button>
              </div>
            </article>
          ))}
          <button type="button" onClick={addSection} className={styles.button}>
            + Section
          </button>
        </section>

        {/* FAQ */}
        <section className={styles.faq_section}>
          <h3>Frequently Asked Questions (FAQ)</h3>
          {blog.faq.map((item) => (
            <div className={styles.faq_div} key={item.id}>
              <aside className={styles.faq_aside}>
                <Input
                  heading="paragraph"
                  value={item.question}
                  onChange={(value) => updateFaq(item.id, 'question', value)}
                  onBlur={(value) => {
                    if (value === '') {
                      setErrors((errs) => ({
                        ...errs,
                        question: 'Please introduce a question',
                      }));
                    }
                  }}
                  placeholder="Question..."
                />
                <Input
                  heading="paragraph"
                  value={item.answer}
                  onChange={(value) => updateFaq(item.id, 'answer', value)}
                  onBlur={(value) => {
                    if (value === '') {
                      setErrors((errs) => ({
                        ...errs,
                        answer: 'Please introduce an answer',
                      }));
                    }
                  }}
                  placeholder="Answer..."
                  height="100px"
                />
              </aside>
              <button
                type="button"
                className={styles.delete_button}
                onMouseEnter={() => {
                  setTimeout(() => {
                    setHoverFaqId(item.id);
                  }, 400);
                }}
                onMouseLeave={() => setHoverFaqId(null)}
                onClick={() => setOpenFaqId(item.id)}
              >
                <FaRegTrashCan />
              </button>
              {openFaqId === item.id && (
                <ConfirmationAlert
                  title="Are you sure you want to delete this FAQ?"
                  message=""
                  onCancel={() => setOpenFaqId(null)}
                  onConfirm={() => {
                    setOpenFaqId(null);
                    removeFaq(item.id);
                  }}
                />
              )}
            </div>
          ))}

          <button type="button" onClick={addFaq} className={styles.button}>
            + FAQ
          </button>
        </section>

        <section className={styles.section}>
          <div className={styles.div}>
            <h3 className={styles.h3}>Meta Description:</h3>
            <Info
              direction="left"
              info={{
                question: 'Meta Description',
                answer:
                  'A short summary, between 100 and 160 characters, for SEO and social sharing.',
              }}
              image={{
                url: '/images/metadataExample.webp',
                alt: 'Example of Meta Description',
              }}
            />
          </div>

          <Input
            heading="paragraph"
            value={blog.metaDescription}
            onChange={(value) =>
              setBlog((prev) => ({
                ...prev,
                metaDescription: value,
              }))
            }
            onBlur={(value) =>
              setErrors((errs) => ({
                ...errs,
                metaDescription: validateMetaDescription(value),
              }))
            }
            height="150px"
            placeholder="Meta Description"
          />
          {errors.metaDescription && <p className={styles.error}>{errors.metaDescription}</p>}
        </section>

        <section className={styles.slug_section}>
          <div className={styles.div}>
            <h3>URL</h3>
            <Info
              direction="left"
              info={{
                question: 'URL',
                answer:
                  'This url will be created with the blog’s title (e.g., my-blog-title). If you want to use a diferent one, please make sure you use only lowercase letters, numbers, and hyphens (-). No spaces or special characters.',
              }}
            />
          </div>
          <aside className={styles.slug_aside}>
            <p>https://www.havenova.de/blogs/</p>
            <Input
              heading="paragraph"
              value={blog.slug}
              onChange={(value) =>
                setBlog((prev) => ({
                  ...prev,
                  slug: value,
                }))
              }
              onBlur={(value) =>
                setErrors((errs) => ({
                  ...errs,
                  slug: validateSlug(value, blogs),
                }))
              }
              placeholder="url-example"
            />
          </aside>
          {errors.slug && <p className={styles.error}>{errors.slug}</p>}
        </section>

        <section className={styles.date_section}>
          <aside className={styles.date_aside}>
            <h3>Schedule publication date</h3>
            <p>If you want to publish now, please leave this field empty</p>
          </aside>
          <input
            className={styles.date_input}
            type="date"
            value={
              blog.scheduledAt
                ? new Date(blog.scheduledAt).toISOString().split('T')[0] // formato yyyy-MM-ddTHH:mm
                : ''
            }
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => updateSchedule(e.target.value)}
          />
        </section>
        <section className={styles.button_section}>
          <button
            type="submit"
            className={styles.button}
            onClick={() => {
              setSubmitType('draft');
              setTimeout(() => {
                router.push('/dashboard/blog');
              }, 2000);
            }}
          >
            Save as draft
          </button>
          <button
            type="submit"
            className={styles.button}
            onClick={() => {
              if (!blog.scheduledAt) {
                setSubmitType('published');
                setTimeout(() => {
                  router.push('/dashboard/blog');
                }, 2000);
              } else {
                setSubmitType('scheduled');
                setTimeout(() => {
                  router.push('/dashboard/blog');
                }, 2000);
              }
            }}
          >
            {editBlog ? 'Update Blog' : 'Publish Blog'}
          </button>
        </section>
        {success && <p style={{ color: 'green' }}>Blog post created successfully ✅</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <article className={styles.view_article}>
        <BlogCard blog={blog} isPreview />
        <BlogPreview post={blog} isPreview />
      </article>
    </main>
  );
}
