# FullcoverageTest
This repo contains an example of full coverage test of smart contract PrivateBank.sol using HardHat.

# How to implement a full coverage test with HardHat:
1. Install hardhat

`C:\hardhatCoverageTests>npm install --save-dev hardhat `

2. Copy you smart contract in /contracts/
3. Create a js file with name like {contract-name}.test.js in /test, and implement the test for full coverage test your smart contract.
4. Execute tests:

`C:\hardhatCoverageTests>npx hardhat test`

# What is a full coverage test?
The main purpose of full coverage test is validate all the code of a piece of software: every method, and reproduce every possible code flow when things go well, and also when things go bad (including exceptions).

For this smart contract:

```
pragma solidity 0.8.20;

// SPDX-License-Identifier: MIT

contract PrivateBank {
    mapping(address => uint256) private balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 balance = getUserBalance(msg.sender);

        require(balance > 0, "Insufficient balance");

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Failed to send Ether");

        balances[msg.sender] = 0;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getUserBalance(address _user) public view returns (uint256) {
        return balances[_user];
    }
}
```
you should provide tests for every method (deposit, withdraw, getBalance, getUserBalance), verifying state changes and returned values. 
The withdraw method has some different flows, so you should do test for every flow. by testing withdraw() when balance, and withdraw() when no balance.



