// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
  uint256 private _limit;

  constructor(
    string memory name,
    string memory symbol,
    uint256 limit
  ) ERC721(name, symbol) {
    _limit = limit;
  }

  function setTokenURI(uint256 tokenId, string memory _tokenURI) external {
    _setTokenURI(tokenId, _tokenURI);
  }
}
