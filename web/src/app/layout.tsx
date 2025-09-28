import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link'; // Import the Link component

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
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Providers>
          {/* --- New Navbar --- */}
          <header className="p-4 flex justify-between items-center border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
            <div className="flex items-center space-x-8">
              {/* Site Title */}
              <Link href="/" className="text-2xl font-bold text-green-400 hover:text-green-600 transition-colors">
                ParkBNB
              </Link>
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  Find Spots
                </Link>
                <Link href="/host" className="text-gray-300 hover:text-green-400 transition-colors">
                  Create Spot
                </Link>
                <Link href="/bookings" className="text-gray-300 hover:text-green-400 transition-colors">
                  Your Bookings
                </Link>
              </nav>
            </div>
            
            {/* Wallet Connect Button */}
            <div>
              <ConnectButton />
            </div>
          </header>
          
          <main className="p-4 md:p-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
