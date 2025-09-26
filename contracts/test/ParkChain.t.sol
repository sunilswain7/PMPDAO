//SPDX License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ParkingMarketplace} from "../src/ParkChain.sol";

contract ParkTest is Test {
    ParkingMarketplace public parkingMarketplace;

    function setUp() public {
        // Deploy the ParkingMarketplace contract with example parameters
        address initialOwner = address(this);
        uint256 feeBps = 250; // 2.5%
        address feeRecipient = address(this);
        parkingMarketplace = new ParkingMarketplace(initialOwner, feeBps, feeRecipient);
    }

    
}