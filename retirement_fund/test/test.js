const { expect } = require("chai");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
const { BigNumber } = ethers;

describe("Lock", () => {
// We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  
  let solution;
  let deployer;
  let otherSigner;
  let challenge;
  let challengeOverrides = {
    value: ethers.utils.parseEther("1")
  }
  let solutionOverrides = {
    value: ethers.utils.parseEther("0.001")
  }

  before(async () => {
    [deployer, otherSigner] = await ethers.getSigners()
  })

  beforeEach(async () => {
    let Challenge = await ethers.getContractFactory("RetirementFundChallenge")
    let Solution = await  ethers.getContractFactory("Solution")
    challenge = await Challenge.deploy(deployer.address, challengeOverrides)
    solution = await Solution.deploy(challenge.address, solutionOverrides)
  })

  it("Overflowing challenge contract with ether sent on selfdestruction", async () => {
    let beforeBalance = await ethers.provider.getBalance(challenge.address)
    await solution.overflowChallenge()
    let afterBalance = await ethers.provider.getBalance(challenge.address)

    expect(afterBalance).to.be.greaterThan(beforeBalance)

    let myBeforeBalance = await ethers.provider.getBalance(deployer.address)
    await challenge.collectPenalty()
    let myAfterBalance = await ethers.provider.getBalance(deployer.address)

    expect(myAfterBalance).to.be.greaterThan(myBeforeBalance)
  })
})