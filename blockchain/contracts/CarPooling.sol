// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

// Create ride
// book ride
// withdraw money for ride
// cancel ride :- driver(return all money back to passengers), passenger(return deducted amount back to passenger)
// get all ride :- either make an array to save keys in contract itself or use getALL for the first time to get all the keys then maintain them in the frontend
// get index function :- to remove repeated code for getting the index

// Tests
// create a ride
// get all rides, single ride and user rides
// book a ride
// mark completion status by passenger
// cancel by passenger and by driver
// withdraw money via driver

// Things that can be implemented in this contract
// 1. Fallback functions  --> not needed
// 2. Time based cancellation refund system 
// 3. Events -> added 
// 4. Writing tests (just in case if you feel like)

error ERROR_CarPooling(string message);

contract CarPooling {
    using PriceConverter for uint256;

    AggregatorV3Interface public s_priceFeed;

    constructor(address priceFeedAddress) {
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    event RideCreated(
        uint256 indexed rideId,
        address driver,
        uint256 maxPassengers,
        uint256 rideFare,
        uint256 time,
        string tripDetails
    );
    event RideBooked(uint256 indexed rideId, address[] passengers);
    event StatusUpdate(uint256 indexed rideId, uint256 completedStatus);

    struct Ride {
        address driver; // time // locations (source and destination)
        address[] passengers;
        uint256 maxPassengers;
        uint256 rideFare; // co ordinates des co ordinates save -- passenger ride filter
        uint256 rideId;
        uint256 time; // startTime
        string tripDetails; // source and des
    }

    mapping(uint256 => Ride) public rides;
    mapping(address => uint256[]) public addressToRides;
    mapping(uint256 => uint256) public completionStatus;

    uint256 public rideCount = 0;
    uint256[] public rideKeys; // delete when ride is cancelled

    function createRide(
        uint256 mp,
        uint256 rf,
        uint256 t,
        string memory td
    ) public {
        rideCount += 1;
        uint256 rid = rideCount;
        address[] memory p;
        rf = rf * 1e18;
        rf = rf.getPriceInEth(s_priceFeed);
        rides[rid] = Ride(msg.sender, p, mp, rf, rid, t, td);

        addressToRides[msg.sender].push(rid);
        completionStatus[rid] = 0;
        rideKeys.push(rid);

        emit RideCreated(rid, msg.sender, mp, rf, t, td);
    }

    function bookRide(uint256 rideId) public payable duplicate(rideId) {
        require(msg.value >= rides[rideId].rideFare, "Money sent not equal to ride Fare");
        rides[rideId].passengers.push(msg.sender);
        addressToRides[msg.sender].push(rideId);

        emit RideBooked(rideId, rides[rideId].passengers);
    }

    modifier duplicate(uint256 rideId) {
    Ride memory r = rides[rideId];
    require(msg.sender != r.driver, "Driver cannot book the ride");
    require(r.passengers.length < r.maxPassengers, "Maximum passengers reached");

    for (uint256 i = 0; i < r.passengers.length; i++) {
        require(msg.sender != r.passengers[i], "You have already booked the ride");
    }
    _;
}

    function updateStatus(uint256 rideId) public {
        // completion of ride by passengers
        address passenger = msg.sender;
        uint256[] memory pRides = addressToRides[passenger];
        (bool exists, uint256 index) = getIndex(pRides, rideId);

       require(exists, "Ride is not registered with passenger");


        completionStatus[rideId] += 1;

        // erase this ride from passengers list
        addressToRides[passenger][index] = pRides[pRides.length - 1];
        addressToRides[passenger].pop();

        emit StatusUpdate(rideId, completionStatus[rideId]);
    }

    function rideCompleted(uint256 rideId) public {
        // driver withdrawing money
        require(msg.sender == rides[rideId].driver, "Sender is not the driver");
        require(completionStatus[rideId] == rides[rideId].passengers.length, "Not all passengers have marked the ride as completed");


        uint256 count = rides[rideId].passengers.length;
        uint256 amount = count * rides[rideId].rideFare;

        (bool callSuccess, ) = payable(msg.sender).call{value: amount}("");
        require(callSuccess, "Call method failed");

        // erase ride from drivers list erase completion status for this ride id
        completionStatus[rideId] = 0;
        uint256[] memory driverRides = addressToRides[msg.sender];
        (bool exists, uint256 index) = getIndex(driverRides, rideId);

        require(exists, "Ride is not registered with driver");

        addressToRides[msg.sender][index] = driverRides[driverRides.length - 1];
        addressToRides[msg.sender].pop();

        // erase ride from rides mapping as ride is completed
        rides[rideId] = rides[0]; // rides[0] is never given anything so will put default values back in rideId

        // erase rideId from rideKeys
        uint256[] memory keys = rideKeys;
        (exists, index) = getIndex(keys, rideId);

        require(exists, "Key does not exist");

        rideKeys[index] = keys[keys.length - 1];
        rideKeys.pop();
    }

    function cancelRide(uint256 rideId) public {
        // two cases
        // 1. Either cancelled by the driver
        // 2. Or cancelled by one of the passegners

        Ride memory r = rides[rideId];
        if (msg.sender == r.driver) {
            // return full money back to all passengers
            address[] memory passengers = r.passengers;
            uint256 amount = r.rideFare;

            for (uint256 i = 0; i < passengers.length; i++) {
                address p = passengers[i];
                (bool callSuccess, ) = payable(p).call{value: amount}("");
                require(callSuccess, "Call method failed");
            }

            // remove ride from driver's list
            uint256[] memory driverRides = addressToRides[msg.sender];
            (bool exists, uint256 index) = getIndex(driverRides, rideId);

            require(exists, "Ride is not registered with the user");

            addressToRides[msg.sender][index] = driverRides[
                driverRides.length - 1
            ];
            addressToRides[msg.sender].pop();

            // remove ride from rides mapping as well as the ride is deleted
            rides[rideId] = rides[0];

            // remove the rideId from ride keys
            uint256[] memory keys = rideKeys;
            (exists, index) = getIndex(keys, rideId);

            require(exists, "Ride is not registered with the user");

            rideKeys[index] = keys[keys.length - 1];
            rideKeys.pop();

            // reset the completion status
            completionStatus[rideId] = 0;
        } else {
            // passenger cancels
            // erase address from rides passenger array
            uint256 index;
            address passenger = msg.sender;
            address[] memory passengers = r.passengers;
            for (uint256 i = 0; i < passengers.length; i++) {
                if (passengers[i] == passenger) {
                    index = i;
                    break;
                }
            }
            rides[rideId].passengers[index] = passengers[passengers.length - 1];
            rides[rideId].passengers.pop();

            // erases ride from passengers rides list
            bool exists;
            uint256[] memory userRides = addressToRides[passenger];
            (exists, index) = getIndex(userRides, rideId);
            require(exists, "Ride is not registered with user");

            addressToRides[msg.sender][index] = userRides[userRides.length - 1];
            addressToRides[msg.sender].pop();

            // return half of the money back to passenger  ( can make it time based in future)
            uint256 amount = r.rideFare;
            amount = amount / 2;

            (bool callSuccess1, ) = payable(passenger).call{value: amount}("");
            require(callSuccess1, "Call method failed");

            // compensate the driver with some money, half of ride fare as of now (fixed amount or maybe some time based amount for him as well)
            (bool callSuccess2, ) = payable(r.driver).call{value: amount}("");
            require(callSuccess2, "Call method failed");
        }
    }

    function getIndex(
        uint256[] memory array,
        uint256 val
    ) public pure returns (bool, uint256) {
        uint256 index = 0;
        bool exists = false;
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == val) {
                index = i;
                exists = true;
                break;
            }
        }

        return (exists, index);
    }

    function getRide(
        uint256 rideId
    )
        public
        view
        returns (
            address,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            string memory
        )
    {
        Ride memory r = rides[rideId];
        return (
            r.driver,
            r.passengers.length,
            r.maxPassengers,
            r.rideFare,
            r.rideId,
            r.time,
            r.tripDetails
        );
    }

    function getUserRides()
        public
        view
        returns (
            address[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            string[] memory
        )
    {
        uint256[] memory userRides = addressToRides[msg.sender];

        address[] memory drivers = new address[](userRides.length);
        uint256[] memory currentPassengers = new uint256[](userRides.length);
        uint256[] memory maxPassengers = new uint256[](userRides.length);
        uint256[] memory rideFare = new uint256[](userRides.length);
        uint256[] memory rideId = new uint256[](userRides.length);
        uint256[] memory time = new uint256[](userRides.length);
        string[] memory td = new string[](userRides.length);

        for (uint256 i = 0; i < userRides.length; i++) {
            Ride memory r = rides[userRides[i]]; // CHECK IF RIDE EXISTS FOR GIVEN ID OR NOT
            if (r.rideId != 0) {
                drivers[i] = r.driver;
                currentPassengers[i] = r.passengers.length;
                maxPassengers[i] = r.maxPassengers;
                rideFare[i] = r.rideFare;
                rideId[i] = r.rideId;
                time[i] = r.time;
                td[i] = r.tripDetails;
            }
        }

        return (
            drivers,
            currentPassengers,
            maxPassengers,
            rideFare,
            rideId,
            time,
            td
        ); // cd not sent coz stack too deep error find a fix
    }

    function getAllRides()
        public
        view
        returns (
            address[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            string[] memory
        )
    {
        uint256[] memory keys = rideKeys;

        address[] memory drivers = new address[](keys.length);
        uint256[] memory currentPassengers = new uint256[](keys.length);
        uint256[] memory maxPassengers = new uint256[](keys.length);
        uint256[] memory rideFare = new uint256[](keys.length);
        uint256[] memory rideId = new uint256[](keys.length);
        uint256[] memory time = new uint256[](keys.length);
        string[] memory td = new string[](keys.length);

        for (uint256 i = 0; i < keys.length; i++) {
            Ride memory r = rides[keys[i]]; // CHECK IF RIDE EXISTS FOR GIVEN ID OR NOT
            if (r.rideId != 0) {
                drivers[i] = r.driver;
                currentPassengers[i] = r.passengers.length;
                maxPassengers[i] = r.maxPassengers;
                rideFare[i] = r.rideFare;
                rideId[i] = r.rideId;
                time[i] = r.time;
                td[i] = r.tripDetails;
            }
        }

        return (
            drivers,
            currentPassengers,
            maxPassengers,
            rideFare,
            rideId,
            time,
            td
        );
    }
}
