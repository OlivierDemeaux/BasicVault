const { ethers } = require('hardhat');
const hre = require('hardhat');
const assert = require('chai').assert;

describe('myVault', () => {
  let myVault;

  beforeEach(async function () {
    const contractName = 'myVault';
    await hre.run("compile");
    const smartContract = await hre.ethers.getContractFactory(contractName);
    myVault = await smartContract.deploy();
    await myVault.deployed();
    console.log(`${contractName} deployed to: ${myVault.address}`);
  });

  it('Should return the correct version', async () => {
    const version = await myVault.version();
    assert.equal(version,1);
  });

  it('Should return the correct balance in ETH', async () => {
    const balance = await myVault.getVaultBalance();
    assert.equal(balance, 0);
  });

  it('Should send eth from the address to the vault', async () => {
      const accounts = await hre.ethers.getSigners();
      const owner = accounts[0];
      await myVault.depositToVault({value: 1});
      const balance = await myVault.getVaultBalance();
      assert.equal(balance, 1);
  })
});