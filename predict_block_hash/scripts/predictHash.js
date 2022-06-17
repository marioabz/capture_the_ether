const hre = require("hardhat")
const { BigNumber } = hre.ethers
require("dotenv").config()

let oldBlock;
let newBlock;
const challengeAddress = process.env.CHALLENGE

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const main = async () => {

    console.log("Initialized script")
    oldBlock = await hre.ethers.provider.getBlockNumber()
    newBlock = oldBlock

    let Predictor = await hre.ethers.getContractFactory("DumbPredictor")
    let signer = await hre.ethers.getSigner()
    let predictor = new hre.ethers.Contract(
        process.env.PREDICTOR,
        Predictor.interface,
        signer
    )
    const overrides = {
        value: hre.ethers.utils.parseEther("1")
    }
    console.log("Initializing loop")
    while (newBlock <= oldBlock + 260) {

        console.log("number of blocks till transaction can be processed: ", oldBlock+260-newBlock)
        newBlock = await hre.ethers.provider.getBlockNumber()
        await sleep(5000)
    }

    let preSettleTx = await predictor.settle()
    let settleTx = await preSettleTx.wait()

    console.log("Settling transaction hash to challenge from predictor")

    let preWithdrawTx = await predictor.withdraw()
    let withdrawTx = await preWithdrawTx.wait()

    console.log("Transaction hash of withdrawal is: ", withdrawTx.transactionHash)

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
