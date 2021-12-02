// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./nft.sol";

/** @title Market Smart Contract
 *  @notice Market for NFT Collection Owners
 */
contract Market {
  NFT private _collection;
  uint256 public royalty;
  mapping(uint256 => uint256) public listings;

  /**
   * @notice Construct a new royalty
   * @param cut The royalty for the creator of the NFT collection
   * @param addr The address of the NFT collection contract
   */
  constructor(uint256 cut, address addr) {
    _collection = NFT(addr);
    royalty = cut;
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
  function sellListing(uint256 tokenId, uint256 price) public {
    require(
      msg.sender == _collection.ownerOf(tokenId),
      "You do not own this NFT"
    );
    require(
      _collection.getApproved(tokenId) == address(this),
      "This NFT is not approved"
    );
    listings[tokenId] = price;
    emit SellListing(tokenId, price);
  }

  event Buy(uint256 tokenId);

  /**
   * @notice Buy a NFT
   * @param tokenId The tokenId of the NFT to be purchased
   */
  function buy(uint256 tokenId) public payable {
    require(msg.value == listings[tokenId], "Must send correct price");
    require(
      _collection.getApproved(tokenId) == address(this),
      "This NFT is not approved"
    );
    uint256 cut = (msg.value * royalty) / 100;
    address payable artist = payable(_collection.owner());
    address payable seller = payable(_collection.ownerOf(tokenId));
    _collection.transferFrom(seller, address(this), tokenId);
    artist.transfer(cut);
    seller.transfer(msg.value - cut);
    _collection.transferFrom(address(this), msg.sender, tokenId);
    emit Buy(tokenId);
  }
}
