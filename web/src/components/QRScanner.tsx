// web/src/components/QRScanner.tsx
'use client';
import { Scanner } from '@yudiel/react-qr-scanner';

interface QRScannerProps {
  onScan: (result: string) => void;
}

export const QRScanner = ({ onScan }: QRScannerProps) => {
  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 rounded-lg overflow-hidden">
      <Scanner
        onScan={(barcodes) => {
          if (barcodes.length > 0) {
            onScan(barcodes[0].rawValue);
          }
        }}
        onError={(error) => {
          if (error instanceof Error) {
            console.error(error.message);
          }
        }}
      />
    </div>
  );
};