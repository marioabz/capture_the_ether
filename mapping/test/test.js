const { expect } = require("chai")
const { ethers } = require("hardhat")
const { BigNumber } = ethers


describe("Solution to overflow storage slots", () => {

  let signer;
  let otherSigner;
  let challenge;
  let solution;
  
  before(async () => {
    [signer, otherSigner] = await ethers.getSigners()
  })

  beforeEach(async () => {
    let Challenge = await ethers.getContractFactory("MappingChallenge")
    let Solution = await ethers.getContractFactory("Solution")
    challenge = await Challenge.deploy()
    solution = await Solution.deploy(challenge.address)
  })

  it("overflows contract", async () => {
    await solution.overFLowChallenge()
    let storageOverflow = await solution.overflown()

    expect(storageOverflow).to.be.true
  })

})

