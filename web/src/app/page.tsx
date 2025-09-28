// web/src/app/page.tsx
'use client';
import { useReadContract, useReadContracts } from 'wagmi';
import ParkingContractInfo from '@/lib/ParkingMarketplace.json';
import { SpotCard } from '@/components/SpotCard';
import Image from 'next/image'; // Import Image component

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function Home() {
  // 1. First, get the total number of spots
  const { data: spotsCount } = useReadContract({
    address: contractAddress,
    abi: ParkingContractInfo.abi,
    functionName: 'spotsCount',
  });

  // 2. Then, create an array of contract calls to fetch each spot
  const spotsContracts = Array.from({ length: Number(spotsCount || 0) }, (_, i) => ({
    address: contractAddress,
    abi: ParkingContractInfo.abi,
    functionName: 'spots',
    args: [BigInt(i)],
  }));

  // 3. Fetch all spots' data in a single batch
  const { data: spots, isLoading } = useReadContracts({
    contracts: spotsContracts,
  });

  const activeSpots = spots?.filter(
    (spot) => spot.status === 'success' && spot.result[2] === true
  );

  return (
    <div className="relative min-h-screen">
      <Image
        src="/background.png"
        alt="Tactical green grid background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0 opacity-20" // Reduced opacity to keep content readable
      />
      <main className="container mx-auto p-4 md:p-8 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Decentralized Parking Marketplace
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Find and book available parking spots securely on the blockchain.
          </p>
        </div>

        {/* Spots Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-green-400 border-b border-gray-700 pb-2">
            Available Now
          </h2>

          {isLoading && (
            <div className="text-center text-gray-400">
              <p>Scanning the network for spots...</p>
            </div>
          )}

          {!isLoading && (!activeSpots || activeSpots.length === 0) && (
            <div className="text-center bg-gray-800 p-8 rounded-lg border border-gray-700">
              <p className="text-gray-300 font-medium">No active spots available right now.</p>
              <p className="text-gray-500 text-sm mt-2">Please check back later or consider hosting your own spot!</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeSpots?.map((spot, index) => (
                <SpotCard key={index} spotId={Number(spotsCount) - 1 - index} spotData={spot.result} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}