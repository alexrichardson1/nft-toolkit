import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "solidity-coverage";

// eslint-disable-next-line import/no-anonymous-default-export
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
  typechain: {
    target: "ethers-v5",
    alwaysGenerateOverloads: false,
  },
};
