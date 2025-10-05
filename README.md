# 🚗 ParkBNB – Decentralized Parking Marketplace  

![Solidity](https://img.shields.io/badge/Solidity-^0.8.24-blue?logo=solidity)  
![Next.js](https://img.shields.io/badge/Next.js-13+-black?logo=next.js)  
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)  
![Foundry](https://img.shields.io/badge/Foundry-Toolkit-orange)  
![License: MIT](https://img.shields.io/badge/License-MIT-green)  

A **peer-to-peer parking marketplace** powered by blockchain where **smart contracts** handle all payments and bookings, ensuring **fairness, transparency, and automation**.  

---

## 📜 Description  

Urban parking is inefficient, costly, and opaque. **ParkBNB** solves this by creating a **decentralized, trustless marketplace** for individuals to rent out their private parking spots to drivers.  

By leveraging **EVM-compatible smart contracts**, ParkBNB eliminates intermediaries, automates escrow payments, and ensures all transactions are recorded transparently on-chain.  

The platform uses a **pay-per-use model**:  
- Renters deposit funds upfront into a **smart contract escrow**.  
- QR codes handle **check-in and check-out**.  
- Upon leaving, the contract calculates the exact cost, pays the host, and refunds the remaining balance instantly.  

---

## ✨ Core Features  

- **Peer-to-Peer Listings** – Anyone with a parking spot can become a host.  
- **Secure Escrow** – Deposits are locked in the smart contract, not with the host.  
- **QR Code Check-In/Out** – Start and stop parking seamlessly.  
- **Automated On-Chain Settlement** – Payments & refunds are instant and tamper-proof.  
- **Transparent & Trustless** – Every booking and payment is visible on-chain.  

---

## 🛠️ Tech Stack  

### 📝 Smart Contract (Backend)  
- **Solidity `^0.8.24`** – Written with modern best practices.  
- **Foundry** – Compilation, testing, and deployment.  
- **OpenZeppelin** – Security via `ReentrancyGuard` and `Ownable`.  

### 💻 Frontend (User Interface)  
- **Next.js (App Router)** – Fast, modern React framework.  
- **TypeScript** – Strict typing for blockchain data safety.  
- **wagmi + viem** – Blockchain interaction layer.  
- **RainbowKit** – Multi-wallet connection UI.  
- **Tailwind CSS** – Modern, responsive UI styling.  

---

## 🚀 Getting Started  

### ✅ Prerequisites  
- [Node.js](https://nodejs.org/) v18+  
- [Foundry](https://book.getfoundry.sh/getting-started/installation)  
- A browser wallet (e.g., MetaMask)  

---

### 1. Clone the Repository  
```bash
git clone [YOUR_GITHUB_REPO_URL]
cd [YOUR_PROJECT_DIRECTORY]


cd contracts
forge install

SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY"
PRIVATE_KEY="0xYOUR_WALLET_PRIVATE_KEY"
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="YOUR_WALLETCONNECT_PROJECT_ID"
NEXT_PUBLIC_CONTRACT_ADDRESS=""

cd contracts
source .env

forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  -vvvv

cd web
npm install
npm run dev

---
