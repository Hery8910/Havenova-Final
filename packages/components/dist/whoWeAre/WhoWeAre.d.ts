interface WeAreItem {
    title: string;
    description: string;
}
interface WeAre {
    title: string;
    description: string;
    list: WeAreItem[];
}
interface WhoWeAreProps {
    weAre: WeAre;
}
declare const WhoWeAre: ({ weAre }: WhoWeAreProps) => import("react/jsx-runtime").JSX.Element;
export default WhoWeAre;
//# sourceMappingURL=WhoWeAre.d.ts.map