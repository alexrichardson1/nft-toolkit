// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
  uint256 private _price;
  uint256 private _limit;
  using Counters for Counters.Counter;
  Counters.Counter public _tokenIdTracker;

  constructor(
    string memory name,
    string memory symbol,
    uint256 limit,
    uint256 price
  ) ERC721(name, symbol) {
    _limit = limit;
    _price = price;
  }

  function setTokenURI(uint256 tokenId, string memory _tokenURI) external {
    _setTokenURI(tokenId, _tokenURI);
  }

  function mint(uint256 amount) public payable {
    require(msg.value == _price * amount, "Must send correct price");
    require(
      _tokenIdTracker.current() + amount <= _limit,
      "Not enough in the collection left to mint amount"
    );
    for (uint256 i = 0; i < amount; i++) {
      _mint(msg.sender, _tokenIdTracker.current());
      _tokenIdTracker.increment();
    }
  }
}
