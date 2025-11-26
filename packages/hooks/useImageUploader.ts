'use client';
import { useEffect, useState } from 'react';
import localforage from 'localforage';
import { useGlobalAlert } from '@havenova/contexts/alert/AlertContext';

interface UploadedImage {
  url: string;
  key: string;
}

const IMAGE_STORAGE_KEY = 'service_images';

export const useImageUploader = (
  clientId: string,
  category: string,
  service?: string,
  requestId?: string
) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { showConfirm, showSuccess, showError } = useGlobalAlert();

  // 🧩 Definimos la clave específica para esta solicitud
  const storageKey = `${IMAGE_STORAGE_KEY}_${clientId}_${category}_${requestId ?? 'temp'}`;

  useEffect(() => {
    localforage.config({
      name: 'HavenovaApp',
      storeName: 'service_requests',
      description: 'Almacena imágenes temporales por solicitud de servicio',
    });

    // 🔁 Cargar imágenes solo de esta solicitud
    (async () => {
      const stored = await localforage.getItem<File[]>(storageKey);
      if (stored && stored.length) setFiles(stored);
    })();
  }, [storageKey]);

  // 💾 Guardar cambios
  useEffect(() => {
    localforage.setItem(storageKey, files);
  }, [files, storageKey]);

  const MAX_FILES = 3;
  const MAX_FILE_SIZE_MB = 3;
  const MAX_TOTAL_MB = 10;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

  const addFiles = (newFiles: FileList) => {
    const currentCount = files.length;
    const addedFiles = Array.from(newFiles);

    // Validaciones
    const invalidFile = addedFiles.find((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalidFile) {
      showError({
        response: {
          status: 400,
          title: 'Formato no permitido',
          description: `El archivo ${invalidFile.name} no tiene un formato válido (JPG, PNG, WEBP o AVIF).`,
        },
      });
      return;
    }

    if (currentCount + addedFiles.length > MAX_FILES) {
      showError({
        response: {
          status: 400,
          title: 'Límite alcanzado',
          description: `Solo puedes adjuntar hasta ${MAX_FILES} imágenes.`,
        },
      });
      return;
    }

    const tooLarge = addedFiles.find((f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (tooLarge) {
      showError({
        response: {
          status: 400,
          title: 'Archivo demasiado grande',
          description: `Cada imagen debe pesar menos de ${MAX_FILE_SIZE_MB} MB.`,
        },
      });
      return;
    }

    const totalSize =
      files.reduce((acc, f) => acc + f.size, 0) + addedFiles.reduce((acc, f) => acc + f.size, 0);

    if (totalSize > MAX_TOTAL_MB * 1024 * 1024) {
      showError({
        response: {
          status: 400,
          title: 'Tamaño total excedido',
          description: `El tamaño total de todas las imágenes no puede superar ${MAX_TOTAL_MB} MB.`,
        },
      });
      return;
    }

    setFiles((prev) => [...prev, ...addedFiles]);
    showSuccess({
      response: {
        status: 200,
        title: 'Imágenes agregadas',
        description: `${addedFiles.length} imagen${addedFiles.length > 1 ? 'es' : ''} añadida${
          addedFiles.length > 1 ? 's' : ''
        } correctamente.`,
      },
    });
  };

  // ❌ Eliminar imagen local
  const removeLocal = (index: number) => {
    showConfirm({
      response: {
        status: 401,
        title: '¿Eliminar imagen?',
        description: 'Esta acción no se puede deshacer.',
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
      },
      onConfirm: async () => {
        try {
          const updated = files.filter((_, i) => i !== index);
          setFiles(updated);
          await localforage.setItem(storageKey, updated);

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

  // 📤 Subida al backend (Cloudflare)
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId);
    formData.append('category', category);
    if (service) formData.append('service', service);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  };

  const uploadAll = async () => {
    setLoading(true);
    const results: UploadedImage[] = [];

    for (const file of files) {
      const data = await uploadFile(file);
      if (data.success) results.push(data.file);
    }

    setUploaded(results);
    setFiles([]);
    await localforage.removeItem(storageKey);
    setLoading(false);
  };

  // 🗑️ Eliminar imágenes de esta solicitud manualmente (por ejemplo, tras enviar al backend)
  const clearImagesForRequest = async () => {
    await localforage.removeItem(storageKey);
    setFiles([]);
    setUploaded([]);
  };

  return {
    files,
    uploaded,
    loading,
    addFiles,
    removeLocal,
    uploadAll,
    deleteImage: uploadAll,
    clearImagesForRequest,
  };
};
