// web/src/components/BookingCard.tsx
'use client';
import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import ParkingContractInfo from '@/lib/ParkingMarketplace.json';
import { QRScanner } from './QRScanner';
import { formatEther } from 'viem';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// Booking data structure from the contract
type BookingData = readonly [
  bigint, // spotId
  string, // renter
  bigint, // depositWei
  bigint, // ratePerHourWei
  number, // maxHours
  bigint, // checkedInAt
  bigint, // checkedOutAt
  number  // status (0:Reserved, 1:CheckedIn, 2:Completed, 3:Cancelled)
];

type BookingCardProps = {
  bookingId: number;
  bookingData: BookingData;
};

const STATUS_MAP = ['Reserved', 'Checked In', 'Completed', 'Cancelled'];

export function BookingCard({ bookingId, bookingData }: BookingCardProps) {
  const [showScanner, setShowScanner] = useState(false);
  const status = bookingData[7];

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleScan = (qrResult: string) => {
    setShowScanner(false);
    try {
      const { secret } = JSON.parse(qrResult);
      if (!secret) throw new Error('Invalid QR code format');

      const functionName = status === 0 ? 'checkIn' : 'checkOut';

      writeContract({
        address: contractAddress,
        abi: ParkingContractInfo.abi,
        functionName: functionName,
        args: [BigInt(bookingId), secret],
      });
    } catch (err) {
      console.error(err);
      alert('Failed to read QR code.');
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
      <h3 className="text-xl font-bold">Booking #{bookingId} (Spot #{bookingData[0].toString()})</h3>
      <p>Status: <span className="font-semibold">{STATUS_MAP[status]}</span></p>
      <p>Deposit: {formatEther(bookingData[2])} ETH</p>

      {showScanner ? (
        <div className="mt-4">
          <QRScanner onScan={handleScan} />
          <button onClick={() => setShowScanner(false)} className="mt-2 w-full bg-gray-600 p-2 rounded">
            Cancel Scan
          </button>
        </div>
      ) : (
        <>
          {(status === 0 || status === 1) && ( // Show button if Reserved or Checked In
            <button
              onClick={() => setShowScanner(true)}
              disabled={isPending}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 text-white font-bold py-2 px-4 rounded"
            >
              {status === 0 ? 'Scan to Check-In' : 'Scan to Check-Out'}
            </button>
          )}
        </>
      )}
      {isConfirming && <p className="text-yellow-400 text-center mt-2">Processing transaction...</p>}
      {isConfirmed && <p className="text-green-400 text-center mt-2">Transaction successful!</p>}
    </div>
  );
}