interface Item {
    id: string;
    value: string;
}
export interface SectionContent {
    id: string;
    type: "paragraph" | "points";
    paragraph?: Item;
    points?: Item[];
}
export interface BlogSection {
    heading: string;
    content: SectionContent[];
}
export interface BlogFAQ {
    id: string;
    question: string;
    answer: string;
}
export interface BlogComment {
    author: string;
    profileImage: string;
    content: string;
    parentId?: string | null;
    approved: boolean;
}
export interface BlogCommentDB extends BlogComment {
    _id: string;
    createdAt: string;
    updatedAt?: string;
    isGeneral?: boolean;
}
export interface BlogPost {
    title: string;
    slug: string;
    featuredImage: string;
    metaDescription: string;
    introduction: string;
    sections: BlogSection[];
    faq: BlogFAQ[];
    author: string;
    status: BlogStatus;
    scheduledAt?: Date | null;
    comments?: BlogCommentDB[];
}
export type BlogStatus = "draft" | "published" | "scheduled";
export interface BlogFromDB extends BlogPost {
    _id: string;
    createdAt: string;
    updatedAt?: string;
}
export interface IframeProps {
    width?: string | number;
    height?: string | number;
    src: string;
    frameBorder?: number;
    scrolling?: 'auto' | 'yes' | 'no';
    allowFullScreen?: boolean;
    style?: React.CSSProperties;
}
export interface BlogPaginationResponse {
    blogs: BlogFromDB[];
    total: number;
    page: number;
    totalPages: number;
}
export {};
//# sourceMappingURL=blog.d.ts.map