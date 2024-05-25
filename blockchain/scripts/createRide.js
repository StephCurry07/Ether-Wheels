const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const carpooling = await ethers.getContract("CarPooling", deployer);
  console.log("Carpooling contract.....");
  const transactionResponse = await carpooling.createRide(
    3,
    25,
    Math.round(Date.now() / 1000),
    "Source: Airport + Destination: Hotel + Car Details: Swift Dzire + Driver Details: Aadhar Number + Pick up point: Gate No. 4 + Distance : 7km + Gas Price : x"
  );
  await transactionResponse.wait(1);
  console.log("Ride created");
  console.log(transactionResponse);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
