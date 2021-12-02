// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./nft.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/** @title Market Smart Contract
 *  @notice Market for NFT Collection Owners
 */
contract Market {
  NFT private _collection;
  uint256 public royalty;
  ERC20 private _stable;
  mapping(uint256 => uint256) public listings;
  mapping(uint256 => bool) public areStable;

  /**
   * @notice Construct a new royalty
   * @param cut The royalty for the creator of the NFT collection
   * @param addr The address of the NFT collection contract
   */
  constructor(
    uint256 cut,
    address addr,
    address stable
  ) {
    _collection = NFT(addr);
    royalty = cut;
    _stable = ERC20(stable);
  }

  event Delist(uint256 tokenId);

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

  event SellListing(uint256 tokenId, uint256 price);

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
    listings[tokenId] = price;
    areStable[tokenId] = isStable;
    emit SellListing(tokenId, price);
  }

  event Buy(uint256 tokenId);

  /**
   * @notice Buy a NFT
   * @param tokenId The tokenId of the NFT to be purchased
   */
  function buy(uint256 tokenId) public payable {
    uint256 price = listings[tokenId];
    if (areStable[tokenId]) {
      _stable.transferFrom(msg.sender, address(this), price);
    } else {
      require(msg.value == price, "Must send correct price");
    }
    require(
      _collection.getApproved(tokenId) == address(this),
      "This NFT is not approved"
    );
    uint256 cut = (price * royalty) / 100;
    address payable artist = payable(_collection.owner());
    address payable seller = payable(_collection.ownerOf(tokenId));
    _collection.transferFrom(seller, address(this), tokenId);
    if (areStable[tokenId]) {
      _stable.transferFrom(address(this), artist, price);
      _stable.transferFrom(address(this), seller, price - cut);
    } else {
      artist.transfer(cut);
      seller.transfer(price - cut);
    }
    _collection.transferFrom(address(this), msg.sender, tokenId);
    emit Buy(tokenId);
  }
}
