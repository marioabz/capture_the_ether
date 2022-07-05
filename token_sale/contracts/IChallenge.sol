pragma solidity ^0.8.13;

interface IChallenge {

    function isComplete() external returns (bool);

    function buy(uint256 numTokens) external payable;

    function sell(uint256 numTokens) external;
}