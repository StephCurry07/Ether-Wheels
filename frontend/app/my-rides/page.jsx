"use client";
import MyRidesCard from "@components/MyRidesCard";
import { ethers } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import abi from "../../utils/CarPooling.json";
import ToastService from "@utils/toastService";

const MyRides = () => {
  const [myRides, setMyRides] = useState([]);
  const [exchangeRate, setExchangeRate] = useState({});
  const searchParams = useSearchParams();
  const connectedAccount = searchParams.get("connectedAccount");
  const role = searchParams.get("role");

  const contractAddress = abi.contractAddress;
  const contractABI = abi.abi;
  const errorDecoder = ErrorDecoder.create([contractABI]);
  const getMyRides = async () => {
    if (window.ethereum && connectedAccount) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const CarPoolingContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const rides = await CarPoolingContract.getUserRides();
      let rideConverted = [];
      for (var i = 0; i < rides[0].length; i++) {
        const ride = {
          driver: rides[0][i],
          passengers: rides[1][i],
          mPassengers: rides[2][i],
          rideFare: rides[3][i],
          rideId: rides[4][i],
          time: rides[5][i],
          tDetails: rides[6][i],
        };
        rideConverted.push(ride);
      }

      const currentDateTime = new Date(Date.now());
      const currentDateTimeUTC = new Date(
        currentDateTime.getTime() + currentDateTime.getTimezoneOffset() * 60000
      );

      const currentTimeSeconds = Math.floor(
        currentDateTimeUTC.getTime() / 1000
      );

      let rideFiltered = [];

      if (role === "driver") {
        rideFiltered = rideConverted.filter(
          (ride) =>
            connectedAccount === ride.driver.toLowerCase() &&
            (Number(ride.time) - currentTimeSeconds > 0 || ride.passengers > 0)
        );
      } else {
        rideFiltered = rideConverted.filter(
          (ride) => connectedAccount !== ride.driver.toLowerCase()
        );
      }

      setMyRides(rideFiltered);

      const response = await fetch(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=4baa560324eaf1de14b1960925c15ee24180733839c0772f85a0f939d293c5f1"
      );

      const jsonData = await response.json();
      console.log(jsonData.USD);
      setExchangeRate(jsonData);
    }
  };

  const cancelRide = async (rideId) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const CarPoolingContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    console.log(rideId);
    ToastService.info("Cancelling ride. Please wait for the transaction to complete.");
    const txn = await CarPoolingContract.cancelRide(rideId);
    console.log(txn.toString());
    ToastService.success("Ride cancelled successfully.");
  };

  const completed = async (rideId, startTime) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const CarPoolingContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    console.log(rideId, startTime);
    const currentDateTime = new Date(Date.now());
    const currentDateTimeUTC = new Date(
      currentDateTime.getTime() + currentDateTime.getTimezoneOffset() * 60000
    );

    const currentTimeSeconds = Math.floor(currentDateTimeUTC.getTime() / 1000);
    if (currentTimeSeconds - Number(startTime) < 0) {
      ToastService.error("You can only perform this action after the ride is started");
      return;
    }

    if (role === "driver") {
      try {
        const txn = await CarPoolingContract.rideCompleted(rideId);
        await txn.wait();
        console.log(txn);
        ToastService.success("Ride completed successfully.");
      } catch (err) {
        const decodedError = await errorDecoder.decode(err);
        ToastService.error(decodedError.args[0]);
      }
    } else {
      const txn = await CarPoolingContract.updateStatus(rideId);
      console.log(txn);
    }
  };

  useEffect(() => {
    getMyRides();
  }, [connectedAccount]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {role === "not chosen" || myRides.length == 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>No rides to show.</h1>
          <h3>
            If you have not chosen a role till now kindly please choose a role
            first.
          </h3>
        </div>
      ) : (
        myRides.map((ride) => (
          <MyRidesCard
            key={ride.rideId}
            ride={ride}
            cancelRide={cancelRide}
            completed={completed}
            role={role}
            exchangeRate={exchangeRate}
          />
        ))
      )}
    </div>
  );
};

export default MyRides;
