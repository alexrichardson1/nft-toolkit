import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
// import { Contract } from "ethers";
import { NFT } from "../typechain/NFT";

chai.use(solidity);
const { expect } = chai;

const collectionSize = 10;
const collectionWeiPrice = 1000000000;

describe("NFT Collection Contract", function () {
  let nftContract: NFT;
  before(async function () {
    const NFTContract = await ethers.getContractFactory("NFT");
    nftContract = await NFTContract.deploy(
      "Monkeys",
      "MNKY",
      collectionSize,
      collectionWeiPrice
    );
    await nftContract.deployed();
  });
  describe("Constructor", function () {
    it("Should set name correctly", async function () {
      expect(await nftContract.name()).to.equal("Monkeys");
    });
    it("Should set symbol correctly", async function () {
      expect(await nftContract.symbol()).to.equal("MNKY");
    });
  });
});
