const { networkConfig } = require("../helper-hardhat.config")

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy, log } = deployments
    const { redeployer } = await getNamedAccounts()
    const chainId = await getChainId()

    let priceFeedAddress

    // You can add specific price feed addresses for different networks in helper-hardhat-config.js
    if (chainId == 31337) {
        // If we are on a local development network, use a mock
        const mockAggregator = await deployments.get("MockV3Aggregator")
        priceFeedAddress = mockAggregator.address
    } else {
        priceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
        
    }

    const carpooling = await deploy("CarPooling", {
        from: redeployer,
        args: [priceFeedAddress],
        log: true,
        
    })

    log(`Carpooling deployed at ${carpooling.address}`)
}

module.exports.tags = ["all", "carpooling"]
