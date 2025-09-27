// web/src/app/host/page.tsx
'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, keccak256, stringToHex } from 'viem';
import ParkingContractInfo from '@/lib/ParkingMarketplace.json';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

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

    console.log('Generated Secret:', newSecret);
    console.log('Secret Hash to send:', secretHash);

    // 2. Call the smart contract
    writeContract({
      address: contractAddress,
      abi: ParkingContractInfo.abi,
      functionName: 'createSpot',
      args: [parseEther(rate), secretHash],
    });
  };

  // 3. Generate QR code after the transaction is confirmed
  if (isConfirmed && secret && !qrCodeUrl) {
    const qrPayload = JSON.stringify({ secret: secret });
    QRCode.toDataURL(qrPayload).then(setQrCodeUrl);
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Host Dashboard</h2>
      <form onSubmit={handleCreateSpot} className="space-y-4 max-w-sm">
        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-gray-300">
            Rate per Hour (ETH)
          </label>
          <input
            id="rate"
            type="text"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g., 0.001"
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm p-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
        >
          {isPending ? 'Confirming...' : 'Create Spot'}
        </button>
      </form>

      {isConfirming && <div className="mt-4 text-yellow-400">Waiting for transaction confirmation...</div>}
      {isConfirmed && <div className="mt-4 text-green-400">Spot created successfully!</div>}

      {qrCodeUrl && (
        <div className="mt-8 p-4 bg-white rounded-lg inline-block">
          <h3 className="text-lg font-semibold text-black">Your Spot's QR Code</h3>
          <p className="text-sm text-gray-600">Print this and display it at your parking spot.</p>
          <img src={qrCodeUrl} alt="Parking Spot QR Code" />
        </div>
      )}
    </div>
  );
}