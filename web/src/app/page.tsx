'use client';
import { useState } from 'react';
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ParkingMarketplaceABI } from '@/lib/ParkingMarketplaceABI';
import Image from 'next/image';
import { formatEther } from 'viem';

// Define the contract address from environment variables
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// Define a TypeScript type for the data structure returned by the 'spots' function
type SpotData = readonly [
  string,   // owner (address)
  bigint,   // ratePerHourWei (uint256)
  boolean,  // active (bool)
  string    // qrSecretHash (bytes32)
];

// --- SpotCard Component ---
function SpotCard({ spotId, spotData }: { spotId: number, spotData: SpotData }) {
  const [maxHours, setMaxHours] = useState('1');
  const { address: connectedAddress } = useAccount();

  const owner = spotData[0];
  const ratePerHourWei = spotData[1];
  const ratePerHourEth = formatEther(ratePerHourWei);

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleBookSpot = (e: React.FormEvent) => {
    e.preventDefault();
    const hoursToBook = parseInt(maxHours, 10);
    if (isNaN(hoursToBook) || hoursToBook <= 0 || hoursToBook > 72) {
      // Replaced alert with a more modern notification approach if possible, but alert is fine for now.
      console.error('Please enter a valid number of hours (1-72).');
      return;
    }

    const depositWei = ratePerHourWei * BigInt(hoursToBook);

    writeContract({
      address: contractAddress,
      abi: ParkingMarketplaceABI,
      functionName: 'bookSpot',
      args: [BigInt(spotId), hoursToBook],
      value: depositWei,
    });
  };
  
  const isOwner = connectedAddress && connectedAddress.toLowerCase() === owner.toLowerCase();

  return (
    <div className="border border-gray-700 rounded-lg p-6 bg-gray-800 flex flex-col justify-between shadow-lg transition-transform hover:scale-105">
      <div>
        <h3 className="text-xl font-bold text-white">Spot #{spotId}</h3>
        <p className="text-sm text-gray-400 truncate mt-1" title={owner}>Owner: {owner}</p>
        <p className="text-lg font-semibold mt-2 text-cyan-400">{ratePerHourEth} ETH / hour</p>
      </div>
      
      {!isOwner ? (
        <form onSubmit={handleBookSpot} className="mt-4">
          <label htmlFor={`max-hours-${spotId}`} className="block text-sm font-medium text-gray-300">
            Hours to book
          </label>
          <input
            id={`max-hours-${spotId}`}
            type="number"
            min="1"
            max="72"
            value={maxHours}
            onChange={(e) => setMaxHours(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
            required
          />
          <button
            type="submit"
            disabled={isPending || !connectedAddress}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {isPending ? 'Confirming...' : `Book for ${formatEther(ratePerHourWei * BigInt(maxHours || '0'))} ETH`}
          </button>
          {isConfirming && <p className="text-yellow-400 text-center mt-2 text-sm animate-pulse">Booking...</p>}
          {isConfirmed && <p className="text-green-400 text-center mt-2 text-sm">Booked successfully!</p>}
        </form>
      ) : (
         <p className="mt-4 text-center text-gray-500 font-bold p-2 bg-gray-700 rounded-md">You are the owner of this spot.</p>
      )}
    </div>
  );
}


// --- Home Page Component ---
export default function Home() {
  const { isConnected } = useAccount();

  // Fetch the total number of spots
  const { data: spotsCount } = useReadContract({
    address: contractAddress,
    abi: ParkingMarketplaceABI,
    functionName: 'spotsCount',
  });

  // Prepare the contract calls to fetch data for each spot
  const spotsContracts = Array.from({ length: Number(spotsCount || 0) }, (_, i) => ({
    address: contractAddress,
    abi: ParkingMarketplaceABI,
    functionName: 'spots',
    args: [BigInt(i)],
  }));

  // Fetch the data for all spots
  const { data: spots, isLoading } = useReadContracts({
    contracts: spotsContracts,
  });

  // --- FIX APPLIED HERE ---
  // Create a new, safe array that includes the spot's ID (its original index).
  // This avoids the 'possibly undefined' error and is more reliable.
  const activeSpotsWithIds = spots
    ?.map((spot, index) => ({ ...spot, id: index })) // Add the original index as an 'id'
    .filter(
      (spot) =>
        spot.status === 'success' &&
        ((spot.result as unknown) as SpotData)[2] === true // Filter for active spots
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="fixed inset-0 z-[-1]">
        <Image
          src="/background.png"
          alt="Abstract background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-10"
        />
      </div>
      
      {/* Hero Section */}
      <div className="relative rounded-lg overflow-hidden mb-12 p-8 min-h-[300px] flex flex-col justify-center items-center text-center bg-gray-900/50 border border-gray-700 backdrop-blur-sm">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-400 drop-shadow-lg">On-Chain Parking Marketplace</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto drop-shadow-md">
            Find and book available parking spots directly on the blockchain. Your deposit is secured by a smart contract.
          </p>
          {!isConnected && (
            <p className="mt-6 text-yellow-400 font-semibold animate-pulse">Connect your wallet to get started!</p>
          )}
        </div>
      </div>

      {/* Available Spots Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2 text-white">Available Parking Spots</h2>
        {isLoading && <p className="text-center text-gray-400">Loading spots...</p>}
        
        {/* --- FIX APPLIED HERE --- */}
        {/* Map over the new, safe array. We now use `spot.id` directly. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeSpotsWithIds?.map((spot) => (
            <SpotCard
              key={spot.id}
              spotId={spot.id}
              spotData={(spot.result as unknown) as SpotData}
            />
          ))}
        </div>

        {!isLoading && (!activeSpotsWithIds || activeSpotsWithIds.length === 0) && (
          <div className="text-center py-16 px-6 rounded-lg bg-gray-800/70 border border-gray-700 mt-8">
            <p className="text-xl text-gray-400">No active spots available right now.</p>
            <p className="text-gray-500 mt-2">Check back later or become a host to list your own spot!</p>
          </div>
        )}
      </div>
    </div>
  );
}
