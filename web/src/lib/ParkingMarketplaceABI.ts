export const ParkingMarketplaceABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "initialOwner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_feeBps",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_feeRecipient",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "acceptOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "bookSpot",
    "inputs": [
      {
        "name": "spotId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxHours",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [
      {
        "name": "bookingId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "bookings",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "spotId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "renter",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "depositWei",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "ratePerHourWei",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxHours",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "checkedInAt",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "checkedOutAt",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "status",
        "type": "uint8",
        "internalType": "enum ParkingMarketplace.BookingStatus"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "bookingsCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "cancelBeforeCheckIn",
    "inputs": [
      {
        "name": "bookingId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "checkIn",
    "inputs": [
      {
        "name": "bookingId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "secret",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "checkOut",
    "inputs": [
      {
        "name": "bookingId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "secret",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createSpot",
    "inputs": [
      {
        "name": "ratePerHourWei",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "qrSecretHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "spotId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "feeBps",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "feeRecipient",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pendingOwner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "spots",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "ratePerHourWei",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "active",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "qrSecretHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "spotsCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateSpot",
    "inputs": [
      {
        "name": "spotId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "ratePerHourWei",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "active",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "qrSecretHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "BookingCreated",
    "inputs": [
      {
        "name": "bookingId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "spotId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "renter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "depositWei",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "maxHours",
        "type": "uint32",
        "indexed": false,
        "internalType": "uint32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CheckedIn",
    "inputs": [
      {
        "name": "bookingId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CheckedOut",
    "inputs": [
      {
        "name": "bookingId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "costWei",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "hostPaidWei",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "refundWei",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferStarted",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SpotCreated",
    "inputs": [
      {
        "name": "spotId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "ratePerHourWei",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SpotUpdated",
    "inputs": [
      {
        "name": "spotId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "ratePerHourWei",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "active",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
  }
] as const;

