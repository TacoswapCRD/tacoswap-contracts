const { ethers } = require("hardhat");
const { expect } = require("chai");
const { advanceBlock, advanceBlockTo, prepare, deploy, getBigNumber } = require("./utilities");

let accounts;

describe("Staker", function () {
    before(async () => {
        accounts = await ethers.getNamedSigners();

        this.utacoChef = await ethers.getContract("UTacoChef", accounts.caller);
        this.pToken = await ethers.getContract("PToken", accounts.caller);
        this.uTaco = await ethers.getContract("UTacoToken", accounts.caller);
        this.staker = await ethers.getContract("Staker", accounts.caller);
    })

    it("Should initialize with correct values", async () => {
        expect(await this.staker.owner()).to.equal(accounts.owner.address);
    })

    describe("depositToMasterChef function: ", async () => {
        it("Should deposit on UTacoChef", async () => {
            const startBlock = parseInt(await this.utacoChef.startBlock());
            await this.uTaco.connect(accounts.holder).transfer(this.utacoChef.address, this.uTaco.totalSupply());
            await this.utacoChef.connect(accounts.owner).add(1, this.pToken.address, false);
            await this.pToken.connect(accounts.deployer).transfer(this.staker.address, ethers.utils.parseEther("10"));
            await this.pToken.connect(accounts.deployer).transfer(accounts.holder.address, ethers.utils.parseEther("10"));
            await this.staker.connect(accounts.owner).depositToMasterChef(this.pToken.address, 0, ethers.utils.parseEther("1"));
            await this.pToken.connect(accounts.holder).approve(this.utacoChef.address, ethers.utils.parseEther("10"));

            await advanceBlockTo(startBlock + 10);

            const pending = await this.utacoChef.pendingUTaco(0, this.staker.address);
            const harvestTx = await this.staker.connect(accounts.owner).harvestFromMasterChef(0);

            expect(await this.uTaco.balanceOf(this.staker.address)).to.equal(pending.add(await this.utacoChef.getRewardForBlock(harvestTx.blockNumber)));

        })
    })

})