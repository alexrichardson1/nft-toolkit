import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "solidity-coverage";

export default {
  solidity: {
    version: "0.8.0",
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
