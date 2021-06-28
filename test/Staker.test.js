const { ethers } = require("hardhat");
const { expect } = require("chai");
const { advanceBlock, advanceBlockTo, prepare, deploy, getBigNumber } = require("./utilities");

let accounts;

describe("Staker", function () {
    before(async () => {
        accounts = await ethers.getNamedSigners();

        this.etacoChef = await ethers.getContract("eTacoChef", accounts.caller);
        this.pToken = await ethers.getContract("PToken", accounts.caller);
        this.eTaco = await ethers.getContract("eTacoToken", accounts.caller);
        this.staker = await ethers.getContract("Staker", accounts.caller);
    })

    it("Should initialize with correct values", async () => {
        expect(await this.staker.owner()).to.equal(accounts.owner.address);
    })

    xdescribe("depositToMasterChef function: ", async () => {
        it("Should deposit on eTacoChef", async () => {
            const startBlock = parseInt(await this.etacoChef.startBlock());
            await this.eTaco.connect(accounts.holder).transfer(this.etacoChef.address, this.eTaco.totalSupply());
            await this.etacoChef.connect(accounts.owner).add(1, this.pToken.address, false);
            await this.pToken.connect(accounts.deployer).transfer(this.staker.address, ethers.utils.parseEther("10"));
            await this.pToken.connect(accounts.deployer).transfer(accounts.holder.address, ethers.utils.parseEther("10"));
            await this.staker.connect(accounts.owner).depositToMasterChef(this.pToken.address, 0, ethers.utils.parseEther("1"));
            await this.pToken.connect(accounts.holder).approve(this.etacoChef.address, ethers.utils.parseEther("10"));

            await advanceBlockTo(startBlock + 10);
            console.log("dsadsdasdsa")
            const pending = await this.etacoChef.pendingeTaco(0, this.staker.address);
            const harvestTx = await this.staker.connect(accounts.owner).harvestFromMasterChef(0);

            expect(await this.eTaco.balanceOf(this.staker.address)).to.equal(pending.add(await this.etacoChef.getRewardForBlock(harvestTx.blockNumber)));

        })
    })

})