const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("Challenge", function () {

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

    /*
        let filter = {
        address: predictor.address,
        topics: [
          ethers.utils.id("LockInNumberSuccess(bool)")
        ]
      }
    */
  })

  it("predictor contract has a balance of 2 Ether", async () => {

    await predictor.lockNumber(overrides);

    while(true) {
      let blockNumber = (await ethers.provider.getBlock()).number;
      try {

        await predictor.dummyBlockIterator();
        await predictor.solveChallenge();
        break;
      } catch(error) {

        console.log("Transaction failed at block: ", blockNumber);
      }
    }
    let predictorBalance = await ethers.provider.getBalance(predictor.address);
    let challengeBalance = await ethers.provider.getBalance(challenge.address);

    expect(challengeBalance).to.equal(await ethers.utils.parseEther("0"))
    expect(predictorBalance).to.equal(await ethers.utils.parseEther("2.0"))
  });

  it("Users gets his Ether back", async () => {
    await predictor.lockNumber(overrides);

    while(true) {
      let blockNumber = (await ethers.provider.getBlock()).number;
      try {

        await predictor.dummyBlockIterator();
        await predictor.solveChallenge();
        break;
      } catch(error) {

        console.log("Transaction failed at block: ", blockNumber);
      }
    }
    let prevUserBalance = await ethers.provider.getBalance(deployer.address);
    await predictor.withdraw();
    let newUserBalance = await ethers.provider.getBalance(deployer.address);

    let [prevBalanceInt] = ethers.utils.formatEther(prevUserBalance).split(".")
    let [nextBalanceInt] = ethers.utils.formatEther(newUserBalance).split(".")

    let difference = (parseInt(nextBalanceInt) -  parseInt(prevBalanceInt)).toString()

    expect(ethers.utils.parseUnits(difference, "ether")).to.equal(await ethers.utils.parseEther("2"));
  })

});
