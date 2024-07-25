const networkConfig = {
  31337: {
    name: "localhost",
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/data-feeds/price-feeds/addresses
  2442: {
    name: "cardona",
    ethUsdPriceFeed: "0xd94522a6feF7779f672f4C88eb672da9222f2eAc",
  },
};

const developmentChains = ["hardhat", "localhost", "cardona"];

module.exports = {
  networkConfig,
  developmentChains,
};
