import { FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorialFooterProps {
  onDownloadPdf?: () => void;
}

export function EditorialFooter({ onDownloadPdf }: EditorialFooterProps) {
  return (
    <footer className="py-14 md:py-18 border-t border-border/30 bg-card/30">
      <div className="container max-w-3xl mx-auto px-5 md:px-8 text-center">
        {/* Download PDF button - Cassis style */}
        {onDownloadPdf && (
          <div className="mb-8">
            <button
              onClick={onDownloadPdf}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3",
                "text-caption font-semibold text-foreground tracking-wider",
                "bg-transparent hover:bg-primary/5 border border-border/60 hover:border-primary/40",
                "transition-smooth"
              )}
            >
              <FileDown className="w-4 h-4" />
              DESCARGAR MENÚ PDF
            </button>
          </div>
        )}

        {/* Minimal credit - centered Cassis style */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-border/50" />
          <p className="text-caption text-muted-foreground/50">
            MENÚ DIGITAL
          </p>
          <div className="h-px w-8 bg-border/50" />
        </div>
      </div>
    </footer>
  );
}