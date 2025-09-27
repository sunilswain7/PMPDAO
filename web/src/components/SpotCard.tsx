// web/src/components/SpotCard.tsx
'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
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
      value: depositWei, // This is how you send ETH with the transaction
    });
  };
  
  // Don't show the booking button if the connected user is the owner
  const isOwner = connectedAddress && connectedAddress.toLowerCase() === owner.toLowerCase();

  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold">Spot #{spotId}</h3>
        <p className="text-sm text-gray-400 truncate" title={owner}>Owner: {owner}</p>
        <p className="text-lg font-semibold mt-2">{ratePerHourEth} ETH / hour</p>
      </div>
      
      {!isOwner && (
        <form onSubmit={handleBookSpot} className="mt-4">
          <label htmlFor={`max-hours-${spotId}`} className="block text-sm font-medium text-gray-300">
            Hours to book
          </label>
          <input
            id={`max-hours-${spotId}`}
            type="number"
            min="1"
            value={maxHours}
            onChange={(e) => setMaxHours(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm p-2"
            required
          />
          <button
            type="submit"
            disabled={isPending || !connectedAddress}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
          >
            {isPending ? 'Confirming...' : `Book for ${formatEther(ratePerHourWei * BigInt(maxHours || 0))} ETH`}
          </button>
          {isConfirming && <p className="text-yellow-400 text-center mt-2">Booking...</p>}
          {isConfirmed && <p className="text-green-400 text-center mt-2">Booked successfully!</p>}
        </form>
      )}

      {isOwner && (
         <p className="mt-4 text-center text-gray-500 font-bold p-2 bg-gray-700 rounded-md">You are the owner of this spot.</p>
      )}
    </div>
  );
}