// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ParkingMarketplace} from "../src/ParkChain.sol";

contract CounterScript is Script {
    ParkingMarketplace public parkingMarketplace;

    function setUp() public {}

    function run() public returns (ParkingMarketplace) {
        vm.startBroadcast();

        // --- Arguments for the constructor ---
        // 1. initialOwner: Required by the Ownable parent contract.
        //    We'll use the address deploying the script.
        address initialOwner = msg.sender;

        // 2. _feeBps: The platform's fee in basis points (e.g., 250 = 2.5%).
        uint256 feeBps = 250;

        // 3. _feeRecipient: The address that will receive the fees.
        //    For this example, we'll also use the deployer's address.
        address feeRecipient = msg.sender;

        // Deploy the contract with the required arguments.
        parkingMarketplace = new ParkingMarketplace(initialOwner, feeBps, feeRecipient);

        vm.stopBroadcast();
        return parkingMarketplace;
    }
}