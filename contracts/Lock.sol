// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    uint public variable;

    function withdraw() public {
        variable = 1;
    }
}
