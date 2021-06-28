// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./tacoswapv2/interfaces/ITacoswapV2Pair.sol";
import "./tacoswapv2/interfaces/ITacoswapV2Factory.sol";
import "./interfaces/IMasterChef.sol";
import "./interfaces/IETacoChef.sol";
import "./DummyToken.sol";
import "hardhat/console.sol";

/**
 *@title Migrator contract
 * - Users can:
 *   #Migrate` migrates LP tokens from TacoChef to eTacoChef
 *   #migrateUserInfo
 * - only owner can
 *   #MigratePools
 **/

contract Migrator is Ownable {
    IMasterChef public oldChef;
    IETacoChef public newChef;
    ITacoswapV2Factory public newFactory;
    address public uniFactory;
    address public sushiFactory;
    uint256 public notBeforeBlock;
    uint256 public desiredLiquidity = uint256(-1);

    mapping(address => bool) public isMigrated;

    /**
     *  @param _oldChef The address of TacoChef contract.
     *  @param _uniFactory The address of UniSwapV2Factory.
     *  @param _sushiFactory The address of SushiSwapFactory.
     *  @param _newFactory The address of TacoSwapV2Factory.
     *  @param _notBeforeBlock The block number before which can`t be migrated.
     *  @param _newChef The address of eTacoChef.
     **/
    constructor(
        address _oldChef,
        address _uniFactory,
        address _sushiFactory,
        ITacoswapV2Factory _newFactory,
        uint256 _notBeforeBlock,
        address _newChef
    ) public {
        require(_oldChef != address(0x0), "Migrator::set zero address");
        require(_uniFactory != address(0x0), "Migrator::set zero address");
        require(_sushiFactory != address(0x0), "Migrator::set zero address");
        require(address(_newFactory) != address(0x0), "Migrator::set zero address");
        require(_newChef != address(0x0), "Migrator::set zero address");
        oldChef = IMasterChef(_oldChef);
        newChef = IETacoChef(_newChef);
        uniFactory = _uniFactory;
        sushiFactory = _sushiFactory;
        newFactory = _newFactory;
        notBeforeBlock = _notBeforeBlock;
    }

    /**
     * @dev Migrates pools which pids are given in array(pools).
     *      Can be called one time, when eTacoChef poolInfo is empty.
     * @param pools Array which contains pids that must be migrated.
     **/
    function migratePools(uint256[] memory pools) external onlyOwner {
        uint256 poolLength = newChef.poolLength();
        uint256 startBlock = newChef.startBlock();
        require(poolLength == 0, "Migrator: only if poolInfo is empty");
        uint256 poolsLength = pools.length;

        for (uint256 i = 0; i < poolsLength; i++) {
            (address lpToken, uint256 allocPoint, , ) =
                oldChef.poolInfo(pools[i]);
            newChef.setPools(
                lpToken,
                allocPoint,
                startBlock - 1,
                0,
                oldChef.totalAllocPoint()
            );
        }
    }

    /**
     *  @dev Migrates UserInfo from TacoChef to eTacoChef
     *   Can be called by user one time and required to call deposit function
     *   with amount = 0, for all pools where the user have some amount before migration.
     **/
    function migrateUserInfo() external {
        require(!isMigrated[msg.sender], "Migrator: Already migrated");
        uint256 oldPoolLength = oldChef.poolLength();
        for (uint256 i = 0; i < oldPoolLength; i++) {
            (, , uint256 lastRewardBlock, ) = oldChef.poolInfo(i);
            (uint256 amount, ) = oldChef.userInfo(i, msg.sender);
            if (amount == 0) continue;
            newChef.setUser(i, msg.sender, amount, 0);
        }
        isMigrated[msg.sender] = true;
    }

    /**
     *  @dev Migrates LP tokens from TacoChef to eTacoChef.
     *   Deploy DummyToken. Mint DummyToken with the same amount of LP tokens.
     *   DummyToken is neaded to pass require in TacoChef contracts migrate function.
     **/
    function migrate(ITacoswapV2Pair orig) public returns (IERC20) {
        // Transfer all LP tokens from oldMaster to newMaster
        // Deploy dummy token
        // Mint same amount of dummy token for oldMaster
        require(
            msg.sender == address(oldChef),
            "Migrator: not from old master chef"
        );
        require(
            block.number >= notBeforeBlock,
            "Migrator: too early to migrate"
        );
        require(
            orig.factory() == uniFactory || orig.factory() == sushiFactory,
            "Migrator: not from old factory"
        );

        DummyToken dummyToken = new DummyToken();
        uint256 lp = orig.balanceOf(msg.sender);
        if (lp == 0) return dummyToken;

        desiredLiquidity = lp;
        orig.transferFrom(msg.sender, address(newChef), lp);
        dummyToken.mint(msg.sender, lp);
        desiredLiquidity = uint256(-1);
        return dummyToken;
    }
}
