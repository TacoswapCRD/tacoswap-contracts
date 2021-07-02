module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  await deploy("MigratorFull", {
    from: deployer,
    args: [
      "0x7F7710e0c7C5C0FF043963dd22C3988e8bDb7AcC",
      "0x502C28F523636251BEEFf8bCd5023eCd1bBb8B3A",
      "0xE1E09B6E9EF88adDDc655534775487Cfe0AfE006",
      "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
      "0x88461aDDA3E00698eEF255395e692EC89CdE5014",
      "0x41C028a4C1F461eBFC3af91619b240004ebAD216",
      "0xFBBD3865EC81fCD1105219A51F0684cd288EcA42",
    ],
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["MigratorFull"]
module.exports.dependencies = []
