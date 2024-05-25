'use client';

import { Autocomplete, TextField } from "@mui/material";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import styles from '../../styles/user-registration.module.css';

const DriverRegistration = ({ data }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    carName: '',
    carCapacity: '',
    mileage: '',
    fuel_type: '',
  });

  const [carsData, setCarsData] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState([]);
  const [fare, setFare] = useState(0);
  const [distance, setDistance] = useState(100);
  
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
    if (selectedCar) {
      console.log(selectedCar);
    }
  }, [selectedCar]);

  const searchParams = useSearchParams();
  const connectedAccount = searchParams.get("connectedAccount");
  const balance = searchParams.get("balance");

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // localStorage.setItem('formData', JSON.stringify(formData));
    router.push({
      pathname: '/create-ride',
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(formData);
 
  //   localStorage.setItem('formData', JSON.stringify(formData));
  //   window.location.href = '/create-ride';
  // };

  const handleCarChange = (event, newValue) => {
    setSelectedCar(newValue);
    // const { carName, value } = event.target;
    setFormData({
      ...formData,
      ['carName']: newValue.Combined_Name,
      ['carCapacity']: newValue.Seating_Capacity,
      ['mileage']: newValue.City_Mileage,
      ['fuel_type']: newValue.Fuel_Type,
    });
    console.log(newValue);
  };

  return (
    <div className={styles.container} >
      <h1>Register as Driver</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Your details:</legend>

          <div className={styles.formGroup}>
            <label className={styles.label}>Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Age:</label>
            <input
              type="text"
              id="age"
              name="age"
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Gender:</label>
            <input
              type="text"
              id="gender"
              name="gender"
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
        </fieldset>
        <br></br>
        <fieldset>
          <legend>Enter your car details: </legend>

          <div className={styles.formGroup}>
            <label className={styles.label} >Car name</label>
            <Autocomplete
              options={carsData}
              getOptionLabel={(option) => option.Combined_Name || ""}
              defaultValue={selectedCar.Combined_Name}
              onChange={handleCarChange}
              renderInput={(params) => <TextField {...params} label="Select Car" variant="outlined" />}
              // className={styles.inputField}
              sx={{width: '83%'}}
            />
            
          </div>
          <div className={styles.formGroup}>

            <label className={styles.label} >Car Capacity(Max. Num of Passengers):</label>
            <input
              type="text"
              id="cap"
              name="carCapacity"
              value={selectedCar.Seating_Capacity}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
        </fieldset>
        <br></br>
        <Link
          href={{
            pathname: "/create-ride",
            query: {
              connectedAccount: connectedAccount,
              balance: balance,
              role: "driver",
              formData: JSON.stringify(formData),
            },
          }}
          style={{ marginTop: "auto" }}
        >
          <button type="submit" className={`${styles.submitButton} ${styles.center__relative}`}>Submit</button>
        </Link>

      </form>
    </div>
  );
};

export default DriverRegistration;
