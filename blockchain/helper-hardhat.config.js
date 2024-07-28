const networkConfig = {
  31337: {
    name: "localhost",
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/data-feeds/price-feeds/addresses
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  2442: {
    name: "cardona",
    ethUsdPriceFeed: "0xd94522a6feF7779f672f4C88eb672da9222f2eAc"
  }
  90354: {
    name: "campnetwork",
    ethUsdPriceFeed: "0x1Ea10586afA59D8B316b4EF3810b6B845fA6aBB8"
  }
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
};
