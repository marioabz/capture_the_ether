const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Guesser", () => {

  let guesser;
  let challenge;
  let deployer;
  const overrides = {
    value: ethers.utils.parseEther("1.0")
  }

  before(async () => {
    [deployer] = await ethers.getSigners()
  })

  beforeEach(async () => {
    const Challenge = await ethers.getContractFactory("GuessTheNewNumberChallenge");
    const Guesser = await ethers.getContractFactory("Guessor")
    challenge = await Challenge.deploy(overrides);
    guesser = await Guesser.deploy(challenge.address);
  });

  it("should be deployed with balance of 1 Ether", async () => {
    let balance = await ethers.provider.getBalance(challenge.address)
    let expectedBalance = await ethers.utils.parseEther("1.0")
    expect(balance).to.equal(expectedBalance);
  });

  it("should execute guesser.solveChallenge and return 2 Eth to user", async () => {
    let challengeInitBalance = await ethers.provider.getBalance(challenge.address);
    const _value = await ethers.utils.parseEther("1.0")
    await guesser.solveChallenge({value: _value})
    let challengeEndBalance = await ethers.provider.getBalance(challenge.address);
    expect(challengeEndBalance).to.equal(await ethers.utils.parseEther("0"))
  })

});
