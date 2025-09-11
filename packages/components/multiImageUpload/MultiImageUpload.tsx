import Image from 'next/image';
import React, { useRef, useState } from 'react';
import styles from './MultiImageUpload.module.css';

interface MultiImageUploadProps {
  label?: string;
  onUpload: (urls: string[]) => void;
  uploadPreset: string;
  cloudName: string;
  initialImages?: string[];
}

export default function MultiImageUpload({
  label = 'Upload Images',
  onUpload,
  uploadPreset,
  cloudName,
  initialImages = [],
}: MultiImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);

    try {
      const urls: string[] = [];
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
    } catch (err: any) {
      setError('An error occurred while uploading images.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (idx: number) => {
    const newImages = images.filter((_, i) => i !== idx);
    setImages(newImages);
    onUpload(newImages);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>{label}</label>
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Select Images'}
        </button>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {images.map((url, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            <Image
              //   className={styles.image}
              src={url}
              priority={true}
              alt={`Uploaded ${idx + 1}`}
              width={150}
              height={150}
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: '#fff',
                border: 'none',
                color: 'red',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              title="Remove image"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
