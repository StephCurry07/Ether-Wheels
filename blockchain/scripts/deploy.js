const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const DECIMALS = 4;
    const INITIAL_ANSWER = 200000;

    const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
    const mockV3Aggregator = await MockV3Aggregator.deploy(DECIMALS, INITIAL_ANSWER);

    console.log("MockV3Aggregator deployed to:", mockV3Aggregator.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
