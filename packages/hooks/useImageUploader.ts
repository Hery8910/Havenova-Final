'use client';
import { useEffect, useState } from 'react';
import localforage from 'localforage';
import { useGlobalAlert } from '@havenova/contexts/alert/AlertContext';

interface UploadedImage {
  url: string;
  key: string;
}

const IMAGE_STORAGE_KEY = 'service_images'; // clave base para las imágenes

export const useImageUploader = (clientId: string, category: string, service?: string) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { showConfirm, showSuccess, showError } = useGlobalAlert();

  // 💾 Inicializar localforage
  useEffect(() => {
    localforage.config({
      name: 'HavenovaApp',
      storeName: 'service_requests',
      description: 'Almacena imágenes temporales de solicitudes de servicio',
    });

    // 🔁 Cargar imágenes guardadas en memoria al montar
    (async () => {
      const stored = await localforage.getItem<File[]>(
        `${IMAGE_STORAGE_KEY}_${clientId}_${category}`
      );
      if (stored && stored.length) setFiles(stored);
    })();
  }, [clientId, category]);

  // 💾 Guardar cambios cada vez que se agregan o eliminan archivos
  useEffect(() => {
    if (files.length >= 0) {
      localforage.setItem(`${IMAGE_STORAGE_KEY}_${clientId}_${category}`, files);
    }
  }, [files, clientId, category]);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE_MB = 3;
  const MAX_TOTAL_MB = 10;

  const addFiles = (newFiles: FileList) => {
    const currentCount = files.length;
    const addedFiles = Array.from(newFiles);

    // 1️⃣ Cantidad máxima
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

  // ❌ Eliminar imagen local (con confirmación)
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
          await localforage.setItem(`${IMAGE_STORAGE_KEY}_${clientId}_${category}`, updated);

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
    await localforage.removeItem(`${IMAGE_STORAGE_KEY}_${clientId}_${category}`);
    setLoading(false);
  };

  // 🗑️ Eliminar imagen del backend (ya subida)
  const deleteImage = async (key: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
    setUploaded((prev) => prev.filter((img) => img.key !== key));
  };

  return { files, uploaded, loading, addFiles, removeLocal, uploadAll, deleteImage };
};
