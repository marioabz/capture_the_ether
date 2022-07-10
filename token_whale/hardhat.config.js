require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const KEY = process.env.PK
const ENDPOINT = process.env.ENDPOINT

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.4.22"
      },
      {
        version: "0.8.13"
      }
    ]
  },
  networks: {
    ropsten: {
      url: ENDPOINT,
      accounts: [KEY],
    },
    local: {
      url: "http://127.0.0.1:8545/",
      aacounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80']
    }
  }
};
