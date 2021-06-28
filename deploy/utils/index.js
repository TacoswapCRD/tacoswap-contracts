const nConfig = {
    "1": "mainnet.json",
    "3": "ropsten.json",
    "4": "rinkeby.json",
    "5": "goerli.json",
    "42": "kovan.json",
    "56": "unknown-56.json", // bsc
    "97": "unknown-97.json", // bsc-testnet
    "100": "unknown-100.json", // xdai
    "128": "unknown-128.json", // heco
    "256": "unknown-256.json", // heco-testnet
    "1287": "unknown-1287.json", // moonbase
    "250": "unknown-250.json", // fantom
    "4002": "unknown-4002.json", // fantom-testnet
    "137": "unknown-137.json", // matic
    "80001": "unknown-80001.json", // mumbai
    "43113": "unknown-43113.json", // fuji
    "43114": "unknown-43114.json", // avalanche
    "1666600000": "unknown-1666600000.json", // harmony
    "1666700000": "unknown-1666700000.json", // harmony-testnet
    "79377087078960": "unknown-79377087078960.json", // arbitrum
    "31337": "unknown-31337.json", // hardhat
}

const eConfig = async () => {
    let preDeployedProxyJSON
    const chainId = await getChainId();
    try {
        preDeployedProxyJSON = require("../../.openzeppelin/" + nConfig[chainId])
    } catch (error) {
        preDeployedProxyJSON = "undefined"
    }

    if (preDeployedProxyJSON == "undefined") {
        if (process.env.UPGRADEABLE_PROXY_ADDRESS === '') {
            return {
                IS_UPGRADE: false,
                IS_PROXY: process.env.IS_PROXY === "true",
            }
        }

        return {
            IS_UPGRADE: process.env.IS_UPGRADE === "true",
            IS_PROXY: process.env.IS_PROXY === "true",
            UPGRADEABLE_PROXY_ADDRESS: process.env.UPGRADEABLE_PROXY_ADDRESS
        }
    }

    const lastDeployedAddress = preDeployedProxyJSON.proxies[preDeployedProxyJSON.proxies.length - 1].address;
    return {
        IS_UPGRADE: process.env.IS_UPGRADE === "true",
        IS_PROXY: process.env.IS_PROXY === "true",
        UPGRADEABLE_PROXY_ADDRESS: process.env.UPGRADEABLE_PROXY_ADDRESS || lastDeployedAddress
    }
}

function printDeployInfo(contractName, contractAddress, chainId, owner) {
    console.log(`${contractName} deployed at: ${contractAddress} address, on chainID: ${chainId}`);
    console.log(`${contractName}'s owner: ${owner}`);
}

function printUpgradeInfo(contractName, contractAddress, proxyAddress, chainId) {
    const preDeployedProxyJSON = require("../../.openzeppelin/" + nConfig[chainId])

    console.log(`${contractName} address: ${contractAddress}`)
    console.log(`Proxy address: ${proxyAddress}`)
    console.log(`AdminProxy address: ${preDeployedProxyJSON.admin.address}`)
}

async function contractDeploy({ ethers, upgrades, deployments, getNamedAccounts, ethernal, getChainId }, options, callback = () => { }) {
    const { deploy } = deployments
    const chainId = await getChainId();
    const { deployer, owner } = await getNamedAccounts()

    if (typeof (options) == "string") {
        options = {
            contractName: options,
            isUpgrade: false,
            isProxy: false,
            args: [],
        }
    }

    let contract, args = options.args || [];

    if (options.isUpgrade) {
        const ContractFactory = await ethers.getContractFactory(options.contractName);
        const contractAddress = await upgrades.prepareUpgrade(options.upgradeableProxyAddress, ContractFactory);
        const proxy = await upgrades.upgradeProxy(options.upgradeableProxyAddress, ContractFactory);

        printUpgradeInfo(options.contractName, contractAddress, proxy.address, chainId);

        return;
    }

    if (chainId !== '31337') {
        if (options.isProxy) {
            const ContractFactory = await ethers.getContractFactory(options.contractName);
            contract = await upgrades.deployProxy(ContractFactory, [...options.args]);

            await contract.deployed();

            callback(contract);
            printDeployInfo(options.contractName, contract.address, chainId, deployer)

            return;
        }

        await deploy(options.contractName, {
            from: deployer,
            args: [...args],
            log: true,
            deterministicDeployment: false
        })

        contract = await ethers.getContract(options.contractName, deployer)

        callback(contract);
        printDeployInfo(options.contractName, contract.address, chainId, deployer)
        return;
    }

    await deploy(options.contractName, {
        from: deployer,
        args: [...args],
        log: true,
        deterministicDeployment: false
    })

    contract = await ethers.getContract(options.contractName, deployer)
    contractOwner = deployer

    if (typeof contract.transferOwnership === "function") {
        // Transfer ownership of contract to owner
        await contract.transferOwnership(owner)
        contractOwner = owner;
    }

    callback(contract);
    printDeployInfo(options.contractName, contract.address, chainId, await contract.owner())
    if (process.env.IS_ETHERNAL_ON === "true") {
        await ethernal.push({
            name: options.contractName,
            address: contract.address
        });
    }
}

module.exports = { nConfig, eConfig, contractDeploy }