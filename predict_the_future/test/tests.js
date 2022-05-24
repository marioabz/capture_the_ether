const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {

  let deployer;
  let challenge;
  let predictor;
  const overrides = {
    value: ethers.utils.parseEther("1.0")
  }

  before(async () => {
    [deployer, noDeployer] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const Challenge = await ethers.getContractFactory("PredictTheFutureChallenge");
    const Predictor = await ethers.getContractFactory("Predictor");
    challenge = await Challenge.deploy(overrides);
    predictor = await Predictor.deploy(challenge.address);
  });

  it("should lock a number by Predictor contract", async () => {

    await predictor.lockNumber(overrides);
    let challengeBalance = await ethers.provider.getBalance(challenge.address);

    expect(challengeBalance).to.equal(await ethers.utils.parseEther("2.0"))
  })

});
