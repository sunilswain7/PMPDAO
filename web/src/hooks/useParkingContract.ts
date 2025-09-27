// web/src/hooks/useParkingContract.ts
import { useReadContract } from 'wagmi';
import ParkingContractInfo from '@/lib/ParkingMarketplace.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const useParkingSpots = () => {
  // First, get the total number of spots
  const { data: spotsCount, isLoading: isCountLoading } = useReadContract({
    address: contractAddress,
    abi: ParkingContractInfo.abi,
    functionName: 'spotsCount',
  });

  // Then, create an array of contract calls to fetch each spot
  const spotContracts = Array.from({ length: Number(spotsCount || 0) }, (_, i) => ({
    address: contractAddress,
    abi: ParkingContractInfo.abi,
    functionName: 'spots',
    args: [i],
  }));

  // In a real app, you would use useReadContracts for multicall
  // For simplicity here, we'll assume you fetch them one by one or handle it in a component.
  // This hook just provides the count for now.
  return { spotsCount, isCountLoading };
};