module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy, execute } = deployments

  const { deployer, owner } = await getNamedAccounts()
  const signer = await ethers.getSigners()

  const utaco = await ethers.getContract("UTacoToken")
  const router = await ethers.getContract("TacoswapV2Router02")
  const provider = await ethers.getContractAt("ILiquidityProvider", "0x5460CD29415F811dd9dD5BeD52aA1a56a5bac181");
 
  let blockNumber = await ethers.provider.getBlockNumber()

  await deploy("UTacoChef", {
    from: deployer,
    args: [utaco.address, owner, ethers.utils.parseEther("10"), blockNumber + 100, blockNumber + 200],
    log: true,
    deterministicDeployment: false
  })

  const utacoChef = await ethers.getContract("UTacoChef", deployer)
  if (await utacoChef.owner() !== owner) {
    // Transfer ownership of UTacoChef to owner
    console.log("Transfer ownership of UTacoChef to owner")
    await (await utacoChef.transferOwnership(owner)).wait()
  }

  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0x35700c4a7BD65048f01D6675F09d15771c0fAcd5"]
  })

  await signer[0].sendTransaction({ value: ethers.utils.parseEther("1"), to: "0x35700c4a7BD65048f01D6675F09d15771c0fAcd5"})

  const providerOwner = await ethers.provider.getSigner("0x35700c4a7BD65048f01D6675F09d15771c0fAcd5")
  const tx = await provider.connect(providerOwner).populateTransaction.addExchange(router.address);
  await providerOwner.sendTransaction(tx);

  const tx1 = await provider.connect(providerOwner).populateTransaction.addExchange("0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F");
  await providerOwner.sendTransaction(tx1);

  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: ["0x35700c4a7BD65048f01D6675F09d15771c0fAcd5"]
  });

  const apiID = 1;

  await execute(
    "UTacoChef",
    {from: owner},
    "setProvider",
    ...[provider.address]
  )

  await execute(
    "UTacoChef",
    {from: owner},
    "setApi",
    ...[apiID]
  )
}

module.exports.tags = ["UTacoChef"]
module.exports.dependencies = ["UTacoToken"];
