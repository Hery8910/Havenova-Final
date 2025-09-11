import React from 'react';
export interface OfferBannerContent {
    header: string;
    description: string;
    cta: {
        label: string;
        href: string;
    };
    image: {
        src: string;
        alt: string;
    };
    priorityOnFirstViewport?: boolean;
}
declare const WelcomeOfferBanner: React.FC<OfferBannerContent>;
export default WelcomeOfferBanner;
//# sourceMappingURL=WelcomeOfferBanner.d.ts.map