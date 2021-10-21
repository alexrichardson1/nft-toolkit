import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { NFT } from "../typechain";

chai.use(solidity);

const collectionSize = 10;
const collectionWeiPrice = ethers.utils.parseEther("1");
const baseURI = "";

describe("NFT Collection Contract", () => {
  let nftContract: NFT;
  before(async () => {
    const NFTContract = await ethers.getContractFactory("NFT");
    nftContract = await NFTContract.deploy(
      "Monkeys",
      "MNKY",
      baseURI,
      collectionSize,
      collectionWeiPrice
    );
    await nftContract.deployed();
  });

  describe("Constructor", () => {
    it("Should set name correctly", async () => {
      expect(await nftContract.name()).to.equal("Monkeys");
    });

    it("Should set symbol correctly", async () => {
      expect(await nftContract.symbol()).to.equal("MNKY");
    });
  });

  describe("Mint", () => {
    it("Should not allow minting without the correct funds", () => {
      expect(
        nftContract.mint(1, {
          value: ethers.utils.parseEther("0"),
        })
      ).to.be.revertedWith("Must send correct price");
    });

    it("Should not allow minting more than the collection size", () => {
      expect(
        nftContract.mint(collectionSize + 1, {
          value: collectionWeiPrice.mul(collectionSize + 1),
        })
      ).to.be.revertedWith("Not enough in the collection left to mint amount");
    });
  });
});
