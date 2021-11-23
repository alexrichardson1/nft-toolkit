// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721Enumerable, Ownable {
  address public artist;
  uint256 private _price;
  uint256 public collectionLimit;
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
    artist = msg.sender;
    collectionLimit = limit;
    _price = price;
    _baseURIString = string(
      abi.encodePacked(baseURI, "0x", toAsciiString(address(this)), "/")
    );
  }

  function char(bytes1 b) internal pure returns (bytes1 c) {
    if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
    return bytes1(uint8(b) + 0x57);
  }

  function toAsciiString(address x) internal pure returns (string memory) {
    bytes memory s = new bytes(40);
    for (uint256 i = 0; i < 20; i++) {
      bytes1 b = bytes1(uint8(uint256(uint160(x)) / (2**(8 * (19 - i)))));
      bytes1 hi = bytes1(uint8(b) / 16);
      bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
      s[2 * i] = char(hi);
      s[2 * i + 1] = char(lo);
    }
    return string(s);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURIString;
  }

  function mint(uint256 amount) public payable {
    require(msg.value == _price * amount, "Must send correct price");
    require(
      tokenIdTracker.current() + amount <= collectionLimit,
      "Not enough in the collection left to mint amount"
    );
    for (uint256 i = 0; i < amount; i++) {
      _mint(msg.sender, tokenIdTracker.current());
      tokenIdTracker.increment();
    }
  }
}
