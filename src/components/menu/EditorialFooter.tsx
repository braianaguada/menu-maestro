import { FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorialFooterProps {
  onDownloadPdf?: () => void;
}

export function EditorialFooter({ onDownloadPdf }: EditorialFooterProps) {
  return (
    <footer className="py-16 md:py-20 border-t border-border/20">
      <div className="container max-w-4xl mx-auto px-6 md:px-8">
        {/* Download PDF button - Cassis style */}
        {onDownloadPdf && (
          <div className="mb-8">
            <button
              onClick={onDownloadPdf}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5",
                "text-caption font-medium text-foreground",
                "bg-transparent hover:bg-secondary border border-border/50",
                "transition-smooth"
              )}
            >
              <FileDown className="w-4 h-4" />
              DESCARGAR MENÚ
            </button>
          </div>
        )}

        {/* Minimal credit - Cassis style */}
        <p className="text-caption text-muted-foreground/60">
          MENÚ DIGITAL
        </p>
      </div>
    </footer>
  );
}