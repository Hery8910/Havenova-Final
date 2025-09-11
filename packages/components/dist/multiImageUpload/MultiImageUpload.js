import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from 'next/image';
import { useRef, useState } from 'react';
export default function MultiImageUpload({ label = 'Upload Images', onUpload, uploadPreset, cloudName, initialImages = [], }) {
    const fileInputRef = useRef(null);
    const [images, setImages] = useState(initialImages);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const handleFileChange = async (e) => {
        setError(null);
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0)
            return;
        setUploading(true);
        try {
            const urls = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', uploadPreset);
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (data.secure_url) {
                    urls.push(data.secure_url);
                }
            }
            const newImages = [...images, ...urls];
            setImages(newImages);
            onUpload(newImages);
        }
        catch (err) {
            setError('An error occurred while uploading images.');
        }
        finally {
            setUploading(false);
            if (fileInputRef.current)
                fileInputRef.current.value = '';
        }
    };
    const removeImage = (idx) => {
        const newImages = images.filter((_, i) => i !== idx);
        setImages(newImages);
        onUpload(newImages);
    };
    return (_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("label", { children: label }), _jsxs("div", { style: { marginTop: 8, marginBottom: 8 }, children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", multiple: true, style: { display: 'none' }, onChange: handleFileChange }), _jsx("button", { type: "button", onClick: () => fileInputRef.current?.click(), disabled: uploading, children: uploading ? 'Uploading...' : 'Select Images' })] }), _jsx("div", { style: { display: 'flex', gap: 10, flexWrap: 'wrap' }, children: images.map((url, idx) => (_jsxs("div", { style: { position: 'relative' }, children: [_jsx(Image
                        //   className={styles.image}
                        , { 
                            //   className={styles.image}
                            src: url, priority: true, alt: `Uploaded ${idx + 1}`, width: 150, height: 150 }), _jsx("button", { type: "button", onClick: () => removeImage(idx), style: {
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                background: '#fff',
                                border: 'none',
                                color: 'red',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            }, title: "Remove image", children: "\u00D7" })] }, idx))) }), error && _jsx("div", { style: { color: 'red' }, children: error })] }));
}
