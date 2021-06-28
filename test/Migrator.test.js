const { expect } = require("chai");
const { ethers, network, deployments } = require("hardhat");
const { deployContract, MockProvider, solidity } = require('ethereum-waffle');
const { getNamedSigners } = ethers;

const { advanceBlockTo } = require("./utilities");

const oldChefAddress = "0x7F7710e0c7C5C0FF043963dd22C3988e8bDb7AcC";
const poolzAddress = "0x69A95185ee2a045CDC4bCd1b1Df10710395e4e23";
const uniRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const sushiRouterAddress = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
const CRDToken = "0xcAaa93712BDAc37f736C323C93D4D5fDEFCc31CC";

let accounts;

describe("Migrator", function () {
  before(async () => {
    accounts = await getNamedSigners();
    await deployments.fixture();
    this.crdToken = await ethers.getContractAt("eTacoToken", CRDToken, accounts.caller);
    this.eTaco = await ethers.getContract("eTacoToken", accounts.caller);
    this.eTacoRoll = await ethers.getContract("eTacoRoll", accounts.caller);
    this.Migrator = await ethers.getContractFactory("Migrator");
    this.newFactory = await ethers.getContract("TacoswapV2Factory", accounts.caller);
    this.oldChef = await ethers.getContractAt("eTacoChef", oldChefAddress, accounts.caller);
    this.newChef = await ethers.getContract("eTacoChef", accounts.caller);
    this.poolz = await ethers.getContractAt("ITacoToken", poolzAddress, accounts.caller);
    this.uniRouter = await ethers.getContractAt("ITacoswapV2Router02", uniRouterAddress, accounts.caller);
    this.sushiRouter = await ethers.getContractAt("ITacoswapV2Router02", sushiRouterAddress, accounts.caller);
    this.uniFactory = await ethers.getContractAt("ITacoswapV2Factory", await this.uniRouter.factory(), accounts.caller);
    this.sushiFactory = await ethers.getContractAt("ITacoswapV2Factory", await this.sushiRouter.factory(), accounts.caller);
    this.weth = await this.uniRouter.WETH();
    this.migrator = await this.Migrator.connect(accounts.deployer).deploy(this.oldChef.address, this.uniFactory.address, this.sushiFactory.address, this.newFactory.address, 0, this.newChef.address);
    await this.migrator.deployed()

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0xA5a6707DBAD87609C8b21270653E7A0490E9BF21"]
    })

    const oldChefOwner = await ethers.provider.getSigner("0xA5a6707DBAD87609C8b21270653E7A0490E9BF21")
    const tx = await this.oldChef.connect(oldChefOwner).populateTransaction.setMigrator(this.migrator.address);
    await oldChefOwner.sendTransaction(tx);

    await network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: ["0xA5a6707DBAD87609C8b21270653E7A0490E9BF21"]
    });

    await this.newChef.connect(accounts.owner).setMigrator(this.migrator.address);
    await this.eTaco.connect(accounts.holder).transfer(this.newChef.address, this.eTaco.totalSupply())
  })

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
  
  it("Should revert: Pools must be migrated", async () => {
    const eoaUni = "0xC58DBe2285E099c04873f2A5048374eEfBCb6983";

    await accounts.bob.sendTransaction({ to: eoaUni, value: ethers.utils.parseEther("1") });
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [eoaUni]
    });

    const eoaUniAccount = await ethers.provider.getSigner(eoaUni);

    tx = await this.oldChef.connect(eoaUniAccount).populateTransaction.deposit(0, 0);
    await eoaUniAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaUniAccount).populateTransaction.deposit(1, 0);
    await eoaUniAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaUniAccount).populateTransaction.deposit(7, 0);
    await eoaUniAccount.sendTransaction(tx);

    await this.oldChef.userInfo(1, eoaUni);

    await expect(eoaUniAccount.sendTransaction(await this.migrator.connect(eoaUniAccount).populateTransaction.migrateUserInfo()))
      .to.be.revertedWith("eTacoChef: Pools must be migrated");
  })

  it("Should migrate all pools from oldChef", async () => {
    const poolsToMigrate = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    const oldChefPools = [];
    const startBlock = await this.newChef.startBlock();

    for (let i = 0; i < poolsToMigrate.length; i++) {
      const pool = await this.oldChef.poolInfo(poolsToMigrate[i]);
      oldChefPools.push(pool);
    }

    await this.migrator.connect(accounts.deployer).migratePools(poolsToMigrate);

    const newChefPools = [];
    for (let i = 0; i < poolsToMigrate.length; i++) {
      const pool = await this.newChef.poolInfo(i);
      newChefPools.push(pool);
    }


    for (let i = 0; i < newChefPools.length; i++) {
      expect(newChefPools[i].lpToken).to.equal(oldChefPools[i].lpToken)
      expect(newChefPools[i].allocPoint).to.equal(oldChefPools[i].allocPoint)
      expect(newChefPools[i].lastRewardBlock).to.equal(startBlock - 1)
      expect(newChefPools[i].acceTacoPerShare).to.equal(0)
    }
    expect(newChefPools.length).to.equal(poolsToMigrate.length);
    expect(await this.newChef.totalAllocPoint()).to.equal(await this.oldChef.totalAllocPoint());
  })

  it("Should migrate some pools from oldChef", async () => {
    const poolsToMigrate = [0, 2, 3, 5]
    const oldChefPools = [];
    const startBlock = await this.newChef.startBlock();

    for (let i = 0; i < poolsToMigrate.length; i++) {
      const pool = await this.oldChef.poolInfo(poolsToMigrate[i]);
      oldChefPools.push(pool);
    }

    await this.migrator.connect(accounts.deployer).migratePools(poolsToMigrate);

    const newChefPools = [];
    for (let i = 0; i < poolsToMigrate.length; i++) {
      const pool = await this.newChef.poolInfo(i);
      newChefPools.push(pool);
    }


    for (let i = 0; i < newChefPools.length; i++) {
      expect(newChefPools[i].lpToken).to.equal(oldChefPools[i].lpToken)
      expect(newChefPools[i].allocPoint).to.equal(oldChefPools[i].allocPoint)
      expect(newChefPools[i].lastRewardBlock).to.equal(startBlock - 1)
      expect(newChefPools[i].acceTacoPerShare).to.equal(0)
    }
    expect(newChefPools.length).to.equal(poolsToMigrate.length);
    expect(await this.newChef.totalAllocPoint()).to.equal(await this.oldChef.totalAllocPoint());
  })

  it("Should migrate lpTokens from oldChef", async () => {
    const wethPoolzAddress = await this.uniFactory.getPair(this.weth, this.poolz.address)
    const wethPoolz = await ethers.getContractAt("TacoswapV2ERC20", wethPoolzAddress, accounts.deployer);
    const oldChefLPTokens = await wethPoolz.balanceOf(this.oldChef.address);

    await this.oldChef.migrate(13);

    expect(await wethPoolz.balanceOf(this.newChef.address)).to.equal(oldChefLPTokens);
  })

  it("Should revert: Please call deposit function with amount = 0, for all pools where you have some amount", async () => {
    const eoa = "0x5fC2dC6f4568e492D37B1a30F5d6BB91E890230C";

    await accounts.bob.sendTransaction({ to: eoa, value: ethers.utils.parseEther("1") });
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [eoa]
    });

    const eoaAccount = await ethers.provider.getSigner(eoa);

    await expect(eoaAccount.sendTransaction(await this.migrator.connect(eoaAccount).populateTransaction.migrateUserInfo()))
      .to.be.revertedWith("Migrator: Please call deposit function with amount = 0, for all pools where you have some amount")

  })

  it("Should: give correct reward for migrated user: ", async () => {
    const poolsToMigrate = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    await this.migrator.connect(accounts.deployer).migratePools(poolsToMigrate);
    const startBlock = await this.newChef.startBlock();
    const totalAllocPoint = await this.newChef.totalAllocPoint();
    const eoaUni = "0xC58DBe2285E099c04873f2A5048374eEfBCb6983";

    await accounts.bob.sendTransaction({ to: eoaUni, value: ethers.utils.parseEther("1") });
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [eoaUni]
    });

    await this.oldChef.migrate(1);
    const poolInfo = await this.newChef.poolInfo(1);
    const pair = await ethers.getContractAt("ITacoswapV2Pair", poolInfo.lpToken);
    const lpSupply = await pair.balanceOf(this.newChef.address);
    const eoaUniAccount = await ethers.provider.getSigner(eoaUni);

    tx = await this.oldChef.connect(eoaUniAccount).populateTransaction.deposit(0, 0);
    await eoaUniAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaUniAccount).populateTransaction.deposit(1, 0);
    await eoaUniAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaUniAccount).populateTransaction.deposit(7, 0);
    await eoaUniAccount.sendTransaction(tx);

    tx = await this.migrator.connect(eoaUniAccount).populateTransaction.migrateUserInfo();
    await eoaUniAccount.sendTransaction(tx);

    await network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [eoaUni]
    });

    const userInfo = await this.newChef.userInfo(1, eoaUni);
    let blockToAdvance = parseInt(startBlock) + 50
    await advanceBlockTo(blockToAdvance);

    if (blockToAdvance > startBlock + 100) blockToAdvance = startBlock + 100

    eoaUniReward = await this.newChef.pendingeTaco(1, eoaUni);

    let reward = await this.newChef.getReward(startBlock - 1, blockToAdvance);

    multiplier = reward.mul(poolInfo.allocPoint).div(totalAllocPoint)
    acceTacoPerShare = poolInfo.acceTacoPerShare.add(multiplier.mul(10 ** 12).div(lpSupply))
    eoaUniPendingReward = userInfo.amount.mul(acceTacoPerShare).div(10 ** 12).sub(userInfo.rewardDebt)

    expect(eoaUniReward).to.equal(eoaUniPendingReward)
  })

  it("Should: give correct reward for migrated user and new user: ", async () => {
    const poolsToMigrate = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    await this.migrator.connect(accounts.deployer).migratePools(poolsToMigrate);
    const startBlock = await this.newChef.startBlock();
    const totalAllocPoint = await this.newChef.totalAllocPoint();
    const eoaUni = "0xC58DBe2285E099c04873f2A5048374eEfBCb6983";

    await accounts.bob.sendTransaction({ to: eoaUni, value: ethers.utils.parseEther("1") });
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [eoaUni]
    });

    await this.oldChef.migrate(1);
    const poolInfo = await this.newChef.poolInfo(1);
    const pair = await ethers.getContractAt("ITacoswapV2Pair", poolInfo.lpToken);
    const lpSupply = await pair.balanceOf(this.newChef.address);
    const eoaUniAccount = await ethers.provider.getSigner(eoaUni);

    tx = await this.oldChef.connect(eoaUniAccount).populateTransaction.deposit(0, 0);
    await eoaUniAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaUniAccount).populateTransaction.deposit(1, 0);
    await eoaUniAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaUniAccount).populateTransaction.deposit(7, 0);
    await eoaUniAccount.sendTransaction(tx);

    tx = await this.migrator.connect(eoaUniAccount).populateTransaction.migrateUserInfo();
    await eoaUniAccount.sendTransaction(tx);

    let userInfo = await this.newChef.userInfo(1, eoaUni);

    tx = await this.newChef.connect(eoaUniAccount).populateTransaction.withdraw(1, userInfo.amount.div(2))
    await eoaUniAccount.sendTransaction(tx);

    tx = await pair.connect(eoaUniAccount).populateTransaction.transfer(accounts.bob.address, userInfo.amount.div(2))
    await eoaUniAccount.sendTransaction(tx);

    await network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [eoaUni]
    });

    await pair.connect(accounts.bob).approve(this.newChef.address, userInfo.amount.div(2))
    await this.newChef.connect(accounts.bob).deposit(1, userInfo.amount.div(2))

    userInfo = await this.newChef.userInfo(1, eoaUni);

    let blockToAdvance = parseInt(startBlock) + 26
    await advanceBlockTo(blockToAdvance);

    if (blockToAdvance > startBlock + 100) blockToAdvance = startBlock + 100

    eoaUniReward = await this.newChef.pendingeTaco(1, eoaUni);

    let reward = await this.newChef.getReward(startBlock - 1, blockToAdvance);

    multiplier = reward.mul(poolInfo.allocPoint).div(totalAllocPoint)
    acceTacoPerShare = poolInfo.acceTacoPerShare.add(multiplier.mul(10 ** 12).div(lpSupply))
    eoaUniPendingReward = userInfo.amount.mul(acceTacoPerShare).div(10 ** 12).sub(userInfo.rewardDebt)

    bobPendingReward = await this.newChef.pendingeTaco(1, accounts.bob.address)

    expect(eoaUniReward).to.equal(eoaUniPendingReward)
    expect(bobPendingReward).to.equal(eoaUniReward)
  })

  it("Should migrate userInfo from oldChef", async () => {
    const eoaUni = "0xC58DBe2285E099c04873f2A5048374eEfBCb6983";
    const eoaSushi = "0x27388bdbC5132d8348981C7f68a86326e4330AD3";


    const poolsToMigrate = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    await this.migrator.connect(accounts.deployer).migratePools(poolsToMigrate);

    await accounts.bob.sendTransaction({ to: eoaUni, value: ethers.utils.parseEther("1") });

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [eoaUni]
    });

    const eoaUniAccount = await ethers.provider.getSigner(eoaUni);

    tx = await this.oldChef.connect(eoaUniAccount).populateTransaction.deposit(0, 0);
    await eoaUniAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaUniAccount).populateTransaction.deposit(1, 0);
    await eoaUniAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaUniAccount).populateTransaction.deposit(7, 0);
    await eoaUniAccount.sendTransaction(tx);

    tx = await this.migrator.connect(eoaUniAccount).populateTransaction.migrateUserInfo();
    await eoaUniAccount.sendTransaction(tx);

    await network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [eoaUni]
    });


    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [eoaSushi]
    });

    const eoaSushiAccount = await ethers.provider.getSigner(eoaSushi);

    tx = await this.oldChef.connect(eoaSushiAccount).populateTransaction.deposit(2, 0);
    await eoaSushiAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaSushiAccount).populateTransaction.deposit(3, 0);
    await eoaSushiAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaSushiAccount).populateTransaction.deposit(4, 0);
    await eoaSushiAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaSushiAccount).populateTransaction.deposit(5, 0);
    await eoaSushiAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaSushiAccount).populateTransaction.deposit(6, 0);
    await eoaSushiAccount.sendTransaction(tx);

    tx = await this.oldChef.connect(eoaSushiAccount).populateTransaction.deposit(8, 0);
    await eoaSushiAccount.sendTransaction(tx);


    tx = await this.migrator.connect(eoaSushiAccount).populateTransaction.migrateUserInfo();
    await eoaSushiAccount.sendTransaction(tx);

    await network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [eoaSushi]
    });

    const eoaUniOldInfo = await this.oldChef.userInfo(1, eoaUni);
    const eoaUniInfo = await this.newChef.userInfo(1, eoaUni);

    const eoaSushiOldInfo = await this.oldChef.userInfo(8, eoaSushi);
    const eoaSushiInfo = await this.newChef.userInfo(8, eoaSushi);

    expect(eoaUniInfo.amount).to.equal(eoaUniOldInfo.amount)
    expect(eoaUniInfo.rewardDebt).to.equal(0)


    expect(eoaSushiInfo.amount).to.equal(eoaSushiOldInfo.amount)
    expect(eoaSushiInfo.rewardDebt).to.equal(0)
  })
})