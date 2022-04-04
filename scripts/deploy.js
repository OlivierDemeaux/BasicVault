const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const contractName = 'myVault';
  await hre.run("compile");
  const smartContract = await hre.ethers.getContractFactory(contractName);
  const myVault = await smartContract.deploy();
  await myVault.deployed();
  console.log(`${contractName} deployed to: ${myVault.address}`);
}