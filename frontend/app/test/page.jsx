'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { TextField, Autocomplete } from "@mui/material";
import axios from 'axios';

const App = () => {
    const [carsData, setCarsData] = useState([]);
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState([]);
    const [fuelPrice, setFuelPrice] = useState(0);
    const [mileage, setMileage] = useState(0);
    const [fare, setFare] = useState(0);
    const [distance, setDistance] = useState(100);
    const fuel_type = 'petrol';
    const stateName = 'delhi'; 
    const handleCarChange = (event, newValue) => {
        setSelectedCar(newValue);
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://raw.githubusercontent.com/StephCurry07/carpooling-frontend/master/utils/cars-final.csv');
            const reader = response.body.getReader();
            const result = await reader.read();
            const decoder = new TextDecoder('utf-8');
            const csvString = decoder.decode(result.value);
            const { data } = Papa.parse(csvString, { header: true });
            setCarsData(data);
            setCars(data.map((car) => car.Combined_Name));
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchFuelPrice = async (stateName, fuel_type) => {
            const options = {
                method: 'GET',
                url: `https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1/fuel-prices/today/india/${stateName}`,
                // ADD PARAMS ALSO TO MAKE CODE SHORTER LATER ON...AFTER IT STARTS WORKING
                headers: {
                    'X-RapidAPI-Key': '38424df195msh9ee1dbed38d22d0p1dd980jsn41f9b6f44895',
                    'X-RapidAPI-Host': 'daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com'
                }
            };
            try {
                const response = await axios.request(options);
                if(fuel_type === 'petrol'){
                    setFuelPrice(response.data.fuel.petrol.retailPrice);
                }
                else if(fuel_type === 'diesel'){
                    setFuelPrice(response.data.fuel.diesel.retailPrice)
                }
                else if(fuel_type === 'cng'){
                    setFuelPrice(response.data.fuel.cng.retailPrice)
                }
                console.log(response.data.fuel);
            } catch (error) {
                console.error(error);
            }

        };
        if(fuel_type === 'electric'){
            setFuelPrice(0.5);
        }
        //CALC FARE FOR HYBRID DIRECTLY... NO OTHER METHOD SUITABLE AS FUEL PRICE NEEDS TO BE ADJUSTED (SEE LATER)
        else{
            fetchFuelPrice('delhi', 'petrol');
        }

    }, []);

    useEffect(() => {
        console.log(fuelPrice);
        
    }, [fuelPrice]);

    useEffect(() => {
        if (selectedCar) {
            setMileage(selectedCar.City_Mileage);
            console.log(selectedCar);
        }

        const calcFare = () => {
            if (mileage && fuelPrice) {
                const fare = (distance / selectedCar.City_Mileage) * fuelPrice;
                setFare(fare);
                console.log(fare);
            }
        };

        calcFare();
    }, [selectedCar]);

    return (
        
        <Autocomplete
            options={carsData}
            getOptionLabel={(option) => option.Combined_Name}
            value={selectedCar.Combined_Name}
            onChange={handleCarChange}
            renderInput={(params) => <TextField {...params} label="Select Car" variant="outlined" />}
        />
    );
}

export default App;