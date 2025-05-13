require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    // Local hardhat network
    hardhat: {},
    // Sepolia testnet configuration
    sepolia: {
      url: process.env.ALCHEMY_API_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  // Add Etherscan verification config if needed
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};
