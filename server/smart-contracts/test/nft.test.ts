import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { NFT } from "../typechain";

chai.use(solidity);

const COLLECTION_SIZE = 10;
const COLLECTION_WEI_PRICE = ethers.utils.parseEther("1");
const BASE_URI = "";

describe("NFT Collection Contract", () => {
  let nftContract: NFT;
  before(async () => {
    const NFTContract = await ethers.getContractFactory("NFT");
    nftContract = await NFTContract.deploy(
      "Monkeys",
      "MNKY",
      BASE_URI,
      COLLECTION_SIZE,
      COLLECTION_WEI_PRICE,
      0
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
        nftContract.mint(COLLECTION_SIZE + 1, {
          value: COLLECTION_WEI_PRICE.mul(COLLECTION_SIZE + 1),
        })
      ).to.be.revertedWith("Not enough in the collection left to mint amount");
    });

    it("should increment tokenIdTracker by number of minted", async () => {
      expect(await nftContract.tokenIdTracker()).to.equal("0");
      await nftContract.mint(1, {
        value: COLLECTION_WEI_PRICE,
      });
      expect(await nftContract.tokenIdTracker()).to.equal("1");
    });
  });

  describe("Withdraw", () => {
    it("Should withdraw minting fees correctly", async () => {
      await nftContract.withdraw();
      expect(await ethers.provider.getBalance(nftContract.address)).to.equal(
        "0"
      );
    });
  });
});
