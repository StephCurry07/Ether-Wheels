const { networkConfig } = require("../helper-hardhat.config")

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy, log } = deployments
    const { redeployer } = await getNamedAccounts()
    const chainId = 2442

    let priceFeedAddress

    priceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    
    const carpooling = await deploy("CarPooling", {
        from: redeployer,
        args: [priceFeedAddress],
        log: true,
    })

    log(`Carpooling deployed at ${carpooling.address}`)
}

module.exports.tags = ["all", "carpooling"]
