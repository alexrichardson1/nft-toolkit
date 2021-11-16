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
    listings[tokenId] = price;
  }

  function buy(uint256 tokenId) public payable {
    require(msg.value == listings[tokenId], "Must send correct price");
    uint256 royalty = (msg.value * _royalty) / 100;
    address payable artist = _collection.artist();
    address payable seller = payable(_collection.ownerOf(tokenId));
    _collection.transferFrom(seller, address(this), tokenId);
    artist.transfer(royalty);
    seller.transfer(msg.value - royalty);
  }
}
