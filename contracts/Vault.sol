// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "hardhat/console.sol";


contract myVault {
    uint public version = 1;

    event Deposit(address, uint);
    
    constructor() {
        console.log('Deploying myVault Version:', version);
        console.log('Deployed by:', msg.sender);
    }

    function depositToVault() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function getVaultBalance() external view returns(uint) {
        return address(this).balance;
    }
}