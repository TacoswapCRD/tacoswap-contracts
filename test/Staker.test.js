const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getContractFactory, getNamedSigners } = ethers;

let accounts;

describe("Staker", function () {
    before(async () => {
        accounts = await getNamedSigners();

        this.utacoChef = await ethers.getContract("UTacoChef", accounts.caller);
        this.pToken = await ethers.getContract("PToken", accounts.caller);
        this.staker = await ethers.getContract("Staker", accounts.caller);
    })

    it("Should initialize with correct values", async () => {
        expect(await this.staker.owner()).to.equal(accounts.owner.address);
    })

})