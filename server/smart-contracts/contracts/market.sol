// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./nft.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/** @title Market Smart Contract
 *  @notice Market for NFT Collection Owners
 */
contract Market {
  struct Royalties {
    uint256 stable;
    uint256 native;
  }

  NFT private _collection;
  ERC20 private _stable;
  mapping(uint256 => uint256) public listings;
  mapping(uint256 => bool) public areStable;
  mapping(address => Royalties) public royalties;

  event Delist(uint256 tokenId);
  event SellListing(uint256 tokenId, uint256 price);
  event Buy(uint256 tokenId);

  /**
   * @notice Construct a new royalty
   * @param addr The address of the NFT collection contract
   * @param stable The address of the stable token contract
   */
  constructor(address addr, address stable) {
    _collection = NFT(addr);
    _stable = ERC20(stable);
  }

  /**
   * @notice Claim the royalties for a given address
   */
  function claimRoyalties() external {
    Royalties storage royalty = royalties[msg.sender];
    require(royalty.stable > 0 || royalty.native > 0, "No royalties to claim");
    if (royalty.stable > 0) {
      _stable.transfer(msg.sender, royalty.stable);
      royalty.stable = 0;
    }
    if (royalty.native > 0) {
      payable(msg.sender).transfer(royalty.native);
      royalty.native = 0;
    }
  }

  /**
   * @notice Delist a NFT
   * @param tokenId The tokenId of the NFT to delist
   */
  function delist(uint256 tokenId) public {
    require(
      msg.sender == _collection.ownerOf(tokenId),
      "You do not own this NFT"
    );
    delete listings[tokenId];
    emit Delist(tokenId);
  }

  /**
   * @notice Add a NFT to the listing to be sold
   * @param tokenId The tokenId of the NFT to list
   * @param price The selling price of the NFT
   */
  function sellListing(
    uint256 tokenId,
    uint256 price,
    bool isStable
  ) public {
    require(
      msg.sender == _collection.ownerOf(tokenId),
      "You do not own this NFT"
    );
    require(
      _collection.getApproved(tokenId) == address(this),
      "This NFT is not approved"
    );
    require(price > 0, "Price must be greater than 0");
    listings[tokenId] = price;
    areStable[tokenId] = isStable;
    emit SellListing(tokenId, price);
  }

  /**
   * @notice Buy a NFT
   * @param tokenId The tokenId of the NFT to be purchased
   */
  function buy(uint256 tokenId) public payable {
    uint256 price = listings[tokenId];
    bool isStable = areStable[tokenId];
    require(price > 0, "This NFT is not for sale");
    require(
      _collection.getApproved(tokenId) == address(this),
      "This NFT is not approved"
    );
    require(
      (isStable && _stable.transferFrom(msg.sender, address(this), price)) ||
        msg.value == price,
      "Must send correct price"
    );
    address royaltyReceiver;
    uint256 royaltyAmount;
    (royaltyReceiver, royaltyAmount) = _collection.royaltyInfo(0, price);
    address payable seller = payable(_collection.ownerOf(tokenId));

    // Transfer NFT to market contract
    _collection.transferFrom(seller, address(this), tokenId);
    // Transfer NFT from market contract to buyer
    _collection.transferFrom(address(this), msg.sender, tokenId);

    uint256 sellerCut = price - royaltyAmount;

    // Transfer cut to royalty receiver & seller
    if (isStable) {
      royalties[royaltyReceiver].stable += royaltyAmount;
      _stable.transfer(seller, sellerCut);
    } else {
      royalties[royaltyReceiver].native += royaltyAmount;
      seller.transfer(sellerCut);
    }

    delete listings[tokenId];
    emit Buy(tokenId);
  }
}
