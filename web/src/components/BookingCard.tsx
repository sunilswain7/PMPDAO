// web/src/components/BookingCard.tsx
'use client';
import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import ParkingContractInfo from '@/lib/ParkingMarketplace.json';
import { QRScanner } from './QRScanner';
import { formatEther } from 'viem';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

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

// --- Status Styling ---
const STATUS_INFO: { [key: number]: { text: string; className: string } } = {
  0: { text: 'Reserved', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  1: { text: 'Checked In', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  2: { text: 'Completed', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  3: { text: 'Cancelled', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export function BookingCard({ bookingId, bookingData }: BookingCardProps) {
  const [showScanner, setShowScanner] = useState(false);
  const status = bookingData[7];
  const statusInfo = STATUS_INFO[status] || { text: 'Unknown', className: 'bg-gray-500/20 text-gray-400' };

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
      alert('Failed to parse QR code. Please ensure you are scanning the correct code.');
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white">Booking #{bookingId}</h3>
          <p className="text-gray-400">For Spot #{bookingData[0].toString()}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusInfo.className}`}>
          {statusInfo.text}
        </span>
      </div>

      <div className="mt-4 border-t border-gray-700 pt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Rate</p>
          <p className="font-semibold">{formatEther(bookingData[3])} ETH/hr</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Max Deposit</p>
          <p className="font-semibold">{formatEther(bookingData[2])} ETH</p>
        </div>
      </div>

      {showScanner ? (
        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <QRScanner onScan={handleScan} />
          <button onClick={() => setShowScanner(false)} className="mt-4 w-full bg-gray-600 hover:bg-gray-700 p-2 rounded-md transition-colors">
            Cancel Scan
          </button>
        </div>
      ) : (
        <>
          {(status === 0 || status === 1) && ( // Show button if Reserved or Checked In
            <button
              onClick={() => setShowScanner(true)}
              disabled={isPending || isConfirming}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors duration-300"
            >
              {status === 0 ? 'Scan to Check-In' : 'Scan to Check-Out'}
            </button>
          )}
        </>
      )}
      
      <div className="h-6 mt-2 text-center">
        {isConfirming && <p className="text-yellow-400 text-sm">Processing transaction...</p>}
        {isConfirmed && <p className="text-green-400 text-sm">✅ Transaction successful!</p>}
      </div>
    </div>
  );
}