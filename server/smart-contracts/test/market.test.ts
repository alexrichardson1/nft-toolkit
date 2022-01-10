/* eslint-disable no-unused-expressions */
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { Circle, Market, NFT } from "../typechain";

chai.use(solidity);

const TOKEN_ONE_ID = 0;
const TOKEN_TWO_ID = 1;
const TOKEN_THREE_ID = 2;
const NUM_NFTS = 3;
const DEFAULT_MAPPING_VALUE = BigNumber.from("0");
// NFT Contract
const COLLECTION_SIZE = 10;
const COLLECTION_WEI_PRICE = ethers.utils.parseEther("1");
const BASE_URI = "";
// 20% royalty
const CUT = 2000;

describe("Market Contract", () => {
  let marketContract: Market;
  let nftContract: NFT;
  let circleContract: Circle;
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
      COLLECTION_WEI_PRICE,
      CUT
    );
    await nftContract.deployed();
    await nftContract.mint(NUM_NFTS, {
      value: COLLECTION_WEI_PRICE.mul(NUM_NFTS),
    });
    // Circle Contract
    const CircleContract = await ethers.getContractFactory("Circle");
    circleContract = await CircleContract.deploy("Circle", "USDC");
    // Market Contract
    const MarketContract = await ethers.getContractFactory("Market");
    marketContract = await MarketContract.deploy(
      nftContract.address,
      circleContract.address
    );
    await marketContract.deployed();
    [signerOne, signerTwo] = await ethers.getSigners();
  });

  describe("sellListing", () => {
    it("Should not allow to list NFT if not the owner", () => {
      expect(
        marketContract
          .connect(signerTwo || "")
          .sellListing(TOKEN_ONE_ID, COLLECTION_WEI_PRICE, false)
      ).to.be.revertedWith("You do not own this NFT");
    });

    it("Should not allow to list NFT if not approved", () => {
      expect(
        marketContract.sellListing(TOKEN_ONE_ID, COLLECTION_WEI_PRICE, false)
      ).to.be.revertedWith("This NFT is not approved");
    });

    it("Should update listings with the correct price", async () => {
      await nftContract.approve(marketContract.address, TOKEN_ONE_ID);
      await marketContract.sellListing(
        TOKEN_ONE_ID,
        COLLECTION_WEI_PRICE,
        false
      );
      expect(await marketContract.areStable(TOKEN_THREE_ID)).to.be.false;
      expect(await marketContract.listings(TOKEN_ONE_ID)).to.equal(
        COLLECTION_WEI_PRICE
      );
      expect(await marketContract.areStable(TOKEN_THREE_ID)).to.be.false;
    });

    it("Should update areStable correctly", async () => {
      await nftContract.approve(marketContract.address, TOKEN_THREE_ID);
      expect(await marketContract.areStable(TOKEN_THREE_ID)).to.be.false;
      await marketContract.sellListing(
        TOKEN_THREE_ID,
        COLLECTION_WEI_PRICE,
        true
      );
      expect(await marketContract.listings(TOKEN_THREE_ID)).to.equal(
        COLLECTION_WEI_PRICE
      );
      expect(await marketContract.areStable(TOKEN_THREE_ID)).to.be.true;
    });
  });

  describe("buy", () => {
    it("Should not allow buying without the correct funds", () => {
      expect(
        marketContract.buy(TOKEN_ONE_ID, {
          value: ethers.utils.parseEther("0"),
        })
      ).to.be.revertedWith("Must send correct price");
    });

    it("Should not allow buying without the correct approval", async () => {
      const APPROVED_ADDRESS = "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752";
      await nftContract.approve(APPROVED_ADDRESS, TOKEN_ONE_ID);
      expect(
        marketContract.buy(TOKEN_ONE_ID, {
          value: COLLECTION_WEI_PRICE,
        })
      ).to.be.revertedWith("This NFT is not approved");
    });

    it("Should allow buying with the correct ETH funds", async () => {
      if (!signerOne || !signerTwo) {
        return;
      }
      await nftContract.approve(marketContract.address, TOKEN_ONE_ID);
      const sellerBalanceBefore = await nftContract.balanceOf(
        signerOne.address
      );
      await marketContract.connect(signerTwo).buy(TOKEN_ONE_ID, {
        value: COLLECTION_WEI_PRICE,
      });
      const sellerBalanceAfter = await nftContract.balanceOf(signerOne.address);
      expect(sellerBalanceBefore).to.equal(sellerBalanceAfter.add(1));
    });

    describe("Stable coin", () => {
      it("Should allow buying with the correct stable coin funds", async () => {
        if (!signerOne || !signerTwo) {
          return;
        }
        await circleContract.connect(signerTwo).mint(COLLECTION_WEI_PRICE);
        await circleContract
          .connect(signerTwo)
          .approve(marketContract.address, COLLECTION_WEI_PRICE);
        await nftContract.approve(marketContract.address, TOKEN_THREE_ID);
        const sellerBalanceBefore = await circleContract.balanceOf(
          signerOne.address
        );
        await marketContract.connect(signerTwo).buy(TOKEN_THREE_ID, {
          value: COLLECTION_WEI_PRICE,
        });
        const sellerBalanceAfter = await circleContract.balanceOf(
          signerOne.address
        );
        const divisor = 5;
        const numerator = 4;
        expect(sellerBalanceAfter).to.equal(
          sellerBalanceBefore.add(
            COLLECTION_WEI_PRICE.div(divisor).mul(numerator)
          )
        );
      });
    });
  });

  describe("delist", () => {
    it("Should not allow to list NFT if not the owner", () => {
      expect(
        marketContract
          .connect(signerTwo || "")
          .sellListing(TOKEN_TWO_ID, COLLECTION_WEI_PRICE, false)
      ).to.be.revertedWith("You do not own this NFT");
    });

    it("Should delist a tokenId", async () => {
      await nftContract.approve(marketContract.address, TOKEN_TWO_ID);
      await marketContract.sellListing(
        TOKEN_TWO_ID,
        COLLECTION_WEI_PRICE,
        false
      );
      // safety check
      expect(await marketContract.listings(TOKEN_TWO_ID)).to.equal(
        COLLECTION_WEI_PRICE
      );
      await marketContract.delist(TOKEN_TWO_ID);
      // expect to be correctly removed
      expect(await marketContract.listings(TOKEN_TWO_ID)).to.equal(
        DEFAULT_MAPPING_VALUE
      );
    });
  });

  describe("claimRoyalties", () => {
    it("Should not allow to claim royalties if none available", () => {
      expect(
        marketContract.connect(signerTwo || "").claimRoyalties()
      ).to.be.revertedWith("No royalties to claim");
    });

    it("Should allow to claim royalties", async () => {
      await marketContract.claimRoyalties();
      const postClaim = await marketContract.royalties(
        signerOne ? signerOne.address : ""
      );
      const emptyRoyalty = {
        stable: BigNumber.from(0),
        native: BigNumber.from(0),
      };
      expect(postClaim.stable).to.equal(emptyRoyalty.stable);
      expect(postClaim.native).to.equal(emptyRoyalty.native);
    });
  });
});
