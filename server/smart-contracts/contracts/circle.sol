// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Circle is ERC20 {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

  function mint(uint256 amount) external payable {
    _mint(msg.sender, amount);
  }
}
