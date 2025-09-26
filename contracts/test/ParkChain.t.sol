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

    function testCreateSpot() public {
        uint256 ratePerHourWei = 0.001 ether;
        bytes32 qrSecretHash = keccak256(abi.encodePacked("mySecret"));
        
        uint256 spotId = parkingMarketplace.createSpot(ratePerHourWei, qrSecretHash);
        
        (address owner, uint256 rate, bool active, bytes32 hash) = parkingMarketplace.spots(spotId);
        
        assertEq(owner, address(this));
        assertEq(rate, ratePerHourWei);
        assertTrue(active);
        assertEq(hash, qrSecretHash);
    }

    function testUpdateSpot() public {
        uint256 ratePerHourWei = 0.001 ether;
        bytes32 qrSecretHash = keccak256(abi.encodePacked("mySecret"));
        
        uint256 spotId = parkingMarketplace.createSpot(ratePerHourWei, qrSecretHash);
        
        uint256 newRatePerHourWei = 0.002 ether;
        bool newActiveStatus = false;
        bytes32 newQrSecretHash = keccak256(abi.encodePacked("newSecret"));
        
        parkingMarketplace.updateSpot(spotId, newRatePerHourWei, newActiveStatus, newQrSecretHash);
        
        (address owner, uint256 rate, bool active, bytes32 hash) = parkingMarketplace.spots(spotId);
        
        assertEq(owner, address(this));
        assertEq(rate, newRatePerHourWei);
        assertEq(active, newActiveStatus);
        assertEq(hash, newQrSecretHash);
    }

    function test_RevertIf_RateIsZero() public {
        bytes32 qrSecretHash = keccak256(abi.encodePacked("mySecret"));

        // Expect the next call to revert with the specified reason string.
        vm.expectRevert("rate=0");

        // This call will revert, matching the expectation above.
        parkingMarketplace.createSpot(0, qrSecretHash);
    }

    function test_RevertIf_NotOwner() public {
        uint256 ratePerHourWei = 0.001 ether;
        bytes32 qrSecretHash = keccak256(abi.encodePacked("mySecret"));
        
        uint256 spotId = parkingMarketplace.createSpot(ratePerHourWei, qrSecretHash);
        
        // Change the msg.sender to a different address
        vm.prank(address(0x123));
        
        // Expect the next call to revert with the specified reason string.
        vm.expectRevert("not owner");
        
        // This call will revert, matching the expectation above.
        parkingMarketplace.updateSpot(spotId, 0, false, bytes32(0));
    }

    function test_RevertIf_BadDeposit() public {
        uint256 ratePerHourWei = 0.001 ether;
        bytes32 qrSecretHash = keccak256(abi.encodePacked("mySecret"));
        
        uint256 spotId = parkingMarketplace.createSpot(ratePerHourWei, qrSecretHash);
        
        uint32 maxHours = 5;
        uint256 requiredDeposit = ratePerHourWei * uint256(maxHours);
        
        // Expect the next call to revert with the specified reason string.
        vm.expectRevert("bad deposit");
        
        // This call will revert, matching the expectation above.
        parkingMarketplace.bookSpot{value: requiredDeposit - 0.0001 ether}(spotId, maxHours);
    }

    function test_RevertIf_InactiveSpot() public {
        uint256 ratePerHourWei = 0.001 ether;
        bytes32 qrSecretHash = keccak256(abi.encodePacked("mySecret"));
        
        uint256 spotId = parkingMarketplace.createSpot(ratePerHourWei, qrSecretHash);
        
        // Deactivate the spot
        parkingMarketplace.updateSpot(spotId, 0, false, bytes32(0));
        
        uint32 maxHours = 5;
        uint256 requiredDeposit = ratePerHourWei * uint256(maxHours);
        
        // Expect the next call to revert with the specified reason string.
        vm.expectRevert("inactive");
        
        // This call will revert, matching the expectation above.
        parkingMarketplace.bookSpot{value: requiredDeposit}(spotId, maxHours);
    }

    function test_RevertIf_InvalidMaxHours() public {
        uint256 ratePerHourWei = 0.001 ether;
        bytes32 qrSecretHash = keccak256(abi.encodePacked("mySecret"));
        
        uint256 spotId = parkingMarketplace.createSpot(ratePerHourWei, qrSecretHash);
        
        uint32 invalidMaxHours = 81; // Invalid as it's less than 1
        
        uint256 requiredDeposit = ratePerHourWei * uint256(5); // Just a placeholder for deposit
        
        // Expect the next call to revert with the specified reason string.
        vm.expectRevert("maxHours invalid");
        
        // This call will revert, matching the expectation above.
        parkingMarketplace.bookSpot{value: requiredDeposit}(spotId, invalidMaxHours);
    }

    function test_RevertIf_BadSecretOnCheckIn() public {
        uint256 ratePerHourWei = 0.001 ether;
        bytes32 qrSecretHash = keccak256(abi.encodePacked("mySecret"));
        
        uint256 spotId = parkingMarketplace.createSpot(ratePerHourWei, qrSecretHash);
        
        uint32 maxHours = 5;
        uint256 requiredDeposit = ratePerHourWei * uint256(maxHours);
        
        uint256 bookingId = parkingMarketplace.bookSpot{value: requiredDeposit}(spotId, maxHours);
        
        // Expect the next call to revert.
        vm.expectRevert("bad secret");
        
        // This call will revert.
        parkingMarketplace.checkIn(bookingId, "wrongSecret");
    }

    function test_RevertIf_NotRenterOnCheckIn() public {
        uint256 ratePerHourWei = 0.001 ether;
        bytes32 qrSecretHash = keccak256(abi.encodePacked("mySecret"));
        
        uint256 spotId = parkingMarketplace.createSpot(ratePerHourWei, qrSecretHash);
        
        uint32 maxHours = 5;
        uint256 requiredDeposit = ratePerHourWei * uint256(maxHours);
        
        uint256 bookingId = parkingMarketplace.bookSpot{value: requiredDeposit}(spotId, maxHours);
        
        // Change the msg.sender to a different address
        vm.prank(address(0x123));
        
        // Expect the next call to revert.
        vm.expectRevert("not renter");
        
        // This call will revert.
        parkingMarketplace.checkIn(bookingId, "mySecret");
    }

    function test_RevertIf_BadStatusOnCheckIn() public {
        uint256 ratePerHourWei = 0.001 ether;
        bytes32 qrSecretHash = keccak256(abi.encodePacked("mySecret"));
        
        uint256 spotId = parkingMarketplace.createSpot(ratePerHourWei, qrSecretHash);
        
        uint32 maxHours = 5;
        uint256 requiredDeposit = ratePerHourWei * uint256(maxHours);
        
        uint256 bookingId = parkingMarketplace.bookSpot{value: requiredDeposit}(spotId, maxHours);
        
        // First, check in successfully
        parkingMarketplace.checkIn(bookingId, "mySecret");
        
        // Expect the next call to revert.
        vm.expectRevert("bad status");
        
        // This call will revert.
        parkingMarketplace.checkIn(bookingId, "mySecret");
    }

    function test_RevertIf_InactiveSpotOnCheckIn() public {
        uint256 ratePerHourWei = 0.001 ether;
        bytes32 qrSecretHash = keccak256(abi.encodePacked("mySecret"));
        
        uint256 spotId = parkingMarketplace.createSpot(ratePerHourWei, qrSecretHash);
        
        uint32 maxHours = 5;
        uint256 requiredDeposit = ratePerHourWei * uint256(maxHours);
        
        uint256 bookingId = parkingMarketplace.bookSpot{value: requiredDeposit}(spotId, maxHours);
        
        // Deactivate the spot
        parkingMarketplace.updateSpot(spotId, 0, false, bytes32(0));
        
        // Expect the next call to revert.
        vm.expectRevert("inactive");
        
        // This call will revert.
        parkingMarketplace.checkIn(bookingId, "mySecret");
    }

    function test_RevertIf_NotRenterOnCheckOut() public {
        uint256 ratePerHourWei = 0.001 ether;
        bytes32 qrSecretHash = keccak256(abi.encodePacked("mySecret"));
        
        uint256 spotId = parkingMarketplace.createSpot(ratePerHourWei, qrSecretHash);
        
        uint32 maxHours = 5;
        uint256 requiredDeposit = ratePerHourWei * uint256(maxHours);
        
        uint256 bookingId = parkingMarketplace.bookSpot{value: requiredDeposit}(spotId, maxHours);
        
        // First, check in successfully
        parkingMarketplace.checkIn(bookingId, "mySecret");
        
        // Change the msg.sender to a different address
        vm.prank(address(0x123));
        
        // Expect the next call to revert.
        vm.expectRevert("not renter");
        
        // This call will revert.
        parkingMarketplace.checkOut(bookingId, "mySecret");
    }
}