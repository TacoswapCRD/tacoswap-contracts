const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getContractFactory, getNamedSigners } = ethers;

let accounts;

describe("TacoToUTaco", function () {
    before(async function () {
        accounts = await getNamedSigners();

        this.tacoToken = await getContractFactory("ITacoToken")
        this.utacoToken = await getContractFactory("UTacoToken")
        this.TacoToUTaco = await getContractFactory('TacoToUTaco')
    })

    beforeEach(async function () {
        this.taco = await this.tacoToken.deploy()
        await this.taco.deployed()
        this.utaco = await this.utacoToken.deploy(accounts.holder.address)
        await this.utaco.deployed()
        this.tacoToUTaco = await this.TacoToUTaco.deploy(this.taco.address, this.utaco.address)
        await this.tacoToUTaco.deployed()
        await this.utaco.connect(accounts.holder).transfer(this.tacoToUTaco.address, "100")
        await this.taco.mint(accounts.bob.address, "2000")
    })

    it("Should swap: swap Taco:UTacoToken 10:1", async function () {
        let amount = 100;
        let bobsBalance, utacoBalance;

        bobsBalance = await this.taco.balanceOf(accounts.bob.address);
        utacoBalance = await this.utaco.balanceOf(this.tacoToUTaco.address);

        await this.taco.connect(accounts.bob).approve(this.tacoToUTaco.address, amount);
        await this.tacoToUTaco.connect(accounts.bob).swap(amount, accounts.bob.address)

        expect(await this.taco.balanceOf(accounts.bob.address)).to.equal(bobsBalance.sub(amount));
        expect(await this.utaco.balanceOf(accounts.bob.address)).to.equal(amount / 10);
        expect(await this.taco.balanceOf(this.tacoToUTaco.address)).to.equal(amount);
        expect(await this.utaco.balanceOf(this.tacoToUTaco.address)).to.equal(utacoBalance.sub(amount / 10));
    })

    it("Should swap: Swap taco to UTaco and return all assets that are on balance", async function () {
        let amount = 1010;
        let bobsBalance, utacoBalance;

        bobsBalance = await this.taco.balanceOf(accounts.bob.address);
        utacoBalance = await this.utaco.balanceOf(this.tacoToUTaco.address);
        await this.taco.connect(accounts.bob).approve(this.tacoToUTaco.address, amount);

        await this.tacoToUTaco.connect(accounts.bob).swap(amount, accounts.bob.address);

        expect(await this.taco.balanceOf(accounts.bob.address)).to.equal(bobsBalance.sub(amount));
        expect(await this.utaco.balanceOf(accounts.bob.address)).to.equal(utacoBalance);
        expect(await this.utaco.balanceOf(this.tacoToUTaco.address)).to.equal(0);
        expect(await this.taco.balanceOf(this.tacoToUTaco.address)).to.equal(amount);
    })

    it("Should revert: Amount must be divisible by 10", async function () {
        let wrongAmount = 101;
        await expect(this.tacoToUTaco.connect(accounts.bob).swap(wrongAmount, accounts.bob.address)).to.be.revertedWith(
            "TacoToUTaco: Amount must be divisible by 10"
        )
    })
})