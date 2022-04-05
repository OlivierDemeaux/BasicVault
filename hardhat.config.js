require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const ethers = require('ethers');
const credentials = require('./credentials.js');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  defaultNetwork: "hardhat",
  networks: {
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [credentials.privateKey],
    },
    local: {
      url: `http://127.0.0.1:8545/`,
    },
    hardhat: {

    },
    kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/${credentials.alchemy}`,
      accounts: [credentials.privateKey],
    },
  },
  etherscan: {
    apiKey: credentials.etherscan
  }
};
