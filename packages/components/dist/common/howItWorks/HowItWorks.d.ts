export interface HowItWorksStep {
    title: string;
    description: string;
    image: {
        src: string;
        alt: string;
    };
}
export interface HowItWorksData {
    title: string;
    subtitle: string;
    description: string;
    steps: HowItWorksStep[];
    cta: {
        label: string;
        href: string;
    };
}
declare const HowItWorks: React.FC<HowItWorksData>;
export default HowItWorks;
//# sourceMappingURL=HowItWorks.d.ts.map