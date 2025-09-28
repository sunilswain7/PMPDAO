ParkBNB - Decentralized Parking Marketplace
A decentralized, peer-to-peer parking marketplace where smart contracts handle all payments and bookings, ensuring fairness and transparency.

📜 Description
ParkBNB is a decentralized application (dApp) built to solve the inefficiencies of urban parking. It creates a transparent and secure marketplace for individuals to rent out their private parking spots to drivers. By leveraging smart contracts on an EVM-compatible blockchain, ParkBNB removes intermediaries, automates payments, and fosters a trustless ecosystem.

The platform operates on a "pay-per-use" model. A renter pays an upfront, refundable deposit to reserve a spot, which is held in escrow by the smart contract. The core of the experience is a seamless check-in and check-out process powered by QR codes. When a renter leaves, the smart contract automatically calculates the precise cost, pays the host their earnings, and refunds the remaining balance to the renter instantly.

✨ Core Features
Peer-to-Peer Listings: Anyone with a parking spot can become a host and list it on the marketplace.

Secure Escrow: Renter deposits are held securely in the smart contract, not by the host or a central company.

QR Code Check-In/Out: A simple and secure mechanism to start and stop the parking timer on the blockchain.

Automated On-Chain Settlement: The smart contract handles the final payment distribution with mathematical precision, eliminating disputes and ensuring instant payouts.

Transparent & Trustless: All transactions and bookings are recorded on the blockchain, visible to everyone.

🛠️ How It's Made - The Tech Stack
This project was built with a modern, robust, and type-safe stack to ensure both developer efficiency and application reliability.

Smart Contract (The Backend)
Solidity: The contract is written in Solidity ^0.8.24, using modern security practices.

Foundry: The entire contract development lifecycle—compiling, testing, and deploying—was managed with the Foundry toolkit.

OpenZeppelin Contracts: We inherited from OpenZeppelin's battle-tested ReentrancyGuard and Ownable contracts to ensure a high standard of security.

Frontend (The User Interface)
Next.js (App Router): A powerful React framework providing a fast and responsive user experience.

TypeScript: The entire frontend is written in TypeScript for strict type safety, which is crucial when handling blockchain data.

wagmi & viem: The core of our blockchain interaction layer. wagmi provides robust React hooks for a clean way to interact with the contract, while viem handles lower-level JSON-RPC communication.

RainbowKit: Integrated to provide a seamless, multi-wallet connection experience for users.

Tailwind CSS: Used for rapidly building a clean, modern, and responsive UI.

🚀 Getting Started
Follow these instructions to set up and run the project locally for development and testing.

Prerequisites
Node.js (v18 or later)

Foundry

A browser wallet extension like MetaMask

1. Clone the Repository
git clone [YOUR_GITHUB_REPO_URL]
cd [YOUR_PROJECT_DIRECTORY]

2. Set Up the Smart Contract
First, navigate to the contracts directory and install the dependencies.

cd contracts
forge install

3. Set Up Environment Variables
You'll need an .env file in both the contracts and web directories.

For contracts/.env:
Create the file and add your Sepolia RPC URL and the private key of your deployer wallet.

SEPOLIA_RPC_URL="[https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY](https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY)"
PRIVATE_KEY="0xYOUR_WALLET_PRIVATE_KEY"
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"

For web/.env.local:
Create the file and add your WalletConnect Project ID. The contract address will be added after you deploy.

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="YOUR_WALLETCONNECT_PROJECT_ID"
NEXT_PUBLIC_CONTRACT_ADDRESS=""

4. Deploy the Contract
Deploy the ParkingMarketplace contract to the Sepolia testnet.

cd contracts
source .env
forge script script/Deploy.s.sol:DeployScript --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify -vvvv

After a successful deployment, copy the new contract address and paste it into web/.env.local for the NEXT_PUBLIC_CONTRACT_ADDRESS variable.

5. Set Up and Run the Frontend
Navigate to the web directory, install dependencies, and start the development server.

cd web
npm install
npm run dev

Your application should now be running at http://localhost:3000.

🎬 Demo Video
Watch our 3-minute video presentation that walks through the entire user flow from a host and renter perspective.

[Link to Your Demo Video Here]

🔮 Future Improvements
Stablecoin Integration: Integrate a stablecoin like PYUSD for payments to avoid ETH price volatility.

Map Integration: Add an interactive map (e.g., OpenStreetMap with Leaflet) for hosts to pin their location and for renters to discover nearby spots.

Reputation System: Implement a rating and review system for hosts and renters to build trust.

Stake-for-Access Model: Evolve the project into a membership model where users stake tokens for tiered access, creating a more sustainable economic model.
