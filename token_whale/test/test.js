const { expect } = require("chai");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
const { BigNumber } = ethers;

describe("Solutions", () => {

  let challenge;
  let solution;
  let signer;
  let otherSigner;

  before(async () => {
    [signer, otherSigner] = await ethers.getSigners()
  })

  beforeEach(async () => {
    let Challenge = await ethers.getContractFactory("TokenWhaleChallenge")
    let Solution = await ethers.getContractFactory("Solution")
    challenge = await Challenge.deploy(signer.address)
    solution = await Solution.deploy(challenge.address, signer.address)
  })

  it("Solve challenge by underflowing tokens from contract", async () => {
    

    await challenge.approve(solution.address, 10**6);
    
    await solution.underFlowSenderTokens();

    let signerBalance = await challenge.balanceOf(signer.address)

    expect(signerBalance).to.equal(await ethers.utils.parseUnits("1.0", 6))
  })

})