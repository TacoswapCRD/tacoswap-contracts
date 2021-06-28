const { WETH } = require("@sushiswap/sdk")
const { bytecode } = require('./../../artifacts/cache/solpp-generated-contracts/tacoswapv2/TacoswapV2Pair.sol/TacoswapV2Pair.json')
const { keccak256 } = require('@ethersproject/solidity')
const { ethers, getChainId } = require("hardhat");
const { utils } = ethers;

const COMPUTED_INIT_CODE_HASH = keccak256(['bytes'], [bytecode])

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, execute, get } = deployments;
  const { deployer, bob } = await getNamedAccounts();
  const chainId = await getChainId();
  let wethAddress;

  if (chainId === '31337') {
    wethAddress = (await get("WETH9Mock")).address
  } else if (chainId in WETH) {
    wethAddress = WETH[chainId].address
  } else {
    throw Error("No WETH!")
  }

  const factoryAddress = (await get("TacoswapV2Factory")).address

  await deploy("TacoswapV2Router02", {
    from: deployer,
    args: [factoryAddress, wethAddress],
    log: true,
    deterministicDeployment: false
  })

  if (chainId === '31337') {
    const amount = utils.parseEther("5");
    const deadline = new Date().getTime() + 10;
    const router = await get("TacoswapV2Router02")
    const factory = await ethers.getContract("TacoswapV2Factory");

    this.signers = await ethers.getSigners()
    this.deployer = this.signers[0];

    tx1 = await deploy("ERC20Mock", {
      from: bob,
      args: ["TokenA", "TA", "100000000000"],
      log: true,
      deterministicDeployment: false
    });
    
    tx2 = await deploy("ERC20Mock", {
      from: bob,
      args: ["TokenB", "TB", "100000000009"],
      log: true,
      deterministicDeployment: false
    });


    const tokenA = await ethers.getContractAt("ERC20Mock", tx1.address, bob);
    const tokenB = await ethers.getContractAt("ERC20Mock", tx2.address, bob);
    
    tx = await tokenA.approve(router.address, "100000000000")
    await tokenB.approve(router.address, "100000000000")

    await execute( // execute function call on contract
      "TacoswapV2Router02",
      {from: bob, value: amount},
      "addLiquidityETH",
      ...[
        tokenA.address,
        "100000000000",
        0,
        0,
        deployer,
        deadline
      ]
    )


    await execute( // execute function call on contract
      "TacoswapV2Router02",
      {from: bob, value: amount},
      "addLiquidityETH",
      ...[
        tokenB.address,
        "100000000000",
        0,
        0,
        deployer,
        deadline
      ]
    )
    
    await factory.createPair(tokenA.address, tokenB.address)   
  }
}

module.exports.tags = ["TacoswapV2Router02", "DEX"]
module.exports.dependencies = ["TacoswapV2Factory"]
