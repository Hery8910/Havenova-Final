import React from 'react';
export interface ServicesPreviewItems {
    title: string;
    image: {
        src: string;
    };
}
export interface ServicesPreviewData {
    title: string;
    subtitle: string;
    description: string;
    items: ServicesPreviewItems[];
    cta: {
        label: string;
        href: string;
    };
    theme: 'light' | 'dark';
}
declare const ServicesPreview: React.FC<ServicesPreviewData>;
export default ServicesPreview;
//# sourceMappingURL=ServicesPreview.d.ts.map