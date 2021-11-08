// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721Enumerable, Ownable {
  uint256 private _price;
  uint256 private _limit;
  string private _baseURIString;
  using Counters for Counters.Counter;
  Counters.Counter public tokenIdTracker;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseURI,
    uint256 limit,
    uint256 price
  ) ERC721(name, symbol) {
    _limit = limit;
    _price = price;
    _baseURIString = baseURI;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURIString;
  }

  function mint(uint256 amount) public payable {
    require(msg.value == _price * amount, "Must send correct price");
    require(
      tokenIdTracker.current() + amount <= _limit,
      "Not enough in the collection left to mint amount"
    );
    for (uint256 i = 0; i < amount; i++) {
      _mint(msg.sender, tokenIdTracker.current());
      tokenIdTracker.increment();
    }
  }
}
