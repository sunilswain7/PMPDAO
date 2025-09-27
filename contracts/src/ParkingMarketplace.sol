// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Ownable2Step} from "lib/openzeppelin-contracts/contracts/access/Ownable2Step.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract ParkingMarketplace is ReentrancyGuard, Ownable2Step {
    struct Spot {
        address owner;
        uint256 ratePerHourWei;
        bool active;
        bytes32 qrSecretHash; // keccak256(secret)
    }

    enum BookingStatus { Reserved, CheckedIn, Completed, Cancelled }

    struct Booking {
        uint256 spotId;
        address renter;
        uint256 depositWei;
        uint256 ratePerHourWei;
        uint32 maxHours;
        uint64 checkedInAt;
        uint64 checkedOutAt;
        BookingStatus status;
    }

    uint256 public feeBps; // e.g., 250 = 2.5%
    address public feeRecipient;

    Spot[] public spots;
    Booking[] public bookings;

    event SpotCreated(uint256 indexed spotId, address indexed owner, uint256 ratePerHourWei);
    event SpotUpdated(uint256 indexed spotId, uint256 ratePerHourWei, bool active);
    event BookingCreated(uint256 indexed bookingId, uint256 indexed spotId, address indexed renter, uint256 depositWei, uint32 maxHours);
    event CheckedIn(uint256 indexed bookingId, uint64 timestamp);
    event CheckedOut(uint256 indexed bookingId, uint64 timestamp, uint256 costWei, uint256 hostPaidWei, uint256 refundWei);

    constructor(address initialOwner, uint256 _feeBps, address _feeRecipient) Ownable(initialOwner) {
        require(_feeRecipient != address(0), "fee recipient is zero address");
        feeBps = _feeBps;
        feeRecipient = _feeRecipient;
        
    }

    function createSpot(uint256 ratePerHourWei, bytes32 qrSecretHash) external returns (uint256 spotId) {
        require(ratePerHourWei > 0, "rate=0");
        spots.push(Spot({
            owner: msg.sender,
            ratePerHourWei: ratePerHourWei,
            active: true,
            qrSecretHash: qrSecretHash
        }));
        spotId = spots.length - 1;
        emit SpotCreated(spotId, msg.sender, ratePerHourWei);
    }

    function updateSpot(uint256 spotId, uint256 ratePerHourWei, bool active, bytes32 qrSecretHash) external {
        Spot storage s = spots[spotId];
        require(msg.sender == s.owner, "not owner");
        if (ratePerHourWei > 0) s.ratePerHourWei = ratePerHourWei;
        s.active = active;
        if (qrSecretHash != bytes32(0)) s.qrSecretHash = qrSecretHash;
        emit SpotUpdated(spotId, s.ratePerHourWei, s.active);
    }

    function bookSpot(uint256 spotId, uint32 maxHours) external payable nonReentrant returns (uint256 bookingId) {
        Spot memory s = spots[spotId];
        require(s.active, "inactive");
        require(maxHours > 0 && maxHours <= 72, "maxHours invalid");
        uint256 requiredDeposit = s.ratePerHourWei * uint256(maxHours);
        require(msg.value == requiredDeposit, "bad deposit");

        bookings.push(Booking({
            spotId: spotId,
            renter: msg.sender,
            depositWei: msg.value,
            ratePerHourWei: s.ratePerHourWei,
            maxHours: maxHours,
            checkedInAt: 0,
            checkedOutAt: 0,
            status: BookingStatus.Reserved
        }));
        bookingId = bookings.length - 1;
        emit BookingCreated(bookingId, spotId, msg.sender, msg.value, maxHours);
    }

    function checkIn(uint256 bookingId, string calldata secret) external {
        Booking storage b = bookings[bookingId];
        Spot storage s = spots[b.spotId];
        require(msg.sender == b.renter, "not renter");
        require(b.status == BookingStatus.Reserved, "bad status");
        require(s.active, "inactive");
        require(keccak256(abi.encodePacked(secret)) == s.qrSecretHash, "bad secret");

        b.checkedInAt = uint64(block.timestamp);
        b.status = BookingStatus.CheckedIn;
        emit CheckedIn(bookingId, b.checkedInAt);
    }

    function checkOut(uint256 bookingId, string calldata secret) external nonReentrant {
        Booking storage b = bookings[bookingId];
        Spot storage s = spots[b.spotId];
        require(msg.sender == b.renter, "not renter");
        require(b.status == BookingStatus.CheckedIn, "bad status");
        require(keccak256(abi.encodePacked(secret)) == s.qrSecretHash, "bad secret");

        b.checkedOutAt = uint64(block.timestamp);
        b.status = BookingStatus.Completed;

        uint256 elapsed = uint256(b.checkedOutAt - b.checkedInAt); // seconds
        uint256 cost = (elapsed * b.ratePerHourWei) / 3600;
        if (cost > b.depositWei) cost = b.depositWei;

        uint256 fee = (cost * feeBps) / 10_000;
        uint256 hostPay = cost - fee;
        uint256 refund = b.depositWei - cost;

        if (hostPay > 0) payable(s.owner).transfer(hostPay);
        if (fee > 0) payable(feeRecipient).transfer(fee);
        if (refund > 0) payable(b.renter).transfer(refund);

        emit CheckedOut(bookingId, b.checkedOutAt, cost, hostPay, refund);
    }

    function cancelBeforeCheckIn(uint256 bookingId) external nonReentrant {
        Booking storage b = bookings[bookingId];
        require(msg.sender == b.renter, "not renter");
        require(b.status == BookingStatus.Reserved, "bad status");
        b.status = BookingStatus.Cancelled;
        payable(b.renter).transfer(b.depositWei);
    }

    // Views
    function spotsCount() external view returns (uint256) { return spots.length; }
    function bookingsCount() external view returns (uint256) { return bookings.length; }
}