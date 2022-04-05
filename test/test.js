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
    const balance = await myVault.getEthBalance();
    assert.equal(balance, 0);
  });

  it('Should transfer Eth to vault and vault should convert ETH to wEth', async () => {
    const accounts = await hre.ethers.getSigners();
    const sender = accounts[1];
    const wEthBalancePre = await myVault.getWethBalance()
    console.log(wEthBalancePre);
    // assert.equal(wEthBalancePre, 0);
    console.log('Transfering ETH from: ', sender.address);
    // await sender.sendTransaction({
    //   to: myVault.address,
    //   value:ethers.utils.parseEther('0.01'),
    // })
    // await myVault.wrapETH();
    // const wEthBalancePost = await myVault.getWethBalance()
    // assert.isAbove(wEthBalancePost, 0);
  })
});