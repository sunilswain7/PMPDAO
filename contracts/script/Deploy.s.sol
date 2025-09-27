// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ParkingMarketplace} from "../src/ParkChain.sol";

contract DeployScript is Script {
    function run() external returns (address) {
        // Load private key from .env file
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Get the deployer's address
        address deployerAddress = vm.addr(deployerPrivateKey);

        // Deployment parameters
        uint256 feeBps = 250; // 2.5%
        address feeRecipient = deployerAddress; // Send fees to yourself for the demo

        vm.startBroadcast(deployerPrivateKey);

        ParkingMarketplace marketplace = new ParkingMarketplace(deployerAddress, feeBps, feeRecipient);

        vm.stopBroadcast();

        console.log("ParkingMarketplace deployed to:", address(marketplace));
        return address(marketplace);
    }
}