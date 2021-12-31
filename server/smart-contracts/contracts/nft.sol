// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./ERC2981/ERC2981ContractWideRoyalties.sol";

/** @title NFT Collection Contract
 *  @notice NFT Collection
 */
contract NFT is ERC721Enumerable, Ownable, ERC2981ContractWideRoyalties {
  uint256 public price;
  uint256 public collectionLimit;
  string private _baseURIString;
  string public contractURI;
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
    uint256 _price,
    uint256 royalty
  ) ERC721(name, symbol) {
    collectionLimit = limit;
    price = _price;
    _baseURIString = string(
      abi.encodePacked(baseURI, "0x", toAsciiString(address(this)), "/")
    );
    contractURI = string(abi.encodePacked(_baseURIString, "contract/data"));
    _setRoyalties(msg.sender, royalty);
  }

  /**
   * @notice Convert from byte to character
   * @param b Byte to convert
   */
  function char(bytes1 b) private pure returns (bytes1 c) {
    if (uint8(b) < 10) {
      return bytes1(uint8(b) + 0x30);
    }
    return bytes1(uint8(b) + 0x57);
  }

  /**
   * @notice Convert from address to string
   * @param x Address to convert
   */
  function toAsciiString(address x) private pure returns (string memory) {
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

  /// @inheritdoc	ERC165
  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721Enumerable, ERC2981Base)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
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
  function mint(uint256 amount) external payable {
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

  function withdraw() external onlyOwner {
    payable(owner()).transfer(address(this).balance);
  }
}
