import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UploadOptions {
  folder?: 'logos' | 'items' | 'promotions';
  maxSizeMB?: number;
}

interface UploadResult {
  url: string;
  path: string;
}

export function useImageUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    const { folder = 'items', maxSizeMB = 5 } = options;

    if (!user) {
      throw new Error('Debes iniciar sesión para subir imágenes');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    // Validate file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error(`La imagen debe ser menor a ${maxSizeMB}MB`);
    }

    setUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const filePath = `${user.id}/${folder}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setProgress(100);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: filePath,
      };
    } finally {
      setUploading(false);
    }
  };

  const remove = async (path: string): Promise<void> => {
    if (!user) {
      throw new Error('Debes iniciar sesión');
    }

    const { error } = await supabase.storage
      .from('menu-images')
      .remove([path]);

    if (error) {
      throw error;
    }
  };

  return {
    upload,
    remove,
    uploading,
    progress,
  };
}
