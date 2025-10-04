// web/src/app/bookings/page.tsx
'use client';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { ParkingMarketplaceABI }from '@/lib/ParkingMarketplaceABI';
import { BookingCard } from '@/components/BookingCard';
import Link from 'next/link';
import Image from 'next/image';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// FIX 1: Define a specific type for the booking data to avoid using 'any'.
type BookingDataTuple = readonly [
  bigint, // spotId
  string, // renter
  bigint, // depositWei
  bigint, // ratePerHourWei
  number, // maxHours
  bigint, // checkedInAt
  bigint, // checkedOutAt
  number  // status
];

export default function BookingsPage() {
  const { address } = useAccount();

  // Hooks to fetch contract data
  const { data: bookingsCount } = useReadContract({
    address: contractAddress,
    abi: ParkingMarketplaceABI,
    functionName: 'bookingsCount',
  });

  const bookingsContracts = Array.from({ length: Number(bookingsCount || 0) }, (_, i) => ({
    address: contractAddress,
    abi: ParkingMarketplaceABI,
    functionName: 'bookings',
    args: [BigInt(i)],
  }));
  
  const { data: allBookings, isLoading } = useReadContracts({
    contracts: bookingsContracts,
  });

  // Filter bookings for the connected user
  const myBookings = allBookings
    ?.map((booking, index) => ({ ...booking, id: index }))
    .filter(
      (booking) =>
        booking.status === 'success' &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((booking.result as unknown) as any[])[1]?.toLowerCase() === address?.toLowerCase()
    );

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
          <h1 className="text-3xl font-bold text-green-400">My Bookings</h1>
          <p className="mt-2 text-gray-400">An overview of your past and current parking sessions.</p>
        </div>

        {isLoading && (
          <div className="text-center text-gray-400">
            <p>Loading your booking history...</p>
          </div>
        )}

        <div className="space-y-6">
          {myBookings?.map((booking) => (
            <BookingCard
              key={booking.id}
              bookingId={booking.id}
              // FIX 1 (continued): Use the new type here instead of 'as any'.
              bookingData={(booking.result as unknown) as BookingDataTuple}
            />
          ))}
        </div>

        {!isLoading && (!myBookings || myBookings.length === 0) && (
          <div className="text-center bg-gray-800 p-8 rounded-lg border border-gray-700">
            <h3 className="text-xl font-medium text-white">No Bookings Found</h3>
            {/* FIX 2: Replace the apostrophe in "haven't" with '&apos;'. */}
            <p className="text-gray-400 mt-2 mb-4">It looks like you haven&apos;t booked any spots yet.</p>
            <Link href="/" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
              Find a Spot
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}