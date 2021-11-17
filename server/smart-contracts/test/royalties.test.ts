import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { NFT, Royalty } from "../typechain";

chai.use(solidity);

const TOKEN_ID = 0;
// NFT Contract
const COLLECTION_SIZE = 10;
const COLLECTION_WEI_PRICE = ethers.utils.parseEther("1");
const BASE_URI = "";
const ARTIST_ADDRESS = "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752";
// Royalty Contract
const CUT = 20;

describe("Royalties Contract", () => {
  let royaltiesContract: Royalty;
  let nftContract: NFT;
  let signerOne: SignerWithAddress | undefined;
  let signerTwo: SignerWithAddress | undefined;

  before(async () => {
    // NFT Contract
    const NFTContract = await ethers.getContractFactory("NFT");
    nftContract = await NFTContract.deploy(
      "Monkeys",
      "MNKY",
      ARTIST_ADDRESS,
      BASE_URI,
      COLLECTION_SIZE,
      COLLECTION_WEI_PRICE
    );
    await nftContract.deployed();
    await nftContract.mint(1, {
      value: COLLECTION_WEI_PRICE,
    });
    // Royalty Contract
    const RoyaltiesContract = await ethers.getContractFactory("Royalty");
    royaltiesContract = await RoyaltiesContract.deploy(
      CUT,
      nftContract.address
    );
    await royaltiesContract.deployed();
    [signerOne, signerTwo] = await ethers.getSigners();
  });

  describe("sellListing", () => {
    it("Should not allow to list NFT if not the owner", () => {
      expect(
        royaltiesContract
          .connect(signerTwo || "")
          .sellListing(TOKEN_ID, COLLECTION_WEI_PRICE)
      ).to.be.revertedWith("You do not own this NFT");
    });

    it("Should not allow to list NFT if not approved", () => {
      expect(
        royaltiesContract.sellListing(TOKEN_ID, COLLECTION_WEI_PRICE)
      ).to.be.revertedWith("This NFT is not approved");
    });

    it("Should update listings with the correct price", async () => {
      await nftContract.approve(royaltiesContract.address, TOKEN_ID);
      await royaltiesContract.sellListing(TOKEN_ID, COLLECTION_WEI_PRICE);
      expect(await royaltiesContract.listings(TOKEN_ID)).to.equal(
        COLLECTION_WEI_PRICE
      );
    });
  });

  describe("buy", () => {
    it("Should not allow buying without the correct funds", () => {
      expect(
        royaltiesContract.buy(TOKEN_ID, {
          value: ethers.utils.parseEther("0"),
        })
      ).to.be.revertedWith("Must send correct price");
    });

    it("Should not allow buying without the correct approval", async () => {
      await nftContract.approve(
        "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752",
        TOKEN_ID
      );
      expect(
        royaltiesContract.buy(TOKEN_ID, {
          value: COLLECTION_WEI_PRICE,
        })
      ).to.be.revertedWith("This NFT is not approved");
    });

    it("Should allow buying with the correct funds", async () => {
      if (!signerOne || !signerTwo) {
        return;
      }
      await nftContract.approve(royaltiesContract.address, TOKEN_ID);
      const sellerBalanceBefore = await nftContract.balanceOf(
        signerOne.address
      );
      await royaltiesContract.connect(signerTwo).buy(TOKEN_ID, {
        value: COLLECTION_WEI_PRICE,
      });
      const sellerBalanceAfter = await nftContract.balanceOf(signerOne.address);
      expect(sellerBalanceBefore).to.equal(sellerBalanceAfter.add(1));
    });
  });
});
