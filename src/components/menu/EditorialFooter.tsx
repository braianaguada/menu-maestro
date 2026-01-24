import { FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorialFooterProps {
  onDownloadPdf?: () => void;
}

export function EditorialFooter({ onDownloadPdf }: EditorialFooterProps) {
  return (
    <footer className="py-12 md:py-16 border-t border-border/20">
      <div className="container max-w-3xl mx-auto px-4 md:px-6 text-center">
        {/* Download PDF button */}
        {onDownloadPdf && (
          <button
            onClick={onDownloadPdf}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 mb-6",
              "text-caption font-medium text-foreground",
              "bg-secondary hover:bg-muted border border-border/40 rounded-full",
              "transition-smooth hover:shadow-menu-md"
            )}
          >
            <FileDown className="w-4 h-4" />
            Descargar menú en PDF
          </button>
        )}

        {/* Credit */}
        <p className="text-caption text-muted-foreground/70">
          Menú digital
        </p>
      </div>
    </footer>
  );
}
