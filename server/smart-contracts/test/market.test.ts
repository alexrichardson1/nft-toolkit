import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { Market, NFT } from "../typechain";

chai.use(solidity);

const TOKEN_ONE_ID = 0;
const TOKEN_TWO_ID = 1;
const NUM_NFTS = 2;
const DEFAULT_MAPPING_VALUE = BigNumber.from("0");
// NFT Contract
const COLLECTION_SIZE = 10;
const COLLECTION_WEI_PRICE = ethers.utils.parseEther("1");
const BASE_URI = "";
// Market Contract
const CUT = 20;

describe("Royalties Contract", () => {
  let royaltiesContract: Market;
  let nftContract: NFT;
  let signerOne: SignerWithAddress | undefined;
  let signerTwo: SignerWithAddress | undefined;

  before(async () => {
    // NFT Contract
    const NFTContract = await ethers.getContractFactory("NFT");
    nftContract = await NFTContract.deploy(
      "Monkeys",
      "MNKY",
      BASE_URI,
      COLLECTION_SIZE,
      COLLECTION_WEI_PRICE
    );
    await nftContract.deployed();
    await nftContract.mint(NUM_NFTS, {
      value: COLLECTION_WEI_PRICE.mul(NUM_NFTS),
    });
    // Market Contract
    const RoyaltiesContract = await ethers.getContractFactory("Market");
    royaltiesContract = await RoyaltiesContract.deploy(
      CUT,
      nftContract.address,
      "0xdac17f958d2ee523a2206206994597c13d831ec7"
    );
    await royaltiesContract.deployed();
    [signerOne, signerTwo] = await ethers.getSigners();
  });

  describe("sellListing", () => {
    it("Should not allow to list NFT if not the owner", () => {
      expect(
        royaltiesContract
          .connect(signerTwo || "")
          .sellListing(TOKEN_ONE_ID, COLLECTION_WEI_PRICE, false)
      ).to.be.revertedWith("You do not own this NFT");
    });

    it("Should not allow to list NFT if not approved", () => {
      expect(
        royaltiesContract.sellListing(TOKEN_ONE_ID, COLLECTION_WEI_PRICE, false)
      ).to.be.revertedWith("This NFT is not approved");
    });

    it("Should update listings with the correct price", async () => {
      await nftContract.approve(royaltiesContract.address, TOKEN_ONE_ID);
      await royaltiesContract.sellListing(
        TOKEN_ONE_ID,
        COLLECTION_WEI_PRICE,
        false
      );
      expect(await royaltiesContract.listings(TOKEN_ONE_ID)).to.equal(
        COLLECTION_WEI_PRICE
      );
    });
  });

  describe("buy", () => {
    it("Should not allow buying without the correct funds", () => {
      expect(
        royaltiesContract.buy(TOKEN_ONE_ID, {
          value: ethers.utils.parseEther("0"),
        })
      ).to.be.revertedWith("Must send correct price");
    });

    it("Should not allow buying without the correct approval", async () => {
      await nftContract.approve(
        "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752",
        TOKEN_ONE_ID
      );
      expect(
        royaltiesContract.buy(TOKEN_ONE_ID, {
          value: COLLECTION_WEI_PRICE,
        })
      ).to.be.revertedWith("This NFT is not approved");
    });

    it("Should allow buying with the correct funds", async () => {
      if (!signerOne || !signerTwo) {
        return;
      }
      await nftContract.approve(royaltiesContract.address, TOKEN_ONE_ID);
      const sellerBalanceBefore = await nftContract.balanceOf(
        signerOne.address
      );
      await royaltiesContract.connect(signerTwo).buy(TOKEN_ONE_ID, {
        value: COLLECTION_WEI_PRICE,
      });
      const sellerBalanceAfter = await nftContract.balanceOf(signerOne.address);
      expect(sellerBalanceBefore).to.equal(sellerBalanceAfter.add(1));
    });
  });

  describe("delist", () => {
    it("Should not allow to list NFT if not the owner", () => {
      expect(
        royaltiesContract
          .connect(signerTwo || "")
          .sellListing(TOKEN_TWO_ID, COLLECTION_WEI_PRICE, false)
      ).to.be.revertedWith("You do not own this NFT");
    });

    it("Should delist a tokenId", async () => {
      await nftContract.approve(royaltiesContract.address, TOKEN_TWO_ID);
      await royaltiesContract.sellListing(
        TOKEN_TWO_ID,
        COLLECTION_WEI_PRICE,
        false
      );
      // safety check
      expect(await royaltiesContract.listings(TOKEN_TWO_ID)).to.equal(
        COLLECTION_WEI_PRICE
      );
      await royaltiesContract.delist(TOKEN_TWO_ID);
      // expect to be correctly removed
      expect(await royaltiesContract.listings(TOKEN_TWO_ID)).to.equal(
        DEFAULT_MAPPING_VALUE
      );
    });
  });
});
