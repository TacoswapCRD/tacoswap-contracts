const { expect, assert } = require("chai");
const { advanceBlock, advanceBlockTo, prepare, deploy, getBigNumber } = require("./utilities");
const { deployments, network, ethers } = require("hardhat");
const { utils, BigNumber, getNamedSigners } = ethers;

let accounts;

describe("eTacoChef contract: ", function () {
    before("Before All: ", async () => {
        await deployments.fixture("eTacoRoll"); // ensure you start from a fresh deployments
        accounts = await getNamedSigners();
        await prepare(this, ['ERC20Mock']);

        this.amount = utils.parseEther("10");
        this.deadline = new Date().getTime() + 10;

        this.etacoChef = await ethers.getContract("eTacoChef", accounts.owner);

        this.router = await ethers.getContract("TacoswapV2Router02", accounts.caller);

        this.factory = await ethers.getContract("TacoswapV2Factory", accounts.caller);

        this.eTaco = await ethers.getContract("eTacoToken", accounts.bob);
        await this.eTaco.connect(accounts.holder).transfer(this.etacoChef.address, this.eTaco.totalSupply())

        this.provider = await ethers.getContractAt("ILiquidityProvider", "0x5460CD29415F811dd9dD5BeD52aA1a56a5bac181");
        this.tokenA = await ethers.getContractAt("ERC20Mock", "0x95bD8D42f30351685e96C62EDdc0d0613bf9a87A", accounts.bob);
        this.tokenB = await ethers.getContractAt("ERC20Mock", "0x98eDDadCfde04dC22a0e62119617e74a6Bc77313", accounts.bob);
        this.weth = await this.router.WETH();

        await deploy(this,
            [
                ["testLp", this.ERC20Mock, ["LP Token", "LPT", getBigNumber(20)]],
                ["testLp1", this.ERC20Mock, ["LP Token1", "LPT", getBigNumber(20)]]
            ]
        )

        await this.testLp.transfer(accounts.bob.address, getBigNumber(5))
        await this.testLp.transfer(accounts.chugun.address, getBigNumber(5))
        await this.testLp.transfer(accounts.vzgo.address, getBigNumber(5))
        await this.testLp1.transfer(accounts.vzgo.address, getBigNumber(5))
        await this.testLp1.transfer(accounts.grno.address, getBigNumber(5))

        this.tokensPairAddress = await this.factory.getPair(this.tokenA.address, this.tokenB.address)
        this.tokenAETHPairAddress = await this.factory.getPair(this.weth, this.tokenA.address)
        this.tokenBETHPairAddress = await this.factory.getPair(this.weth, this.tokenB.address)

        this.pairContract = await ethers.getContractAt("TacoswapV2Pair", this.tokensPairAddress, accounts.bob)

        this.pairAETHContract = await ethers.getContractAt("TacoswapV2Pair", this.tokenAETHPairAddress, accounts.bob)
        this.pairBETHContract = await ethers.getContractAt("TacoswapV2Pair", this.tokenBETHPairAddress, accounts.bob)

        this.startBlock = parseInt(await this.etacoChef.startBlock());
        this.endBlock = await this.etacoChef.endBlock();
    })

    describe("PoolLength function: ", async () => {
        before("Before: ", async () => {
            this.snapshotStart = await network.provider.request({
                method: "evm_snapshot",
                params: [],
            });
        })

        after("After tests: ", async () => {
            await network.provider.request({
                method: "evm_revert",
                params: [this.snapshotStart]
            });
        })

        it("PoolLength should execute: ", async () => {
            await this.etacoChef.add("50", this.tokensPairAddress, false)
            await this.etacoChef.add("30", this.tokenAETHPairAddress, true)
            await this.etacoChef.add("20", this.tokenBETHPairAddress, true)
            expect(await this.etacoChef.poolLength()).to.equal(3);
        })
    })

    describe("Set function: ", async () => {
        beforeEach("Before: ", async () => {
            this.snapshotStart = await network.provider.request({
                method: "evm_snapshot",
                params: [],
            });
        })

        afterEach("After tests: ", async () => {
            await network.provider.request({
                method: "evm_revert",
                params: [this.snapshotStart]
            });
        })

        it("Should set new allocPoint for pid: ", async () => {
            await this.etacoChef.add("40", this.tokensPairAddress, false)
            await this.etacoChef.add("30", this.tokenAETHPairAddress, true)
            await this.etacoChef.add("20", this.tokenBETHPairAddress, true)

            await this.etacoChef.set(0, 30, true);
            await this.etacoChef.set(1, 30, true);
            await this.etacoChef.set(2, 40, true);

            expect((await this.etacoChef.poolInfo(0)).allocPoint).to.equal(30);
            expect((await this.etacoChef.poolInfo(1)).allocPoint).to.equal(30);
            expect((await this.etacoChef.poolInfo(2)).allocPoint).to.equal(40);
        })

        it("Should revert if invalid pool", async () => {
            let err;
            try {
                await this.etacoChef.set(100000000, 10, true)
            } catch (e) {
                err = e;
            }

            assert.equal(err.toString(), "Error: VM Exception while processing transaction: revert Pool does not exist")
        })
    })

    describe("PendingeTaco function: ", async () => {
        beforeEach("Before: ", async () => {
            this.snapshotStart = await network.provider.request({
                method: "evm_snapshot",
                params: [],
            });
        })

        afterEach("After tests: ", async () => {
            await network.provider.request({
                method: "evm_revert",
                params: [this.snapshotStart]
            });
        })

        it("PendingeTaco should equal ExpectedeTaco: ", async () => {
            await advanceBlockTo(await ethers.provider.getBlockNumber());
            const pid = await this.etacoChef.poolLength();
            const blockToAdvance = 35;
            expect(pid).to.equal(0);

            let approve = await this.testLp.connect(accounts.bob).approve(this.etacoChef.address, getBigNumber(1))
            approve = await this.testLp.connect(accounts.bob).approve(this.etacoChef.address, getBigNumber(1))
            approve = await this.testLp.connect(accounts.bob).approve(this.etacoChef.address, getBigNumber(1))
            approve = await this.testLp.connect(accounts.bob).approve(this.etacoChef.address, getBigNumber(1))
            approve = await this.testLp.connect(accounts.bob).approve(this.etacoChef.address, getBigNumber(1))
            const add = await this.etacoChef.add("10", this.testLp.address, false)

            const log1 = await this.etacoChef.connect(accounts.bob).deposit(pid, getBigNumber(1))

            let pendingeTaco = await this.etacoChef.pendingeTaco(pid, accounts.bob.address)
            expect(pendingeTaco).to.equal(0);
            
            await advanceBlockTo(this.startBlock + blockToAdvance);

            pendingeTaco = await this.etacoChef.pendingeTaco(pid, accounts.bob.address);
            expect(pendingeTaco).to.equal(await this.etacoChef.getReward(this.startBlock, this.startBlock + blockToAdvance));

            harvesttx = await this.etacoChef.connect(accounts.bob).harvest(pid)
            expect(await this.eTaco.balanceOf(accounts.bob.address)).to.equal(await this.etacoChef.getReward(this.startBlock, this.startBlock + blockToAdvance + 1));
        })

        it("PendingeTaco should equal ExpectedeTaco (2 signers in 1 pool): ", async () => {
            const pid = await this.etacoChef.poolLength();
            const blockToAdvance = 5;
            expect(pid).to.equal(0);

            await this.testLp.connect(accounts.bob).approve(this.etacoChef.address, getBigNumber(1))
            await this.testLp.connect(accounts.chugun).approve(this.etacoChef.address, getBigNumber(1))

            await advanceBlockTo(this.startBlock + blockToAdvance);

            await this.etacoChef.add("10", this.testLp.address, false)

            const log1 = await this.etacoChef.connect(accounts.bob).deposit(pid, getBigNumber(1))
            const log2 = await this.etacoChef.connect(accounts.chugun).deposit(pid, getBigNumber(1))

            let pendingeTacoBob = await this.etacoChef.pendingeTaco(pid, accounts.bob.address)
            let pendingeTacoCarol = await this.etacoChef.pendingeTaco(pid, accounts.chugun.address)
            expect(pendingeTacoBob).to.equal(await this.etacoChef.getRewardForBlock(log2.blockNumber))
            expect(pendingeTacoCarol).to.equal(0);

            harvesttx = await this.etacoChef.connect(accounts.bob).harvest(pid);
            expect(await this.eTaco.balanceOf(accounts.bob.address)).to.equal(pendingeTacoBob.add((await this.etacoChef.getRewardForBlock(log2.blockNumber + 1)).div(2)));

            pendingeTacoCarol = await this.etacoChef.pendingeTaco(pid, accounts.chugun.address)
            expect(pendingeTacoCarol).to.equal((await this.etacoChef.getRewardForBlock(log2.blockNumber + 1)).div(2));

            harvesttx = await this.etacoChef.connect(accounts.chugun).harvest(pid);
            expect(await this.eTaco.balanceOf(accounts.chugun.address)).to.equal((await this.etacoChef.getReward(log2.blockNumber, harvesttx.blockNumber)).div(2));
        })

        it("PendingeTaco should equal ExpectedeTaco(4 signers in 2 pools): ", async () => {
            const pid1 = await this.etacoChef.poolLength();
            const blockToAdvance = 0;
            expect(pid1).to.equal(0);

            await advanceBlockTo(this.startBlock + blockToAdvance);
            
            await this.etacoChef.add("50", this.testLp.address, false)

            const pid2 = await this.etacoChef.poolLength();
            await this.etacoChef.add("50", this.testLp1.address, true)

            await this.testLp.connect(accounts.bob).approve(this.etacoChef.address, getBigNumber(1))
            await this.testLp.connect(accounts.chugun).approve(this.etacoChef.address, getBigNumber(1))
            await this.testLp.connect(accounts.vzgo).approve(this.etacoChef.address, getBigNumber(2))
            await this.testLp1.connect(accounts.vzgo).approve(this.etacoChef.address, getBigNumber(1))
            await this.testLp1.connect(accounts.grno).approve(this.etacoChef.address, getBigNumber(1))

            const log1 = await this.etacoChef.connect(accounts.bob).deposit(pid1, getBigNumber(1))
            const log2 = await this.etacoChef.connect(accounts.chugun).deposit(pid1, getBigNumber(1))
            const log3 = await this.etacoChef.connect(accounts.vzgo).deposit(pid1, getBigNumber(2))

            pendingeTaco3 = await this.etacoChef.pendingeTaco(pid1, accounts.vzgo.address)
            pendingeTaco2 = await this.etacoChef.pendingeTaco(pid1, accounts.chugun.address)
            pendingeTaco1 = await this.etacoChef.pendingeTaco(pid1, accounts.bob.address)

            expect(pendingeTaco3).to.equal(0);
            expect(pendingeTaco2).to.equal((await this.etacoChef.getRewardForBlock(log3.blockNumber)).div(4))
            expect(pendingeTaco1).to.equal((await this.etacoChef.getRewardForBlock(log2.blockNumber)).div(2).add(pendingeTaco2))

            const log4 = await this.etacoChef.connect(accounts.vzgo).deposit(pid2, getBigNumber(1))
            const log5 = await this.etacoChef.connect(accounts.grno).deposit(pid2, getBigNumber(1))

            pendingeTaco5 = await this.etacoChef.pendingeTaco(pid2, accounts.grno.address)
            pendingeTaco4 = await this.etacoChef.pendingeTaco(pid2, accounts.vzgo.address)

            expect(pendingeTaco5).to.equal(0);
            expect(pendingeTaco4).to.equal((await this.etacoChef.getRewardForBlock(log5.blockNumber)).div(2));

            harvesttx = await this.etacoChef.connect(accounts.bob).harvest(pid1);
            expect(await this.eTaco.balanceOf(accounts.bob.address)).to.equal((await this.etacoChef.getReward(log3.blockNumber, harvesttx.blockNumber)).div(8).add(pendingeTaco1));

            harvesttx = await this.etacoChef.connect(accounts.chugun).harvest(pid1);
            expect(await this.eTaco.balanceOf(accounts.chugun.address)).to.equal((await this.etacoChef.getReward(log3.blockNumber, harvesttx.blockNumber)).div(8).add(pendingeTaco2));

            harvesttx = await this.etacoChef.connect(accounts.vzgo).harvest(pid1);
            expect(await this.eTaco.balanceOf(accounts.vzgo.address)).to.equal((await this.etacoChef.getReward(log3.blockNumber, harvesttx.blockNumber)).div(4).add(pendingeTaco3));

            vzgoeTaco = await this.eTaco.balanceOf(accounts.vzgo.address);

            harvesttx = await this.etacoChef.connect(accounts.vzgo).harvest(pid2);
            expect((await this.eTaco.balanceOf(accounts.vzgo.address)).sub(vzgoeTaco)).to.equal((await this.etacoChef.getReward(log5.blockNumber, harvesttx.blockNumber)).div(4).add(pendingeTaco4));

            harvesttx = await this.etacoChef.connect(accounts.grno).harvest(pid2);
            expect(await this.eTaco.balanceOf(accounts.grno.address)).to.equal((await this.etacoChef.getReward(log5.blockNumber, harvesttx.blockNumber)).div(4).add(pendingeTaco5));
        })
    })

    describe("Add function: ", async () => {
        before("Before: ", async () => {
            this.snapshotStart = await network.provider.request({
                method: "evm_snapshot",
                params: [],
            });
        })
        after("After tests: ", async () => {
            await network.provider.request({
                method: "evm_revert",
                params: [this.snapshotStart]
            });
        })
        it("Should add new pool for deposit: ", async () => {
            const pid = await this.etacoChef.poolLength();
            let tx = await this.etacoChef.add("10", this.testLp.address, true)

            expect((await this.etacoChef.poolInfo(pid)).lpToken).to.equal(this.testLp.address)
            expect((await this.etacoChef.poolInfo(pid)).allocPoint).to.equal(10)
            expect((await this.etacoChef.poolInfo(pid)).lastRewardBlock).to.equal(this.startBlock)
            expect((await this.etacoChef.poolInfo(pid)).acceTacoPerShare).to.equal(0)
        })
    })

    describe("Deposit function: ", async () => {
        before("Before: ", async () => {
            this.snapshotStart = await network.provider.request({
                method: "evm_snapshot",
                params: [],
            });
        })

        after("After tests: ", async () => {
            await network.provider.request({
                method: "evm_revert",
                params: [this.snapshotStart]
            });
        })

        it("Should deposit in pool: ", async () => {
            const pid = await this.etacoChef.poolLength();
            await this.etacoChef.add("10", this.testLp.address, true)

            let accountLp = await this.testLp.balanceOf(accounts.bob.address)
            // let contractLp = await this.testLp.balanceOf(this.etacoChef.address)
            await this.testLp.connect(accounts.bob).approve(this.etacoChef.address, getBigNumber(1))
            await this.etacoChef.connect(accounts.bob).deposit(pid, getBigNumber(1));

            expect((await this.testLp.balanceOf(accounts.bob.address)).toString()).to.equal((accountLp - getBigNumber(1)).toString())
            expect((await this.testLp.balanceOf(this.etacoChef.address)).toString()).to.equal(getBigNumber(1).toString()) // contractLp
        })
    })

    describe("Withdraw function: ", async () => {
        before("Before: ", async () => {
            this.snapshotStart = await network.provider.request({
                method: "evm_snapshot",
                params: [],
            });
        })

        after("After tests: ", async () => {
            await network.provider.request({
                method: "evm_revert",
                params: [this.snapshotStart]
            });
        })

        it("Withdraw lps from pool: ", async () => {
            const pid = await this.etacoChef.poolLength();

            tx = await this.etacoChef.add("10", this.testLp.address, true)

            let accountLp = await this.testLp.balanceOf(accounts.bob.address)
            let contractLp = await this.testLp.balanceOf(this.etacoChef.address)
            await this.testLp.connect(accounts.bob).approve(this.etacoChef.address, getBigNumber(1))
            await this.etacoChef.connect(accounts.bob).deposit(pid, getBigNumber(1))
            await advanceBlock()
            await this.etacoChef.connect(accounts.bob).withdraw(pid, getBigNumber(1))

            expect((await this.testLp.balanceOf(accounts.bob.address)).toString()).to.equal(accountLp)
            expect((await this.testLp.balanceOf(this.etacoChef.address)).toString()).to.equal(contractLp)
        })
    })

    describe("SpeedStake function: ", async () => {
        before("Before: ", async () => {
            this.snapshotStart = await network.provider.request({
                method: "evm_snapshot",
                params: [],
            });

            let depositLP;

            await this.etacoChef.add("50", this.tokensPairAddress, false)
            await this.etacoChef.add("30", this.tokenAETHPairAddress, true)

        })

        after("After tests: ", async () => {
            await network.provider.request({
                method: "evm_revert",
                params: [this.snapshotStart]
            });
        })

        it("SpeedStake for token-token pair: ", async () => {
            let snapshotId = await network.provider.request({
                method: "evm_snapshot",
                params: [],
            });

            await this.provider.addLiquidityByPair(
                this.tokensPairAddress,
                0,
                0,
                0,
                0,
                accounts.chugun.address,
                this.deadline,
                1,
                { value: this.amount }
            )

            depositLP = await this.pairContract.balanceOf(accounts.chugun.address)

            await network.provider.request({
                method: "evm_revert",
                params: [snapshotId],
            });

            await this.etacoChef.connect(accounts.chugun).speedStake(0, 0, 0, 0, 0, this.deadline, { value: this.amount });

            expect((await this.etacoChef.userInfo(0, accounts.chugun.address)).amount).to.equal(depositLP)

            await network.provider.request({
                method: "evm_revert",
                params: [snapshotId],
            });
        })


        it("SpeedStake for weth-token pair: ", async () => {
            let snapshotId = await network.provider.request({
                method: "evm_snapshot",
                params: [],
            });

            await this.provider.addLiquidityETHByPair(
                this.tokenAETHPairAddress,
                accounts.chugun.address,
                0,
                0,
                0,
                this.deadline,
                1,
                { value: this.amount }
            )

            depositLP = await this.pairAETHContract.balanceOf(accounts.chugun.address)

            await network.provider.request({
                method: "evm_revert",
                params: [snapshotId],
            });

            await this.etacoChef.connect(accounts.chugun).speedStake(1, 0, 0, 0, 0, this.deadline, { value: this.amount });

            expect((await this.etacoChef.userInfo(1, accounts.chugun.address)).amount).to.equal(depositLP)
        })
    })

    describe("HarvestAll function: ", async () => {
        before("Before: ", async () => {
            this.snapshotStart = await network.provider.request({
                method: "evm_snapshot",
                params: [],
            });

            await this.etacoChef.add("50", this.tokensPairAddress, false)
            await this.etacoChef.add("30", this.tokenAETHPairAddress, true)
            await this.etacoChef.add("20", this.tokenBETHPairAddress, true)
        })

        after("After tests: ", async () => {
            await network.provider.request({
                method: "evm_revert",
                params: [this.snapshotStart]
            });
        })

        it("Should HarvestAll: Call HarvestAll function to get all assets at ones ", async () => {
            tx = await this.etacoChef.connect(accounts.chugun).speedStake(0, 0, 0, 0, 0, this.deadline, { value: this.amount });
            expect((await this.etacoChef.poolInfo(0)).lastRewardBlock).to.equal(this.startBlock)

            tx = await this.etacoChef.connect(accounts.bob).speedStake(0, 0, 0, 0, 0, this.deadline, { value: this.amount });
            expect((await this.etacoChef.poolInfo(0)).lastRewardBlock).to.equal(this.startBlock)

            tx = await this.etacoChef.connect(accounts.chugun).speedStake(1, 0, 0, 0, 0, this.deadline, { value: this.amount });
            expect((await this.etacoChef.poolInfo(1)).lastRewardBlock).to.equal(this.startBlock)

            tx = await this.etacoChef.connect(accounts.bob).speedStake(1, 0, 0, 0, 0, this.deadline, { value: this.amount });
            expect((await this.etacoChef.poolInfo(1)).lastRewardBlock).to.equal(this.startBlock)

            tx = await this.etacoChef.connect(accounts.chugun).speedStake(2, 0, 0, 0, 0, this.deadline, { value: this.amount });
            expect((await this.etacoChef.poolInfo(2)).lastRewardBlock).to.equal(this.startBlock)

            tx = await this.etacoChef.connect(accounts.toni).speedStake(2, 0, 0, 0, 0, this.deadline, { value: this.amount });
            expect((await this.etacoChef.poolInfo(2)).lastRewardBlock).to.equal(this.startBlock)

            await advanceBlockTo(this.startBlock + 5)

            await this.etacoChef.connect(accounts.chugun).harvestAll()
            await this.etacoChef.connect(accounts.bob).harvestAll()
            await this.etacoChef.connect(accounts.toni).harvestAll()

            expect((await this.etacoChef.userInfo(0, accounts.chugun.address)).rewardDebt).to.not.equal(ethers.constants.Zero)
            expect((await this.etacoChef.userInfo(1, accounts.chugun.address)).rewardDebt).to.not.equal(ethers.constants.Zero)
            expect((await this.etacoChef.userInfo(2, accounts.chugun.address)).rewardDebt).to.not.equal(ethers.constants.Zero)
            expect((await this.etacoChef.userInfo(0, accounts.bob.address)).rewardDebt).to.not.equal(ethers.constants.Zero)
            expect((await this.etacoChef.userInfo(1, accounts.bob.address)).rewardDebt).to.not.equal(ethers.constants.Zero)
            expect((await this.etacoChef.userInfo(2, accounts.toni.address)).rewardDebt).to.not.equal(ethers.constants.Zero)
        })

    })
})