export type StarRating = 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE' | 'STAR_RATING_UNSPECIFIED';
export interface GbpReview {
    reviewId: string;
    name: string;
    reviewer: {
        displayName?: string;
        profilePhotoUrl?: string;
        isAnonymous?: boolean;
    };
    starRating: StarRating;
    comment?: string;
    createTime: string;
    updateTime?: string;
    reviewReply?: {
        comment?: string;
        updateTime?: string;
    };
}
export interface TestimonialItem {
    id: string;
    author: string;
    avatarUrl?: string;
    rating: number;
    text: string;
    date: string;
    reply?: {
        text: string;
        date?: string;
    };
}
export interface TestimonialsProps {
    title: string;
    subtitle: string;
    description: string;
    items: TestimonialItem[];
    cta: {
        label: string;
        href: string;
    };
    mobile: boolean;
}
declare const Testimonials: React.FC<TestimonialsProps>;
export default Testimonials;
//# sourceMappingURL=Testimonials.d.ts.map