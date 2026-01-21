import { useRef, useState } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: 'logos' | 'items' | 'promotions';
  className?: string;
  aspectRatio?: 'square' | 'wide' | 'auto';
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'items',
  className,
  aspectRatio = 'square',
  placeholder = 'Subir imagen',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useImageUpload();
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    try {
      const result = await upload(file, { folder });
      onChange(result.url);
      toast.success('Imagen subida');
    } catch (error: any) {
      toast.error(error.message || 'Error al subir imagen');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleRemove = () => {
    onChange(null);
  };

  const aspectClasses = {
    square: 'aspect-square',
    wide: 'aspect-video',
    auto: 'min-h-[120px]',
  };

  if (value) {
    return (
      <div className={cn('relative group', className)}>
        <div className={cn('rounded-lg overflow-hidden bg-muted', aspectClasses[aspectRatio])}>
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
          onClick={handleRemove}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-lg transition-colors cursor-pointer',
        dragActive
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50',
        aspectClasses[aspectRatio],
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={uploading}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Subiendo...</span>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground text-center">
              {placeholder}
            </span>
            <span className="text-xs text-muted-foreground/70">
              Arrastra o haz clic
            </span>
          </>
        )}
      </div>
    </div>
  );
}
