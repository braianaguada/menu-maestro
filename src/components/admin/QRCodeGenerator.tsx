import { useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, QrCode } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface QRCodeGeneratorProps {
  menuSlug: string;
  menuName: string;
}

export function QRCodeGenerator({ menuSlug, menuName }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const menuUrl = `${window.location.origin}/m/${menuSlug}`;
  const trackedMenuUrl = `${menuUrl}?source=qr`;

  const downloadQR = useCallback(() => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Create a canvas to convert SVG to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 1200;
    const headerHeight = 220;
    const footerHeight = 180;
    const qrSize = 760;
    const padding = 100;
    canvas.width = size;
    canvas.height = headerHeight + qrSize + footerHeight;

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header band
      const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      headerGradient.addColorStop(0, '#111827');
      headerGradient.addColorStop(1, '#1f2937');
      ctx.fillStyle = headerGradient;
      ctx.fillRect(0, 0, canvas.width, headerHeight);

      // Header text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 60px Inter, system-ui, sans-serif';
      ctx.fillText(menuName, padding, 130);
      ctx.font = '28px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#d1d5db';
      ctx.fillText('Menú digital · Escaneá para ver la carta', padding, 180);

      // QR container
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = headerHeight + 40;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48);
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(qrX - 24, qrY - 24, qrSize + 48, 8);
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

      // Footer URL
      ctx.fillStyle = '#111827';
      ctx.font = '32px Inter, system-ui, sans-serif';
      ctx.fillText('Abrí el menú en:', padding, headerHeight + qrSize + 100);
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 30px Inter, system-ui, sans-serif';
      ctx.fillText(trackedMenuUrl, padding, headerHeight + qrSize + 145);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-${menuSlug}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  }, [menuSlug, menuName, trackedMenuUrl]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="w-4 h-4 mr-2" />
          Código QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Código QR - {menuName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div
            ref={qrRef}
            className="w-full rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-muted/20 p-6 text-center shadow-menu-sm"
          >
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Menú digital</p>
              <h3 className="text-lg font-semibold text-foreground">{menuName}</h3>
            </div>
            <div className="mx-auto inline-flex items-center justify-center rounded-2xl bg-white p-4 shadow-md">
              <QRCodeSVG
                value={trackedMenuUrl}
                size={220}
                level="H"
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="#111827"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Escaneá para ver la carta completa
            </p>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Enlace público:
            </p>
            <a
              href={menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm break-all"
            >
              {menuUrl}
            </a>
            <p className="text-xs text-muted-foreground">
              El QR incluye tracking de escaneos.
            </p>
          </div>

          <Button onClick={downloadQR} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Descargar QR (PNG)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
