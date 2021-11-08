// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721Enumerable, Ownable {
  address public artist;
  uint256 private _price;
  uint256 private _limit;
  string private _baseURIString;
  using Counters for Counters.Counter;
  Counters.Counter public tokenIdTracker;

  constructor(
    string memory name,
    string memory symbol,
    address _artist,
    string memory baseURI,
    uint256 limit,
    uint256 price
  ) ERC721(name, symbol) {
    artist = _artist;
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

  /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
  ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
  ///  THEY MAY BE PERMANENTLY LOST
  /// @param _from The current owner of the NFT
  /// @param _to The new owner
  /// @param _tokenId The NFT to transfer
  function transferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  ) external payable {
    require(msg.sender == ownerOf(_tokenId), "You do not own this NFT");
    require(_from == ownerOf(_tokenId), "You do not own this NFT");
    // TODO: royalty for artist
    // TODO: transfer ownership
  }
}
