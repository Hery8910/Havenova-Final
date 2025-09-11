interface MultiImageUploadProps {
    label?: string;
    onUpload: (urls: string[]) => void;
    uploadPreset: string;
    cloudName: string;
    initialImages?: string[];
}
export default function MultiImageUpload({ label, onUpload, uploadPreset, cloudName, initialImages, }: MultiImageUploadProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MultiImageUpload.d.ts.map