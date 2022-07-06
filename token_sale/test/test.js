const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("Greeter", function () {
  let challenge;
  let solution;
  let signer;
  let otherSigner;

  let overrides = {
    value: ethers.utils.parseEther("1.0")
  }

  before(async () => {
    [signer, otherSigner] = await ethers.getSigners()
  })

  beforeEach(async () => {
    let Challenge = await ethers.getContractFactory("TokenSaleChallenge")
    let Solution = await ethers.getContractFactory("Solution")
    challenge = await Challenge.deploy(otherSigner.address, overrides)
    solution = await Solution.deploy(challenge.address)
  })

  it(
    "should test that challenge was solved and ether was \
    returned to solution contract", async () => {

      let requiredValue = await solution.getEtherAmount()

      let overrides = {
        value: requiredValue
      }

      let tx = await solution.solveChallenge(overrides)

      let solutionBalance = await ethers.provider.getBalance(solution.address)
      let isCompleted = await challenge.isComplete()

      expect(solutionBalance).to.equal(await ethers.utils.parseEther("1"))
      expect(isCompleted).to.true;
  })

});
