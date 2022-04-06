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

  it('Should transfer Eth to vault and vault should convert ETH to wEth', async () => {
    const accounts = await hre.ethers.getSigners();
    const sender = accounts[1];
    console.log('Transfering ETH from: ', sender.address);
    await sender.sendTransaction({
      to: myVault.address,
      value:ethers.utils.parseEther('1'),
    })
    await myVault.wrapETH();
    await myVault.updateEthPriceUniswap();
    await myVault.rebalance();
    const daiBalance = await myVault.getDaiBalance();
    console.log('Rebalanced DAI Balance',daiBalance.toString());
    assert.isAbove(daiBalance,0);
  })
});