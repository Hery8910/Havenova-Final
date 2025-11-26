import React, { useRef } from 'react';
import { useImageUploader } from '@/packages/hooks/useImageUploader';
import { useEffect } from 'react';
import styles from './ImageUploader.module.css';
import Image from 'next/image';
import { MdDeleteForever } from 'react-icons/md';

interface Props {
  clientId: string;
  category: string;
  service?: string;
  requestId?: string;
  onImagesChange?: (urls: string[]) => void;
}

const ImageUploader = ({ clientId, category, service, requestId, onImagesChange }: Props) => {
  const { files, loading, addFiles, removeLocal } = useImageUploader(
    clientId,
    category,
    service,
    requestId
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files, onImagesChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className={styles.section}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className={styles.hidden}
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />
      <header className={styles.header}>
        <p className={styles.p}>{`Desea agregar ${files.length >= 1 ? 'más' : ''} imágenes?`}</p>
        <button className={styles.open} type="button" onClick={handleClick} disabled={loading}>
          Hinzufügen
        </button>
      </header>
      {previewUrls.length !== 0 && (
        <ul className={styles.ul}>
          {previewUrls.map((url, i) => {
            return (
              <li key={i} className={styles.li}>
                <Image
                  src={url}
                  alt={`imagen ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <button
                  className={styles.deleteButton}
                  type="button"
                  onClick={() => removeLocal(i)}
                >
                  <MdDeleteForever />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default ImageUploader;
