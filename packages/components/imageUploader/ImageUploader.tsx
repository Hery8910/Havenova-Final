import React, { useRef } from 'react';
import { useImageUploader } from '@/packages/hooks/useImageUploader';
import { useGlobalAlert } from '../../contexts/alert/AlertContext';
import { useEffect } from 'react';

interface Props {
  clientId: string;
  category: string;
  service?: string;
  onImagesChange?: (urls: string[]) => void;
}

const ImageUploader = ({ clientId, category, service, onImagesChange }: Props) => {
  const { files, uploaded, loading, addFiles, removeLocal, uploadAll, deleteImage } =
    useImageUploader(clientId, category, service);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showConfirm, showSuccess, showError } = useGlobalAlert();

  useEffect(() => {
    const localUrls = files.map((file) => URL.createObjectURL(file));
    onImagesChange?.(localUrls);
  }, [files, onImagesChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = (key: string) => {
    showConfirm({
      response: {
        status: 300,
        title: '¿Eliminar imagen?',
        description: 'Esta acción no se puede deshacer.',
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
      },
      onConfirm: async () => {
        try {
          await deleteImage(key);
          showSuccess({
            response: {
              status: 200,
              title: 'Imagen eliminada',
              description: 'La imagen se eliminó correctamente.',
            },
          });
        } catch (error) {
          showError({
            response: {
              status: 500,
              title: 'Error al eliminar',
              description: 'No se pudo eliminar la imagen.',
            },
          });
        }
      },
    });
  };

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />

      <button type="button" onClick={handleClick} disabled={loading}>
        {files.length
          ? `${files.length} archivo${files.length > 1 ? 's' : ''} seleccionados`
          : 'Seleccionar imágenes'}
      </button>

      <div className="preview-container">
        {files.map((file, i) => (
          <div key={i} className="preview-item">
            <img src={URL.createObjectURL(file)} alt="" />
            <button type="button" onClick={() => removeLocal(i)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <button type="button" disabled={!files.length || loading} onClick={uploadAll}>
        {loading ? 'Subiendo...' : 'Subir imágenes'}
      </button>

      <div className="uploaded-list">
        {uploaded.map((img) => (
          <div key={img.key} className="uploaded-item">
            <img src={img.url} alt="" />
            <button type="button" onClick={() => handleDelete(img.key)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
