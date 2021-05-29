const { expect } = require("chai");
const { deployments, network, ethers } = require("hardhat");
const { utils, getContract, getContractFactory, getNamedSigners } = ethers;
const { addresses } = require("../helpers")

const amount = utils.parseEther("10");
const deadline = new Date().getTime() + 10;
let accounts;

xdescribe("TestToken contract: ", function () {
    before("Before All: ", async () => {
        accounts = await getNamedSigners();
        this.token = await getContract("TestToken", accounts.caller);
        this.provider = await ethers.getContractAt("ILiquidityProvider", addresses.providerAddress, accounts.caller);
        this.uniRouter = await ethers.getContractAt("IUniswapV2Router02", addresses.UNISWAP_V2_ROUTER_02, accounts.caller);
        this.uniFactory = await ethers.getContractAt("IUniswapV2Factory", addresses.UNISWAP_V2_FACTORY, accounts.caller);
        
        this.dai = await ethers.getContractAt("IERC20", addresses.DAI, accounts.caller)
        this.aave = await ethers.getContractAt("IERC20", addresses.AAVE, accounts.caller)
        
        wethDaiAddress = await this.uniFactory.getPair(addresses.DAI, this.uniRouter.WETH())
        daiAaveAddress = await this.uniFactory.getPair(addresses.DAI, addresses.AAVE)
        this.wethDai = await ethers.getContractAt("IUniswapV2Pair", wethDaiAddress)
        this.daiAave = await ethers.getContractAt("IUniswapV2Pair", daiAaveAddress)
    })

    it("Should mint and burn test tokens: ", async () => {
        await this.token.connect(accounts.owner).mint(accounts.vzgo.address, amount)
        expect(await this.token.balanceOf(accounts.vzgo.address)).to.equal(amount)

        await this.token.connect(accounts.vzgo).burn(amount.div(2))
        expect(await this.token.balanceOf(accounts.vzgo.address)).to.equal(amount.div(2))

        await this.token.connect(accounts.vzgo).approve(accounts.caller.address, amount.div(2))
        await this.token.burnFrom(accounts.vzgo.address, amount.div(2))
        expect(await this.token.balanceOf(accounts.vzgo.address)).to.equal(0)
    })

    it("Proxy pre deployed contract test: ", async () => {
        await this.provider
            .addLiquidityETH(
                addresses.DAI,
                accounts.holder.address,
                0,
                0,
                0,
                deadline,
                0,
                { value: amount }
            )
        
        holderBalance = await this.wethDai.balanceOf(accounts.holder.address)
        
        expect(holderBalance).to.not.equal(0);
    })

    it("Pre deployed contract test: ", async () => {
        const weth = await this.uniRouter.WETH()
        await this.uniRouter
            .swapExactETHForTokens(
                0,
                [weth, addresses.DAI],
                accounts.caller.address,
                deadline,
                {
                    value: amount
                }
            )

        await this.uniRouter
            .swapExactETHForTokens(
                0,
                [weth, addresses.AAVE],
                accounts.caller.address,
                deadline,
                {
                    value: amount
                }
            )

        const amountDai = await this.dai.balanceOf(accounts.caller.address)
        const amountAave = await this.aave.balanceOf(accounts.caller.address)

        await this.dai.approve(this.uniRouter.address, amountDai)
        await this.aave.approve(this.uniRouter.address, amountAave)

        await this.uniRouter
            .addLiquidity(
                addresses.DAI,
                addresses.AAVE,
                amountDai,
                amountAave,
                0,
                0,
                accounts.holder.address,
                deadline
            )
        
        holderBalance = await this.daiAave.balanceOf(accounts.holder.address)
        expect(holderBalance).to.not.equal(0)
    })
})