require("@nomicfoundation/hardhat-toolbox");

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
  network: {
    local: {
      url: 'http://127.0.0.1:8545/'
    }
  }
};
