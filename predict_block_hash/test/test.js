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
    [deployer, noDeployer] = await ethers.getSigners()
  })

  beforeEach(async () => {
    const Challenge = await ethers.getContractFactory("PredictTheBlockHashChallenge")
    const Predictor = await ethers.getContractFactory("DumbPredictor")

    challenge = await Challenge.deploy(overrides)
    predictor = await Predictor.deploy(challenge.address)
  })

  it("Lock in block hash to be predicted", async () => {

    await expect(predictor.lockGuess(overrides))
      .to.emit(predictor, "LockInSuccess")
      .withArgs(true);

    let predictorBalance = await ethers.provider.getBalance(challenge.address)
    
    expect(predictorBalance).to.equal(await ethers.utils.parseEther("2"))

  });

  it("predict hash block after 256 blocks", async () => {
    let blocks = 260;

    await predictor.lockGuess(overrides)

    for(let i = 0; i<= blocks; i++) {

      let block = await ethers.provider.getBlock();
      await predictor.dummyBlockIterator()
      console.log("Block number is: ", block.number)
    }

    await predictor.settle()
    let predictorBalance = await ethers.provider.getBalance(predictor.address)

    expect(predictorBalance).to.equal(ethers.utils.parseEther("2.0"))

    let beforeSignerBalance = await ethers.provider.getBalance(deployer.address);

    await predictor.withdraw()

    let afterSignerBalance = await ethers.provider.getBalance(deployer.address);

    let [prevBalanceInt] = await ethers.utils.formatEther(beforeSignerBalance).split(".")
    let [afterBalanceInt] = await ethers.utils.formatEther(afterSignerBalance).split(".")
    
    let difference = (parseInt(afterBalanceInt) - parseInt(prevBalanceInt)).toString()

    expect(await ethers.utils.parseUnits(difference, "ether")).to.equal(await ethers.utils.parseEther("2"))

  })
});
