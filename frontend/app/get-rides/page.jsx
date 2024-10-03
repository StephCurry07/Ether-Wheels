"use client";
import GetRidesCard from "@components/GetRidesCard";
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Autocomplete, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ethers } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import abi from "../../utils/CarPooling.json";
import styles from "../styles/get-rides.module.css";
import ToastService from "@utils/toastService";

const GetRides = () => {
  const [allRides, setAllRides] = useState([]);
  const [exchangeRate, setExchangeRate] = useState({});
  const [filteredRides, setFilteredRides] = useState([]);
  const [sourceFilter, setSourceFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const contractAddress = abi.contractAddress;
  const contractABI = abi.abi;
  const [currentPage, setCurrentPage] = useState(0);
  const searchParams = useSearchParams();
  const connectedAccount = searchParams.get("connectedAccount");
  const balance = searchParams.get("balance");
  const errorDecoder = ErrorDecoder.create([contractABI]);
  const containerRef = useRef(null);

  const getAllRides = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const CarPoolingContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const rides = await CarPoolingContract.getAllRides();
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

      setAllRides(rideConverted);
      setFilteredRides(rideConverted);

      const response = await fetch(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=4baa560324eaf1de14b1960925c15ee24180733839c0772f85a0f939d293c5f1"
      );

      const jsonData = await response.json();
      console.log(jsonData.USD);
      setExchangeRate(jsonData);
    }
  };

  useEffect(() => {
    getAllRides();
  }, []);

  const extractSourceAndDestination = (details) => {
    const keyValuePairs = details.split(" + ");
    let source = "";
    let destination = "";
    keyValuePairs.forEach((pair) => {
      const [key, value] = pair.split(": ");
      if (key === "Source") {
        source = value;
      } else if (key === "Destination") {
        destination = value;
      }
    });
    return { source, destination };
  };

  useEffect(() => {
    const currentDateTime = new Date(Date.now());
    const currentTimePlusfive = new Date(
      currentDateTime.getTime() + currentDateTime.getTimezoneOffset() * 60000 + 5 * 60000
    );

    const filtered = allRides.filter((ride) => {
      const { source, destination } = extractSourceAndDestination(
        ride.tDetails
      );

      const rideTime = new Date(Number(ride.time) * 1000);

      return (
        (!sourceFilter || source === sourceFilter) &&
        (!destinationFilter || destination === destinationFilter) &&
        (!timeFilter || rideTime >= new Date(timeFilter)) &&
        rideTime >= currentTimePlusfive
      );
    });
    setFilteredRides(filtered);
  }, [sourceFilter, destinationFilter, timeFilter, allRides]);


  const bookRide = async (rideId, rideFare) => {
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const CarPoolingContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      console.log(rideId);
      const value = rideFare.toString();
      const txn = await CarPoolingContract.bookRide(rideId, { value });
      await txn.wait();
      console.log(txn.toString());

      if (txn) {
        ToastService.success("Congratulations! Your ride is booked");
        window.location.href = `/my-rides?connectedAccount=${connectedAccount}&balance=${balance}&role=passenger`;
      }
        } catch (error) {
      const decodedError = await errorDecoder.decode(error);
      ToastService.error(decodedError.args[0]);
    }
  };
  const handlePrev = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };
  
  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredRides.length / 3) - 1));
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.filterContainer}>
        <div>
          {/* <label htmlFor="sourceFilter"><strong>From: </strong></label> */}
          <Autocomplete
            id="sourceFilter"
            value={sourceFilter}
            onChange={(event, newValue) => setSourceFilter(newValue)}
            options={filteredRides.map((ride) => {
              const { source } = extractSourceAndDestination(ride.tDetails);
              return source;
            })}
            renderInput={(params) => <TextField {...params} label="Select Source" variant="outlined" />}
            sx={{ width: 400}}
          />
          {/* <select
            id="sourceFilter"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">Select Source</option>
            {allRides.map((ride) => {
              const { source } = extractSourceAndDestination(ride.tDetails);
              return (
                <option key={source} value={source}>
                  {source}
                </option>
              );
            })}
          </select> */}
        </div>
        <div>
          {/* <label htmlFor="destinationFilter"><strong>To: </strong></label> */}
          <Autocomplete
            id="destinationFilter"
            value={destinationFilter}
            onChange={(event, newValue) => setDestinationFilter(newValue)}
            options={filteredRides.map((ride) => {
              const { destination } = extractSourceAndDestination(ride.tDetails);
              return destination;
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Destination"
                variant="outlined"
                sx={{ width: 400 }}
              />
            )}
          />

          {/* <select
            id="destinationFilter"
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
          >
            <option value="">Select Destination</option>
            {allRides.map((ride) => {
              const { destination } = extractSourceAndDestination(
                ride.tDetails
              );
              return (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              );
            })}
          </select> */}
        </div>
        <div>
          {/* <label htmlFor="timeFilter"><strong>Time: </strong></label> */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              id="timeFilter"
              value={timeFilter}
              minDate={new Date()}
              onChange={(newValue) => setTimeFilter(newValue)}
              TextField={(params) => <TextField {...params} />}
            />
            </LocalizationProvider>
            {/* <input
            id="timeFilter"
            type="datetime-local"
            value={timeFilter}
            min={new Date().toISOString().split("T")[0] + "T00:00"}
            onChange={(e) => setTimeFilter(e.target.value)}
          /> */}
        </div>
      </div>
      <div className={styles.cardContainer}>
        {filteredRides.slice(currentPage * 3, (currentPage + 1) * 3).map((ride) => (
          <GetRidesCard key={ride.rideId} ride={ride} bookRide={bookRide} exchangeRate={exchangeRate} />
        ))}
      </div>
      <div className={styles.navigation}>
        <button className={styles.navButton} onClick={handlePrev} disabled={currentPage === 0}>
        <ChevronLeft />
        </button>
        <button className={styles.navButton} onClick={handleNext} disabled={(currentPage + 1) * 3 >= filteredRides.length}>
        <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default GetRides;