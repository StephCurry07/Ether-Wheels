# Carpooling EtherWheels
## Description
The CarPooling smart contract facilitates the creation, booking, management, and cancellation of rides within a carpooling system. It is designed to run on the Ethereum blockchain and leverages Solidity for smart contract development. This project is divided into two parts: smart contract and frontend.

## Features

- Create Ride: Drivers can create rides by specifying details such as maximum passengers, ride fare, start time, and trip details.
- Book Ride: Passengers can book available rides by paying the specified fare.
- Cancel Ride: Rides can be canceled by either the driver or passengers, with appropriate refund mechanisms in place.
- Get All Rides: Users can retrieve information about all available rides or rides associated with their address.
- Status Update: Passengers can mark rides as completed once the journey is finished.

## Requirements
- ### Node
- ### MetaMask Wallet (You won't be able to proceed further without it. You'll be redirected to a page which says to install it.)
    We are using Ethereum's Sepolia testnet for the smart contract. So the transactions will be based on Sepolia Ethers.
    Use these links to add Eth tokens to your wallet:
   - https://faucets.chain.link/sepolia
   - https://www.alchemy.com/faucets/ethereum-sepolia
 
- ### Rapid API Accounts and Required APIs

To get started with this project, you'll need to create accounts on Rapid API and obtain the following APIs:

1. **[Place Autocomplete](https://rapidapi.com/IRCTCAPI/api/place-autocomplete1)**:
   This API provides autocomplete functionality for place names, facilitating location-based searches or forms.

2. **[Driving Distance Calculator Between Two Points](https://rapidapi.com/alreadycoded/api/driving-distance-calculator-between-two-points)**:
   This API calculates the driving distance and time between two locations, aiding in route planning and navigation.

3. **[Forward & Reverse Geocoding](https://rapidapi.com/GeocodeSupport/api/forward-reverse-geocoding)**:
   This API offers both forward and reverse geocoding capabilities, translating between addresses or place names and geographic coordinates.

4. **[Daily Petrol, Diesel, LPG & CNG Fuel Prices in India](https://rapidapi.com/mi8y-mi8y-default/api/daily-petrol-diesel-lpg-cng-fuel-prices-in-india)**:
   Retrieves daily fuel prices for petrol, diesel, LPG, and CNG in India, aiding in monitoring and analysis of fuel costs.


## Installation

Install dependencies:
```
npm install
```

## Setting Up Environment Variables

To configure environment variables for your project, follow these steps:

1. **Create a `.env` File**: 
   Create a file named `.env` in the root directory(frontend) of your project.

2. **Define Environment Variables**:
   Inside the `.env` file, define your environment variables in the following format:
   ```
    NEXT_PUBLIC_RAPIDAPI_KEY1=your_rapidapi_key1
    NEXT_PUBLIC_RAPIDAPI_KEY2=your_rapidapi_key2 #optional
    NEXT_PUBLIC_RAPIDAPI_KEY3=your_rapidapi_key3 #optional
   ```
## Running the project:

### Select Driver or Passenger and Fill Details

Users have the option to either act as a driver or a passenger. Depending on their role, they can fill in specific details as outlined below:

#### Driver:

If you choose to be a driver, follow these steps:

1. **Fill Details**: Provide the necessary information such as the maximum number of passengers, ride fare, departure time, and trip details.
   
2. **Confirm Ride Details**: Once all details are filled, proceed to create a ride by submitting the form.
   
3. **Create Ride**: After clicking the button you'll be prompted to pay using metamask wallet. Wait 12-13 seconds for the confirmation.

#### Passenger:

If you choose to be a passenger, follow these steps:

1. **Fill Details**: Passengers need to provide information such as their destination, preferred departure time, and any special requests.

2. **Book Ride**: After filling in the details, passengers can search for available rides and book a suitable one.

By following these steps, users can seamlessly navigate between the roles of driver and passenger and contribute to the carpooling ecosystem efficiently.

## Working Demo

Watch this to see how it works...
https://github.com/StephCurry07/Ether-Wheels/assets/76783882/4c085542-ccf6-4469-94f7-91f815d922d3

## Testing
Unit tests for the CarPooling smart contract can be found in the tests directory. Run the tests using a Solidity testing framework such as Truffle or Hardhat.

## License
This project is licensed under the MIT License. See the LICENSE file for details.



