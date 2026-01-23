import { FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorialFooterProps {
  onDownloadPdf?: () => void;
}

export function EditorialFooter({ onDownloadPdf }: EditorialFooterProps) {
  return (
    <footer className="py-10 md:py-14 border-t border-border/30">
      <div className="container max-w-3xl mx-auto px-4 md:px-6 text-center">
        {/* Download PDF button */}
        {onDownloadPdf && (
          <button
            onClick={onDownloadPdf}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 mb-6",
              "text-sm font-medium text-foreground",
              "bg-card hover:bg-muted border border-border/50 rounded-full",
              "transition-all duration-200 hover:shadow-md"
            )}
          >
            <FileDown className="w-4 h-4" />
            Descargar menú en PDF
          </button>
        )}
        
        {/* Credit */}
        <p className="text-xs text-muted-foreground">
          Menú digital
        </p>
      </div>
    </footer>
  );
}
