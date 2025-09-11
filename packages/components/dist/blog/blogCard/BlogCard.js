'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from 'next/image';
import styles from './BlogCard.module.css';
import { IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';
export default function BlogCard({ blog, isPreview }) {
    return (_jsxs("section", { className: isPreview ? styles.preview_section : styles.section, children: [_jsxs("main", { className: styles.main, children: [_jsx("h3", { className: styles.h3, children: blog.title || 'The title will appear as the main headline of your blog post.' }), isPreview && (_jsx("p", { className: styles.p, children: blog.introduction ||
                            'A short summary of your blog post. This description helps readers and search engines quickly understand the main topic of your article. It should be concise and engaging, usually between 60 and 160 characters.' })), _jsxs(Link, { href: `/blogs/${blog.slug}`, className: styles.link, children: ["View ", _jsx(IoIosArrowForward, {})] })] }), _jsx(Image, { className: isPreview ? styles.preview_image : styles.image, src: blog.featuredImage || '/images/blog-image-mock.webp', priority: true, alt: blog.title || 'Image', width: 200, height: 95 })] }));
}
