// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/*
@title myVault
@license MIT
@author Olivier Demeaux
@notice A vault allow donation, withdraw and auto-investment strategy as a hedge against volatility.
*/

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol';

// EACAggregatorProxy is used for chainlink oracle
interface EACAggregatorProxy {
  function latestAnswer() external view returns (int256);
}

// Uniswap v3 interface
interface IUniswapRouter is ISwapRouter {
  function refundETH() external payable;
}

// Add deposit function for WETH
interface DepositableERC20 is IERC20 {
  function deposit() external payable;
}


contract myVault {
    uint public version = 1;

    /* Kovan Addresses */
    address public daiAddress = 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa;
    address public wethAddress = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;
    address public uinswapV3QuoterAddress = 0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6;
    address public uinswapV3RouterAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address public chainLinkETHUSDAddress = 0x9326BFA02ADD2366b30bacB125260Af641031331;

    uint public ethPrice = 0;                   //needs to be set to 0 and will be updated by Oracle
    uint public usdTargetPrecentage = 40;       //40% of the fund will be DAI for hedge against volatility
    uint public usdDividendPercentage = 25;      //Allow withdraw of 25% of the 40% of DAI, so 10% of total value
    uint public dividendFrequency = 3 minutes;   //change to 1 year for prod
    uint public nextDividendTS;
    address public owner;

    using SafeERC20 for IERC20;
    using SafeERC20 for DepositableERC20;

    IERC20 daiToken = IERC20(daiAddress);
    DepositableERC20 wethToken = DepositableERC20(wethAddress);
    IQuoter quoter = IQuoter(uinswapV3QuoterAddress);
    IUniswapRouter uniswapRouter = IUniswapRouter (uinswapV3RouterAddress);

    event Deposit(address, uint);
    event myVaultLog(string msg, uint ref);
    
    constructor() {
        console.log('Deploying myVault Version:', version);
        nextDividendTS = block.timestamp + dividendFrequency;
        owner = msg.sender;
    }

    function getDaiBalance() public view returns(uint) {
        return daiToken.balanceOf(address(this));
    }

    function getWethBalance() public view returns(uint) {
        return wethToken.balanceOf(address(this));
    }

    function getEthBalance() external view returns(uint) {
        return address(this).balance;
    }

    receive() external payable {
        // accept ETH, do nothing as it would break the gas fee for a transaction
    }

    function wrapETH() public {
        require(msg.sender == owner, "Only the owner can convert ETH to WETH");
        uint ethBalance = address(this).balance;
        require(ethBalance > 0, "No ETH available to wrap");
        emit myVaultLog('wrapETH', ethBalance);
        wethToken.deposit{ value: ethBalance }();
    }
}