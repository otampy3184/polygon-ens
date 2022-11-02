require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: process.env.API_KEY,
      accounts: [process.env.SECRET_KEY],
    },
    mumbai: {
      url: process.env.API_KEY_MUM,
      accounts: [`0x${process.env.SECRET_KEY}`],
    },
  },
};
