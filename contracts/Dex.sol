// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract DEX {
    IERC20 public associatedToken;

    uint price;
    address owner;

    constructor(IERC20 _token, uint _price){
        associatedToken = _token;

        price = _price;
        owner = msg.sender;
    }

    modifier onlyOwner{
        require(msg.sender == owner, "Only Owner of contract can sell");
        _;
    }

    function sell() external onlyOwner{
        uint allowance = associatedToken.allowance(msg.sender, address(this));
        require(allowance > 0, "You must allow this contract access to at least one token");

        bool sent = associatedToken.transferFrom(msg.sender, address(this), allowance);
        require(sent, "Fail to send");
    }

    function withdrawTokens() external onlyOwner{
        uint balance = associatedToken.balanceOf(address(this));
        associatedToken.transfer(msg.sender, balance);
    }

    function withdrawFunds() external onlyOwner {
        (bool sent,) = payable(msg.sender).call{value: address(this).balance}("");
        require(sent);
    }

    function getPrice(uint numOfTokens) public view returns (uint){
        return numOfTokens * price;
    }


    function buy(uint numOfTokens) external payable {
        require(numOfTokens <= getTokenBal(), "Not enough tokens");

        uint priceForTokens = getPrice(numOfTokens);
        require(msg.value == priceForTokens, "Invalid value sent");

        associatedToken.transfer(msg.sender, numOfTokens);
    }

    function getTokenBal() public view returns (uint) {
        return associatedToken.balanceOf(address(this));
    }
}