import "@nomiclabs/hardhat-waffle";

export default {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
  },
  paths: {
    root: "./smart-contracts",
  },
};
