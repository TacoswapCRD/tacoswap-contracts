import BigNumber from 'bignumber.js'
import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers'
import { ReactComponent as LogoEthereum } from '../assets/logos/logos_ethereum.svg'
import { UTacoTokenContext } from '../hardhat/SymfoniContext'
// import logoEthereum from '../assets/logos/logos_ethereum.svg'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80
})

// const GAS_LIMIT = {
//   STAKING: {
//     DEFAULT: 200000,
//     SNX: 850000,
//   },
// }

export const getMasterChefAddress = utaco => {
  return utaco && utaco.masterChefAddress
}
export const getSushiAddress = utaco => {
console.log("🚀 ~ file: utils.js ~ line 23 ~ getSushiAddress", getSushiAddress)
  return utaco && utaco.sushiAddress
}
export const getWethContract = utaco => {
  return utaco && utaco.contracts && utaco.contracts.weth
}

export const getMasterChefContract = utaco => {
  return utaco && utaco.contracts && utaco.contracts.masterChef
}

export const getSushiContract = utaco => {
console.log("🚀 ~ file: utils.js ~ line 34 ~ getSushiContract", getSushiContract)
  return utaco && utaco.contracts && utaco.contracts.utaco
}

export const getFarms = utaco => {
  return utaco
    ? utaco.contracts.pools.map(
        ({
          pid,
          name,
          symbol,
          icon,
          quoteIcon = <LogoEthereum />,
          // quoteIcon = <img src={logoEthereum} style={{ maxWidth: '100%' }} alt="Tacoswap.io" />,
          tokenAddress,
          quoteTokenAddress,
          tokenSymbol,
          quoteTokenSymbol = 'ETH',
          tokenContract,
          quoteTokenContract,
          lpAddress,
          lpContract,
          active,
          price
        }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          quoteTokenAddress,
          tokenSymbol,
          tokenContract,
          quoteTokenContract,
          quoteTokenSymbol,
          earnToken: 'TACO',
          earnTokenAddress: utaco.contracts.utaco.options?.address,
          icon,
          quoteIcon,
          active,
          price,
          notLP: tokenAddress === lpAddress
        })
      )
    : []
}

export const getPoolWeight = async (masterChefContract, pid) => {
  const { allocPoint } = await masterChefContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await masterChefContract.methods.totalAllocPoint().call()
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (masterChefContract, pid, account) => {
  return masterChefContract.methods.pendingUTaco(pid, account).call()
}

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256.toString())
    .send({ from: account })
}

export const getSushiSupply = async () => {
  // const utacoToken = useContext(UTacoTokenContext);
  // const burned = new BigNumber(250)
  // return new BigNumber(await utacoToken.totalSupply().call()).minus(
  //   burned.multipliedBy(new BigNumber(10).pow(18))
  // )
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', tx => {
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', tx => {
      return tx.transactionHash
    })
}
export const harvest = async (masterChefContract, pid, account) => {
  console.log(masterChefContract.methods.deposit(pid, '0'))
  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', tx => {
      return tx.transactionHash
    })
}

export const getStaked = async (masterChefContract, pid, account) => {
  try {
    const { amount } = await masterChefContract.methods.userInfo(pid, account).call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const redeem = async (masterChefContract, account) => {
  const now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return masterChefContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', tx => {
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}
