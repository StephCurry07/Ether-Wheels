// 00-deploy-mocks.js

const { ethers } = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments;
    const { redeployer } = await getNamedAccounts();
    // const [redeployer] = await ethers.getSigners();

    // // Get the balance of the redeployer account
    // const balance = await redeployer.getBalance();
  
    // // Format the balance from Wei to Ether and log it
    // console.log("Account balance:", ethers.utils.formatUnits(balance, 18));
    const DECIMALS = 6;
    const INITIAL_ANSWER = 200000;
    log("----------------------------------------------------");
    log("Deploying MockV3Aggregator and waiting for confirmations...");
    await deploy("MockV3Aggregator", {
      from: redeployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mocks Deployed!");
    log("----------------------------------------------------");
  };
  
  module.exports.tags = ["all", "mocks"];
  

 