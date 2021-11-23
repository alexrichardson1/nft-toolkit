// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/** @title NFT Collection Contract
 *  @notice NFT Collection
 */
contract NFT is ERC721Enumerable, Ownable {
  address public artist;
  uint256 public price;
  uint256 public collectionLimit;
  string private _baseURIString;
  using Counters for Counters.Counter;
  Counters.Counter public tokenIdTracker;

  /**
   * @notice Construct a new NFT Collection
   * @param name The name of the collection
   * @param symbol The symbol for the collection
   * @param baseURI baseURI for the NFT collection
   */
  constructor(
    string memory name,
    string memory symbol,
    string memory baseURI,
    uint256 limit,
    uint256 _price
  ) ERC721(name, symbol) {
    artist = msg.sender;
    collectionLimit = limit;
    price = _price;
    _baseURIString = baseURI;
  }

  /**
   * @return The baseURI for the NFT collection
   */
  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURIString;
  }

  /**
   * @notice Mint a number of NFTs
   * @param amount The number of NFTs to mint
   */
  function mint(uint256 amount) public payable {
    require(msg.value == price * amount, "Must send correct price");
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
