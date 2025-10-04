'use client';
import { useState } from 'react';
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import ParkingContractInfo from '@/lib/ParkingMarketplace.json';
import Link from 'next/link';
import Image from 'next/image';
import { formatEther, parseEther } from 'viem';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

type SpotData = readonly [string, bigint, boolean, string]; 

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
      alert('Please enter a valid number of hours (1-72).');
      return;
    }

    const depositWei = ratePerHourWei * BigInt(hoursToBook);

    writeContract({
      address: contractAddress,
      abi: ParkingContractInfo.abi,
      functionName: 'bookSpot',
      args: [BigInt(spotId), hoursToBook],
      value: depositWei,
    });
  };
  
  const isOwner = connectedAddress && connectedAddress.toLowerCase() === owner.toLowerCase();

  return (
    <div className="border border-gray-700 rounded-lg p-6 bg-gray-800 flex flex-col justify-between shadow-lg">
      <div>
        <h3 className="text-xl font-bold">Spot #{spotId}</h3>
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
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm p-2"
            required
          />
          <button
            type="submit"
            disabled={isPending || !connectedAddress}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {isPending ? 'Confirming...' : `Book for ${formatEther(ratePerHourWei * BigInt(maxHours || '0'))} ETH`}
          </button>
          {isConfirming && <p className="text-yellow-400 text-center mt-2 text-sm">Booking...</p>}
          {isConfirmed && <p className="text-green-400 text-center mt-2 text-sm">Booked successfully!</p>}
        </form>
      ) : (
         <p className="mt-4 text-center text-gray-500 font-bold p-2 bg-gray-700 rounded-md">You are the owner of this spot.</p>
      )}
    </div>
  );
}


export default function Home() {
  const { isConnected } = useAccount();

  const { data: spotsCount } = useReadContract({
    address: contractAddress,
    abi: ParkingContractInfo.abi,
    functionName: 'spotsCount',
  });

  const spotsContracts = Array.from({ length: Number(spotsCount || 0) }, (_, i) => ({
    address: contractAddress,
    abi: ParkingContractInfo.abi,
    functionName: 'spots',
    args: [BigInt(i)],
  }));

  const { data: spots, isLoading } = useReadContracts({
    contracts: spotsContracts,
  });

  const activeSpots = spots?.filter(spot => 
    spot.status === 'success' && 
    (spot.result as SpotData)[2] === true
  );

  return (
    <div className="max-w-7xl mx-auto">
      <Image
              src="/background.png"
              alt="Tactical green grid background"
              layout="fill"
              objectFit="cover"
              quality={100}
              className="z-0 opacity-20"
            />
      {/* ... Hero Section ... */}
      <div className="relative rounded-lg overflow-hidden mb-12 p-8 min-h-[300px] flex flex-col justify-center items-center text-center bg-gray-800 border border-gray-700">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-400 drop-shadow-lg">On-Chain Parking Marketplace</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto drop-shadow-md">
            Find and book available parking spots directly on the blockchain. Your deposit is secured by a smart contract.
          </p>
          {!isConnected && (
            <p className="mt-6 text-yellow-400">Connect your wallet to get started!</p>
          )}
        </div>
      </div>

      {/* --- Available Spots Section --- */}
      <div>
        <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">Available Parking Spots</h2>
        {isLoading && <p className="text-center text-gray-400">Loading spots...</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeSpots?.map((spot) => {
            const spotId = spots.indexOf(spot);
            return <SpotCard key={spotId} spotId={spotId} spotData={spot.result as SpotData} />;
          })}
        </div>

        {!isLoading && (!activeSpots || activeSpots.length === 0) && (
          <div className="text-center py-16 px-6 rounded-lg bg-gray-800 border border-gray-700">
            <p className="text-xl text-gray-400">No active spots available right now.</p>
            <p className="text-gray-500 mt-2">Check back later or become a host to list your own spot!</p>
          </div>
        )}
      </div>
    </div>
  );
}

