// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const Care4CrisisDonation = await hre.ethers.getContractFactory("Care4CrisisDonation");
  
  // Deploy the contract
  const donation = await Care4CrisisDonation.deploy();
  
  // Wait for the contract to be deployed
  await donation.waitForDeployment();
  
  // Get the contract address
  const contractAddress = await donation.getAddress();
  
  console.log(`Care4CrisisDonation deployed to: ${contractAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 