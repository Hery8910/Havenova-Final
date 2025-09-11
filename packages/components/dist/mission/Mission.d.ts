interface mission {
    title: string;
    description: string;
    image: string;
    alt: string;
}
interface MissionProps {
    mission: mission;
}
declare const Mission: ({ mission }: MissionProps) => import("react/jsx-runtime").JSX.Element;
export default Mission;
//# sourceMappingURL=Mission.d.ts.map