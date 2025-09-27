// web/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers'; // Make sure this is imported
import { ConnectButton } from '@rainbow-me/rainbowkit'; // Example for connect button

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ParkBNB',
  description: 'Decentralized Parking Marketplace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers> {/* This now provides the Sepolia configuration */}
          <header className="p-4 flex justify-between items-center border-b">
            <h1 className="text-xl font-bold">ParkBNB</h1>
            <ConnectButton />
          </header>
          <main className="p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}