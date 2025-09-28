// web/src/components/SpotCard.tsx
'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import ParkingContractInfo from '@/lib/ParkingMarketplace.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// The spotData is an array from the contract: [owner, ratePerHourWei, active, qrSecretHash]
type SpotCardProps = {
  spotId: number;
  spotData: readonly [string, bigint, boolean, string];
};

export function SpotCard({ spotId, spotData }: SpotCardProps) {
  const [maxHours, setMaxHours] = useState('1');
  const { address: connectedAddress } = useAccount();

  const owner = spotData[0];
  const ratePerHourWei = spotData[1];
  const ratePerHourEth = formatEther(ratePerHourWei);

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleBookSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maxHours || parseInt(maxHours) <= 0) {
      alert('Please enter a valid number of hours.');
      return;
    }

    const depositWei = ratePerHourWei * BigInt(maxHours);

    writeContract({
      address: contractAddress,
      abi: ParkingContractInfo.abi,
      functionName: 'bookSpot',
      args: [BigInt(spotId), parseInt(maxHours)],
      value: depositWei,
    });
  };

  const isOwner = connectedAddress && connectedAddress.toLowerCase() === owner.toLowerCase();
  const totalCost = formatEther(ratePerHourWei * BigInt(maxHours || 0));

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col justify-between transition-all hover:border-green-500/50">
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-green-400">Spot #{spotId}</h3>
          <p className="text-lg font-semibold text-white">{ratePerHourEth} ETH/hr</p>
        </div>
        <p className="text-xs text-gray-500 truncate mt-1" title={owner}>
          Owner: {owner}
        </p>
      </div>

      {!isOwner && (
        <form onSubmit={handleBookSpot} className="mt-6">
          <div>
            <label htmlFor={`max-hours-${spotId}`} className="block text-sm font-medium text-gray-300 mb-1">
              Hours to Book
            </label>
            <input
              id={`max-hours-${spotId}`}
              type="number"
              min="1"
              value={maxHours}
              onChange={(e) => setMaxHours(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm focus:border-green-500 focus:ring-green-500 p-3"
              required
              disabled={isPending || isConfirming}
            />
          </div>
          <button
            type="submit"
            disabled={isPending || isConfirming || !connectedAddress}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors duration-300"
          >
            {isPending ? 'Awaiting Signature...' : isConfirming ? 'Booking...' : `Book (${totalCost} ETH)`}
          </button>
          
          <div className="h-6 mt-2 text-center">
            {isConfirming && <p className="text-yellow-400 text-sm">Processing transaction...</p>}
            {isConfirmed && <p className="text-green-400 text-sm">✅ Booked successfully!</p>}
          </div>
        </form>
      )}

      {isOwner && (
        <div className="mt-6 text-center text-gray-400 font-medium p-3 bg-gray-900/70 border border-gray-700 rounded-md">
          You are the owner of this spot.
        </div>
      )}
    </div>
  );
}