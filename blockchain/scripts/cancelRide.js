const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const carpooling = await ethers.getContract("CarPooling", deployer);
  console.log("Carpooling contract.....");
  var transactionResponse = await carpooling.cancelRide(1);
  console.log(transactionResponse);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
