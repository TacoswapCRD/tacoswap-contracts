const { expect } = require("chai");
const { ethers, network, deployments } = require("hardhat");
const { getNamedSigners } = ethers;
const { deployContract, MockProvider, solidity } = require('ethereum-waffle');

const UsdcWethUniPairAddress = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc";
const uniRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const sushiRouterAddress = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

let accounts;

describe("eTacoRoll", function () {
  before(async () => {
    accounts = await getNamedSigners();
    this.deadline = new Date().getTime() + 10;
    await deployments.fixture();

    this.provider = await ethers.getContractAt("ILiquidityProvider", "0x5460CD29415F811dd9dD5BeD52aA1a56a5bac181");
    this.eTacoFactory = await ethers.getContract("TacoswapV2Factory", accounts.caller);
    this.uniRouter = await ethers.getContractAt("ITacoswapV2Router02", uniRouterAddress, accounts.caller);
    this.sushiRouter = await ethers.getContractAt("ITacoswapV2Router02", sushiRouterAddress, accounts.caller);
    this.uniFactory = await ethers.getContractAt("ITacoswapV2Factory", await this.uniRouter.factory(), accounts.caller);
    this.sushiFactory = await ethers.getContractAt("ITacoswapV2Factory", await this.sushiRouter.factory(), accounts.caller);
    this.eTacoRoll = await ethers.getContract("eTacoRoll", accounts.caller);
    this.weth = await this.uniRouter.WETH();


    const sushiPair = await this.sushiFactory.getPair(USDC, this.weth);
    this.UsdcWethUni = await ethers.getContractAt("ITacoToken", UsdcWethUniPairAddress, accounts.caller);
    this.UsdcWethSushi = await ethers.getContractAt("ITacoToken", sushiPair, accounts.caller);

    await this.provider.connect(accounts.bob).addLiquidityETH(USDC, accounts.bob.address, 0, 0, 0, this.deadline, 0, { value: ethers.utils.parseEther("10") });
    await this.provider.connect(accounts.holder).addLiquidityETH(USDC, accounts.holder.address, 0, 0, 0, this.deadline, 2, { value: ethers.utils.parseEther("10") });
  })

  it("Should migrate: Migrate LP tokens from Uniswap and SushiSwap", async () => {
    let lpUni = await this.UsdcWethUni.balanceOf(accounts.bob.address)
    let lpSushi = await this.UsdcWethSushi.balanceOf(accounts.holder.address)

    await this.UsdcWethUni.connect(accounts.bob).approve(this.eTacoRoll.address, lpUni)
    await this.eTacoRoll.connect(accounts.bob).migrate(USDC, this.weth, this.uniFactory.address, lpUni, 0, 0, this.deadline);

    await this.UsdcWethSushi.connect(accounts.holder).approve(this.eTacoRoll.address, lpSushi);
    await this.eTacoRoll.connect(accounts.holder).migrate(USDC, this.weth, this.sushiFactory.address, lpSushi, 0, 0, this.deadline);

    const eTacoPair = await this.eTacoFactory.getPair(USDC, this.weth);
    const UsdcWetheTaco = await ethers.getContractAt("ITacoToken", eTacoPair, accounts.caller);

    expect(await this.UsdcWethUni.balanceOf(accounts.bob.address))
      .to.equal(ethers.constants.Zero);

    expect(await UsdcWetheTaco.balanceOf(accounts.bob.address))
      .to.not.equal(ethers.constants.Zero);

    expect(await this.UsdcWethSushi.balanceOf(accounts.holder.address))
      .to.equal(ethers.constants.Zero);

    expect(await UsdcWetheTaco.balanceOf(accounts.holder.address))
      .to.not.equal(ethers.constants.Zero);
  })

})