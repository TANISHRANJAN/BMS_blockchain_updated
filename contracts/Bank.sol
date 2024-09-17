// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    mapping(address => uint256) private balances;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action.");
        _;
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit must be greater than zero.");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance.");
        payable(msg.sender).transfer(amount);
        balances[msg.sender] -= amount;
    }

    function checkBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function totalFunds() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }
}
