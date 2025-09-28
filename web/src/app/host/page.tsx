// web/src/app/host/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, keccak256, stringToHex } from 'viem';
import ParkingContractInfo from '@/lib/ParkingMarketplace.json';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import Image from 'next/image'; // Import Image component

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function HostPage() {
  const [rate, setRate] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const { address } = useAccount();

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  
  // Generate QR code after the transaction is confirmed
  useEffect(() => {
    if (isConfirmed && secret && !qrCodeUrl) {
      const qrPayload = JSON.stringify({ secret: secret });
      QRCode.toDataURL(qrPayload, {
        color: {
          dark: '#000000', // Black dots
          light: '#FFFFFF', // White background
        },
        width: 256,
      }).then(setQrCodeUrl);
    }
  }, [isConfirmed, secret, qrCodeUrl]);


  const handleCreateSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rate || !address) {
      alert('Please connect your wallet and enter a rate.');
      return;
    }

    // 1. Generate a unique secret and hash it
    const newSecret = uuidv4();
    const secretHash = keccak256(stringToHex(newSecret));
    setSecret(newSecret); // Store the secret to generate QR later

    // 2. Call the smart contract
    writeContract({
      address: contractAddress,
      abi: ParkingContractInfo.abi,
      functionName: 'createSpot',
      args: [parseEther(rate), secretHash],
    });
  };

  return (
    <div className="relative min-h-screen">
      <Image
        src="/background.png"
        alt="Tactical green grid background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0 opacity-20"
      />
      <main className="container mx-auto p-4 md:p-8 relative z-10">
        <div className="text-left mb-10">
          <h1 className="text-3xl font-bold text-green-400">Host Dashboard</h1>
          <p className="mt-2 text-gray-400">Create and manage your parking spot.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sm:p-8">
            <form onSubmit={handleCreateSpot} className="space-y-6">
              <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-300 mb-1">
                  Rate per Hour (in ETH)
                </label>
                <input
                  id="rate"
                  type="text"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="e.g., 0.001"
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm focus:border-green-500 focus:ring-green-500 p-3"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isPending || isConfirming}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors duration-300"
              >
                {isPending ? 'Awaiting Signature...' : isConfirming ? 'Creating Spot...' : 'Create New Spot'}
              </button>
            </form>

            {/* Transaction Status Area */}
            <div className="mt-6 text-center">
              {isConfirming && (
                <p className="text-yellow-400">Waiting for transaction confirmation...</p>
              )}
              {isConfirmed && !qrCodeUrl && (
                <p className="text-green-400">✅ Spot created successfully! Generating QR Code...</p>
              )}
            </div>
          </div>

          {qrCodeUrl && (
            <div className="mt-10 p-6 bg-gray-800/50 border border-gray-700 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-white">Your Spot is Live!</h3>
              <p className="text-sm text-gray-400 mt-2 mb-4">
                Print this QR code and display it at your parking spot. Drivers will scan it to check in.
              </p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <img src={qrCodeUrl} alt="Parking Spot QR Code" />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}