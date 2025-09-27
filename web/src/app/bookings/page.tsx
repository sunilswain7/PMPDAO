// web/src/app/bookings/page.tsx
'use client';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import ParkingContractInfo from '@/lib/ParkingMarketplace.json';
import { BookingCard } from '@/components/BookingCard';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function BookingsPage() {
  const { address } = useAccount();

  // 1. Get the total number of bookings
  const { data: bookingsCount } = useReadContract({
    address: contractAddress,
    abi: ParkingContractInfo.abi,
    functionName: 'bookingsCount',
  });

  // 2. Prepare the contract calls to fetch all bookings
  const bookingsContracts = Array.from({ length: Number(bookingsCount || 0) }, (_, i) => ({
    address: contractAddress,
    abi: ParkingContractInfo.abi,
    functionName: 'bookings',
    args: [BigInt(i)],
  }));

  // 3. Fetch all bookings data
  const { data: allBookings, isLoading } = useReadContracts({
    contracts: bookingsContracts,
  });

  // 4. Filter to find bookings for the connected user
  const myBookings = allBookings
    ?.map((booking, index) => ({ ...booking, id: index }))
    .filter(
      (booking) =>
        booking.status === 'success' &&
        booking.result[1]?.toLowerCase() === address?.toLowerCase()
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
      {isLoading && <p>Loading your bookings...</p>}
      <div className="space-y-4">
        {myBookings?.map((booking) => (
          <BookingCard
            key={booking.id}
            bookingId={booking.id}
            bookingData={booking.result as any}
          />
        ))}
      </div>
      {!isLoading && myBookings?.length === 0 && (
        <p>You have not booked any spots yet.</p>
      )}
    </div>
  );
}