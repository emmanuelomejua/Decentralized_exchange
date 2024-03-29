// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(uint initalSupply) ERC20("TimCoin", "TIM"){
        _mint(msg.sender, initalSupply);
    }
}