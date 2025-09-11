import React from 'react';
export interface WhyChooseItems {
    title: string;
    image: {
        src: string;
    };
}
export interface WhyChooseProps {
    title: string;
    description: string;
    points: WhyChooseItems[];
}
declare const WhyChoose: React.FC<WhyChooseProps>;
export default WhyChoose;
//# sourceMappingURL=WhyChoose.d.ts.map