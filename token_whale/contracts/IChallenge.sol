pragma solidity ^0.8.13;

interface IChallenge {

    function isComplete() external returns(bool);

    function transfer(address to, uint256 value) external;

    function approve(address spender, uint256 value) external;

    function transferFrom(address from, address to, uint256 value) external;
}