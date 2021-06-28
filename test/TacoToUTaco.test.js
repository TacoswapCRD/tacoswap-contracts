const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getContractFactory, getNamedSigners } = ethers;

let accounts;

describe("TacoToETaco", function () {
    before(async function () {
        accounts = await getNamedSigners();

        this.tacoToken = await getContractFactory("ITacoToken")
        this.etacoToken = await getContractFactory("eTacoToken")
        this.TacoToETaco = await getContractFactory('TacoToETaco')
    })

    beforeEach(async function () {
        this.taco = await this.tacoToken.deploy()
        await this.taco.deployed()
        this.etaco = await this.etacoToken.deploy()
        await this.etaco.deployed()
        this.TacoToETaco = await this.TacoToETaco.deploy(this.taco.address, this.etaco.address)
        await this.TacoToETaco.deployed()
        await this.etaco.connect(accounts.holder).transfer(this.TacoToETaco.address, "100")
        await this.taco.mint(accounts.bob.address, "2000")
    })

    it("Should swap: swap Taco:eTacoToken 10:1", async function () {
        let amount = 100;
        let bobsBalance, etacoBalance;

        bobsBalance = await this.taco.balanceOf(accounts.bob.address);
        etacoBalance = await this.etaco.balanceOf(this.TacoToETaco.address);

        await this.taco.connect(accounts.bob).approve(this.TacoToETaco.address, amount);
        await this.TacoToETaco.connect(accounts.bob).swap(amount, accounts.bob.address)

        expect(await this.taco.balanceOf(accounts.bob.address)).to.equal(bobsBalance.sub(amount));
        expect(await this.etaco.balanceOf(accounts.bob.address)).to.equal(amount / 10);
        expect(await this.taco.balanceOf(this.TacoToETaco.address)).to.equal(amount);
        expect(await this.etaco.balanceOf(this.TacoToETaco.address)).to.equal(etacoBalance.sub(amount / 10));
    })

    it("Should swap: Swap taco to eTaco and return all assets that are on balance", async function () {
        let amount = 1010;
        let bobsBalance, etacoBalance;

        bobsBalance = await this.taco.balanceOf(accounts.bob.address);
        etacoBalance = await this.etaco.balanceOf(this.TacoToETaco.address);
        await this.taco.connect(accounts.bob).approve(this.TacoToETaco.address, amount);

        await this.TacoToETaco.connect(accounts.bob).swap(amount, accounts.bob.address);

        expect(await this.taco.balanceOf(accounts.bob.address)).to.equal(bobsBalance.sub(amount));
        expect(await this.etaco.balanceOf(accounts.bob.address)).to.equal(etacoBalance);
        expect(await this.etaco.balanceOf(this.TacoToETaco.address)).to.equal(0);
        expect(await this.taco.balanceOf(this.TacoToETaco.address)).to.equal(amount);
    })

    it("Should revert: Amount must be divisible by 10", async function () {
        let wrongAmount = 101;
        await expect(this.TacoToETaco.connect(accounts.bob).swap(wrongAmount, accounts.bob.address)).to.be.revertedWith(
            "TacoToETaco: Amount must be divisible by 10"
        )
    })
})