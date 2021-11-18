// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./nft.sol";

contract Royalty {
  NFT private _collection;
  uint256 private _royalty;
  mapping(uint256 => uint256) public listings;

  constructor(uint256 cut, address addr) {
    _collection = NFT(addr);
    _royalty = cut;
  }

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
  }

  function buy(uint256 tokenId) public payable {
    require(msg.value == listings[tokenId], "Must send correct price");
    require(
      _collection.getApproved(tokenId) == address(this),
      "This NFT is not approved"
    );
    uint256 royalty = (msg.value * _royalty) / 100;
    address payable artist = payable(_collection.artist());
    address payable seller = payable(_collection.ownerOf(tokenId));
    _collection.transferFrom(seller, address(this), tokenId);
    artist.transfer(royalty);
    seller.transfer(msg.value - royalty);
    _collection.transferFrom(address(this), msg.sender, tokenId);
  }
}
