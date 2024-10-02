"use client";

import { Autocomplete, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../styles/user-registration.module.css";
import ToastService from "@utils/toastService";
import { ethers } from "ethers";
import abi from "../../utils/CarPoolingcamp.json";
import { ToastContainer } from "react-toastify";
// import 'dotenv/config';
const contractAddress = abi.contractAddress;
const contractABI = abi.abi;

const apiKey1 = process.env.NEXT_PUBLIC_RAPIDAPI_KEY1;
const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY2;
const apiKey2 = process.env.NEXT_PUBLIC_RAPIDAPI_KEY3;

const getStateid = (str) => {
  const lowerCaseStr = str.toLowerCase();
  const formattedStr = lowerCaseStr.replace(/\s+/g, '-');
  return formattedStr;
}

const createRide = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [secondsSinceEpoch, setSecondsSinceEpoch] = useState(null);
  const [tripDetails, setTripDetails] = useState("");
  const [acNonAc, setAcNonAc] = useState("AC");
  const [rideFare, setRideFare] = useState(0);
  const [formData, setFormData] = useState("");
  // const [value, setValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  // const [flag, setFlag] = useState(0);
  const [selectedDateTime, setselectedDateTime] = useState('');
  const [sourceInput, setSourceInput] = useState('');
  const [pickupInput, setPickupInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [sourceLocationOptions, setSourceLocationOptions] = useState([]);
  const [destinationLocationOptions, setDestinationLocationOptions] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [city, setCity] = useState(null);
  const [pupLocationOptions, setPupLocationOptions] = useState([]);
  const [state, setState] = useState(null);
  const [distance, setDistance] = useState(null);
  const [fuelPrice, setFuelPrice] = useState(0);
  const [FP, setFP] = useState(0);
  const [petrolPrice, setPetrolPrice] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const mileage = formData.mileage;
  const maxPassengers = formData.carCapacity;

  
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRate(data.rates.INR);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    fetchExchangeRate();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
      
    }
  }, []);

  useEffect(() => {                                                       //  API ADJUSTMENT NOT NEEDED
    const fetchCity = async () => {
      if (latitude && longitude) {
        try {
          const options = {
            method: 'GET',
            url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse',
            params: {
              lat: latitude,
              lon: longitude,
              'accept-language': 'en', // Customize language if needed
              polygon_threshold: '0.0',
            },
            headers: {
              'X-RapidAPI-Key': apiKey1,
              'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com',
            },
          };

          const response = await axios.request(options);
          console.log(response);
          const cityName = response.data.display_name;
          const stateName = response.data.address.state;
          console.log('City:', cityName);
          setCity(cityName);
          setState(stateName);
          setSourceInput(cityName);
        } catch (error) {
          console.error('Error fetching city:', error);
          // setError(error);
        }
      } else {
        console.log('Geolocation is not supported by this browser.');
      }
    };

    fetchCity();
  }, [latitude, longitude]);

  const calcDistance = async (source, destination) => {                   //10 per day
    try {
      const options = {
        method: 'GET',
        url: 'https://driving-distance-calculator-between-two-points.p.rapidapi.com/data',
        params: {
          origin: source,
          destination: destination
        },
        headers: {
          'X-RapidAPI-Key': apiKey2,
          'X-RapidAPI-Host': 'driving-distance-calculator-between-two-points.p.rapidapi.com'
        }
      };
      const response = await axios.request(options);
      const dist = response.data.distance_in_kilometers.toFixed(2);
      // console.log(response.data);
      setDistance(dist);
      return dist;
    } catch (error) {
      console.error(error);
    }
  };

  const calcDistance1 = async (sourceInput, destinationInput) => {        //100 per month
    try {
      const options = {
        method: 'POST',
        url: 'https://distanceto.p.rapidapi.com/distance/route',
        params: { car: 'true' },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': apiKey1,
          'X-RapidAPI-Host': 'distanceto.p.rapidapi.com'
          // J';_q$5}tR:yAG29"]nc@^
          // 'X-RapidAPI-Host': 'driving-distance-calculator-between-two-points.p.rapidapi.com'
        },
        data: {
          route: [
            {
              country: 'IND',
              name: sourceInput
            },
            {
              country: 'IND',
              name: destinationInput
            }
          ]
        }
      };
      const response = await axios.request(options);
      const dist = response.data.route.car.distance.toFixed(2);
      // console.log(dist);
      setDistance(dist);
      return dist;
    } catch (error) {
      console.error(error);
    }
  };

  // NEW PASSENGER COUNT HANDLER and EASY
  const handleChangeCarCap = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue < 1) {
      setErrorMessage('Value cannot be less than 1.');
      event.target.value = 1;
    } else if (newValue > maxPassengers) {
      setErrorMessage(`Value cannot be greater than car capacity.`);
      event.target.value = maxPassengers;
    } else {
      setErrorMessage(null);
    }
  };

  //  OLDER PASSENGER COUNT HANDLER

  // const handleChangePass = (e) => {
  //   const inputValue = parseInt(e.target.value);
  //   if (inputValue == 1) {
  //     setFlag(1);
  //   }
  //   if (
  //     (inputValue <= 1 && flag == 1) ||
  //     (inputValue >= formData.carCapacity && flag == 1)
  //   ) {
  //     setErrorMessage("Value must be between 1 and max capacity");
  //   } else {
  //     setErrorMessage("");
  //     setValue(inputValue);
  //   }
  //   setValue(parseInt(e.target.value));
  //   setFormData({ ...formData, [e.target.name]: inputValue });
  // };

  useEffect(() => {
    if (state !== null) {
      const State = getStateid(state);
      const fetchFuelPrice = async () => {
        const options = {
          method: 'GET',
          url: `https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1/fuel-prices/today/india/${State}`,
          headers: {
            'X-RapidAPI-Key': apiKey1,
            'X-RapidAPI-Host': 'daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com'
          }
        };

        try {
          const response = await axios.request(options);
          if (formData.fuel_type === 'Petrol') {
            setPetrolPrice(response.data.fuel.petrol.retailPrice);
            setFuelPrice(response.data.fuel.petrol.retailPrice);
          }
          else if (formData.fuel_type === 'Diesel') {
            setFuelPrice(response.data.fuel.diesel.retailPrice)
          }
          else if (formData.fuel_type === 'CNG') {
            setFuelPrice(response.data.fuel.cng.retailPrice)
          }
          console.log(response.data.fuel);
        } catch (error) {
          console.error(error);
        }

      };
      if (formData.fuel_type !== 'Electric') {
        fetchFuelPrice();
      }
      //CALC FARE FOR HYBRID DIRECTLY... NO OTHER METHOD SUITABLE AS FUEL PRICE NEEDS TO BE ADJUSTED (SEE LATER)
    }
  }, [state]);

  // Fare Calculation
  useEffect(() => {
    const calcFare = () => {
      if (mileage && exchangeRate) {
        const fuelPriceUSD = fuelPrice / exchangeRate;
        if (formData.fuel_type === 'Electric') {
          const fare = Math.max(3, distance * (9/exchangeRate));      //9 rs per km, min 3 dollars
          setRideFare(fare);
          setFP("₹9/km");
          console.log("Fare for Electric: ", fare);
        }
        else if (formData.fuel_type === 'Hybrid') {
          const fare = (0.7 * (distance / mileage) * fuelPriceUSD) + (0.3 * Math.max(3, distance * (9/exchangeRate)));  // 70% F + 30% E
          // const fare = Math.max(3, (0.7 * 1000 / mileage * fuelPriceUSD) + (0.3 * Math.max(3, distance * (9/exchangeRate))));
          setFP((0.7 * petrolPrice) + " + ₹9/km");
          console.log("Fare for Hybrid: ", fare);
          setRideFare(fare);
        }
        else{
          // console.log("Fuel Price: ", fuelPrice);
          // console.log("er: ", exchangeRate);
          // console.log("FuelpriceUSD: ", fuelPriceUSD);
          // console.log("Mileage: ", mileage);
          // console.log("Distance: ", distance);
          setFP(fuelPrice);
          const fare = (distance / mileage) * fuelPriceUSD;
          // const fare = Math.max(4, (1000 / mileage) * fuelPriceUSD);
          setRideFare(fare);
          console.log("Fare for fuel vehicles: ", fare);
        }
      }
    };
    calcFare();
  }, [distance, fuelPrice]);

  const handleChangeRad = (e) => {
    setAcNonAc(e.target.value);
  };

  useEffect(() => {
    if (!formData) {
      const params = new URLSearchParams(window.location.search);
      const formDataParam = params.get("formData");
      if (formDataParam) {
        setFormData(JSON.parse(formDataParam));
      }
    }
  }, []);


  useEffect(() => {
    if (FP !== 0 && tripDetails !== "") {
      createNewRide();
    }
  }, [FP, tripDetails]);

  const handleDateChange = (e) => {
    const selectedDate = e instanceof Date ? e : new Date(e);
    setSelectedDate(selectedDate);
  };

  const handleTimeChange = (e) => {
    const selectedTime = e instanceof Date ? e : new Date(e);
    setSelectedTime(selectedTime);
  };
  
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const newDateTime = new Date(
        selectedDate.getFullYear(), 
        selectedDate.getMonth(), 
        selectedDate.getDate(), 
        selectedTime.getHours(), 
        selectedTime.getMinutes(), 
        selectedTime.getSeconds(),
        selectedTime.getMilliseconds()
      );
      handleDateTimeChange(newDateTime);
    }
  }, [selectedDate, selectedTime]);

  const handleDateTimeChange = (e) => {
    const selectedDateTime = e instanceof Date ? e : new Date(e);
    const selectedDateTimeUTC = new Date(selectedDateTime.getTime() + selectedDateTime.getTimezoneOffset() * 60000);
    // console.log('Selected time:', selectedDateTime);

    const secondsSinceEpoch = Math.floor(selectedDateTimeUTC.getTime() / 1000);
    setselectedDateTime(selectedDateTime);
    // console.log(new Date());
    setSecondsSinceEpoch(secondsSinceEpoch);
  };

  const createNewRide = async () => {
    if (secondsSinceEpoch === null) {
      console.error("Selected time is null. Please select a valid time.");
      return;
    }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const CarPoolingContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log(tripDetails);
        await CarPoolingContract.createRide(
          maxPassengers,
          BigInt(Math.ceil(rideFare)),
          BigInt(secondsSinceEpoch),
          tripDetails
        );
      ToastService.success("Ride created successfully!");

    } catch (error) {
      console.log("Error creating ride:", error);
      ToastService.error("Failed to create ride. Please try again.");
    }
  };

  const onSourceInputChange = (event, newInputValue) => {
    setSourceInput(newInputValue);
  };

  const onDestinationInputChange = (event, newInputValue) => {
    setDestinationInput(newInputValue);
  };

  const onPickupInputChange = (event, newInputValue) => {
    setPickupInput(newInputValue);
    // console.log(mileage);
  };


  //SAVING API USAGE

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://place-autocomplete1.p.rapidapi.com/autocomplete/json',
          params: {
            input: city,
            radius: '500',
          },
          headers: {
            'X-RapidAPI-Key': apiKey1,
            'X-RapidAPI-Host': 'place-autocomplete1.p.rapidapi.com',
          },
        };
        const response = await axios.request(options);

      } catch (error) {
        console.error(error);
      }
    };

    fetchSuggestions();
  }, [city]);

  const fetchSuggestions = async (input, setLocationOptions) => {
    try {
      const options = {
        method: 'GET',
        url: 'https://place-autocomplete1.p.rapidapi.com/autocomplete/json',
        params: {
          input: input,
          radius: '500',
        },
        headers: {
          'X-RapidAPI-Key': apiKey1,
          'X-RapidAPI-Host': 'place-autocomplete1.p.rapidapi.com',
        },
      };
      const response = await axios.request(options);
      setLocationOptions(
        response.data.predictions.map((suggestion) => ({
          label: suggestion.description,
          value: suggestion.place_id,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };


  // UNWANTED API USAGE...UNCOMMENT WHEN FUEL PRICE UPDATES CORRECTLY

  useEffect(() => {
    if (sourceInput) {
      fetchSuggestions(sourceInput, setSourceLocationOptions);
      console.log(sourceLocationOptions);
    }
  }, [sourceInput]);


  useEffect(() => {
    if (pickupInput) {
      fetchSuggestions(pickupInput, setPupLocationOptions);
    }
  }, [pickupInput]);

  useEffect(() => {
    if (destinationInput) {
      fetchSuggestions(destinationInput, setDestinationLocationOptions);
    }
  }, [destinationInput]);

  // const locationOptions = [
  //   { label: 'New York City, NY', value: 'New York City, NY' },
  //   { label: 'Los Angeles, CA', value: 'Los Angeles, CA' },
  //   { label: 'Chicago, IL', value: 'Chicago, IL' },
  //   { label: 'Houston, TX', value: 'Houston, TX' },
  // ];

  //UNCOMMENT WHEN DONE.... FOR REDUCTION IN API USAGE
  useEffect(() => {
    if (sourceInput && destinationInput) {
      calcDistance1(sourceInput, destinationInput);
    }
  }, [pickupInput, destinationInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Car details

      const newCarDetails = `${formData.carName} ${maxPassengers} Seater ${acNonAc}`;

      // Trip details
      const newTripDetails = `Source: ${sourceInput} + Destination: ${destinationInput} + Car Details: ${newCarDetails} + Driver Details: ${formData.name}-${formData.age}-${formData.gender} + Pick up point: ${pickupInput} + Distance: ${distance} + Gas Price: ${FP} + time: ${selectedDateTime}`;
      console.log(newTripDetails);
      setTripDetails(newTripDetails);
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={styles.container}>
        <ToastContainer />
        <h1>Confirm Ride details:</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name:</label>
            <input
              type="text"
              name="name"
              defaultValue={formData.name}
              disabled
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Age:</label>
            <input
              type="text"
              name="age"
              defaultValue={formData.age}
              disabled
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Gender:</label>
            <input
              type="text"
              name="gender"
              defaultValue={formData.gender}
              disabled
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone:</label>
            <input
              type="text"
              name="phone"
              defaultValue={formData.phone}
              disabled
              className={styles.inputField}
            />
          </div>
          <div className={styles.carInput}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Car:</label>
              <input
                type="text"
                name="car"
                defaultValue={formData.carName}
                disabled
                className={styles.inputField}
              />
            </div>
            <div className={styles.acNonAc}>
              <input
                type="radio"
                name="acNonAc"
                value="AC"
                defaultChecked={true}
                onChange={handleChangeRad}
              />{" "}
              AC
              <input
                type="radio"
                name="acNonAc"
                value="Non-AC"
                onChange={handleChangeRad}
              />{" "}
              Non-AC
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}> Seats Available </label>
            <input
              type="number"
              name="maxPassengers"
              defaultValue={maxPassengers}
              // min={1}
              // max={formData.carCapacity}
              onChange={handleChangeCarCap}
              className={styles.inputField}
            />
            {errorMessage && (
              <p style={{ color: "red", fontSize: "12px" }}>{errorMessage}</p>
            )}
          </div>

          <div className={styles.formGroup} id="from">
            <label className={styles.label}>Source:</label>
            <Autocomplete
              inputValue={sourceInput}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              onInputChange={onSourceInputChange}
              options={sourceLocationOptions}

              // IN PLACE OF PLACE AUTOCOMPLETE API -> API USAGE 4
              // options={locationOptions}

              id="source-input"
              sx={{ width: '85%' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter source location"
                  InputLabelProps={{ shrink: true }}
                />
              )}
              selectOnFocus
            />

            {/* In case Autocomplete doesn't work due to API error or something else */}

            {/* <input
              type="text"
              name="source"
              value={source}
              className={styles.inputField}
              onChange={handleSourceInputChange}
              required
            /> */}
          </div>


          <div className={styles.formGroup} id="to">
            <label className={styles.label}>Destination:</label>
            <Autocomplete
              className={styles.label}
              inputValue={destinationInput}
              onInputChange={onDestinationInputChange}
              id="destination-input"
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              options={destinationLocationOptions}
              // IN PLACE OF PLACE AUTOCOMPLETE API -> API USAGE 4
              // options={locationOptions}

              sx={{ width: '85%' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter destination location"
                  InputLabelProps={{ shrink: true }}
                />
              )}
              selectOnFocus
            />

            {/* In case Autocomplete doesn't work due to API error or something else */}

            {/* <input
              type="text"
              name="destination"
              value={destination}
              className={styles.inputField}
              onChange={handleDestinationInputChange}
              required
            /> */}


          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Pickup Point:</label>
            <Autocomplete
              onInputChange={onPickupInputChange}
              id="pup-input"
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              options={pupLocationOptions}

              // IN PLACE OF PLACE AUTOCOMPLETE API -> API USAGE 4
              // options={locationOptions}

              sx={{ width: '85%' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter pickup point"
                  name="pup"
                  InputLabelProps={{ shrink: true }}
                />
              )}
              selectOnFocus
            />

          </div>
          <div className={styles.formGroup}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column'}}>
                <label  className={styles.label}>Choose Date:</label>
                <DatePicker
                  id="date-picker"
                  minDate={new Date()}
                  maxDate={new Date(new Date().setDate(new Date().getDate() + 2))}
                  onChange={(newValue) => handleDateChange(newValue)}
                  TextField={(params) => <TextField {...params} variant="outlined" />}
                  sx={{width:'100%'}}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column'}}>
                <label className={styles.label}>Choose Time:</label>
                <TimePicker
                  id="time-picker"
                  value={selectedTime}
                  onChange={(newValue) => handleTimeChange(newValue)}
                  TextField={(params) => <TextField {...params} variant="outlined" />}
                  sx={{width:'100%'}}
                />
              </div>
            </div>
            {/* <DateTimePicker value={selectedTime} onChange={handleTimeChange}
              minDateTime={new Date()} maxDateTime={new Date(new Date().setDate(new Date().getDate() + 2))}
              sx={{ width: 400 }} /> */}
          </div>
          <br />
          <button type="submit" className={`${styles.submitButton} ${styles.center__relativedriver}`}>
            Submit
          </button>
          {/* <p className={styles.distance}>
            You will be travelling {distance} kilometers.
          </p> */}
        </form>
      </div>
      {/* <script src="http://localhost:8097"></script> */}
    </LocalizationProvider>
  );
};

export default createRide;
