// web/src/app/page.tsx
'use client';
import { useReadContract, useReadContracts } from 'wagmi';
import ParkingContractInfo from '@/lib/ParkingMarketplace.json';
import { SpotCard } from '@/components/SpotCard';

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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Available Parking Spots</h2>
      {isLoading && <p>Loading spots...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots?.map((spot, index) =>
          // We only render active spots
          spot.status === 'success' && spot.result[2] === true ? (
            <SpotCard key={index} spotId={index} spotData={spot.result} />
          ) : null
        )}
      </div>
      {!isLoading && spots?.length === 0 && <p>No active spots available.</p>}
    </div>
  );
}