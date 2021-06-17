// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./UTacoToken.sol";
import "./interfaces/ILiquidityProvider.sol";
import "hardhat/console.sol";

interface IMigrator {
    // Perform LP token migration from legacy UniswapV2 to TacoSwap.
    // Take the current LP token address and return the new LP token address.
    // Migrator should have full access to the caller's LP token.
    // Return the new LP token address.
    //
    // XXX Migrator must have allowance access to UniswapV2 LP tokens.
    // TacoSwap must mint EXACTLY the same amount of TacoSwap LP tokens or
    // else something bad will happen. Traditional UniswapV2 does not
    // do that so be careful!
    function migrate(IERC20 token) external returns (IERC20);
}

/**
 * @title UTacoChef is the master of UTaco
 * @notice UTacoChef contract:
 * - Users can:
 *   # Deposit
 *   # Harvest
 *   # Withdraw
 *   # SpeedStake
 */
contract UTacoChef is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    /**
    * @notice Info of each user
    * @param amount: How many LP tokens the user has provided
    * @param rewardDebt: Reward debt. See explanation below
    * @dev Any point in time, the amount of UTACOs entitled to a user but is pending to be distributed is:
    *    pending reward = (user.amount * pool.accUTacoPerShare) - user.rewardDebt

    *    Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
    *      1. The pool's `accUTacoPerShare` (and `lastRewardBlock`) gets updated.
    *      2. User receives the pending reward sent to his/her address.
    *      3. User's `amount` gets updated.
    *      4. User's `rewardDebt` gets updated.
    */
    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
    }

    /**
     * @notice Info of each pool
     * @param lpToken: Address of LP token contract
     * @param allocPoint: How many allocation points assigned to this pool. UTACOs to distribute per block
     * @param lastRewardBlock: Last block number that UTACOs distribution occurs
     * @param accUTacoPerShare: Accumulated UTACOs per share, times 1e12. See below
     */
    struct PoolInfo {
        IERC20 lpToken; // Address of LP token contract.
        uint256 allocPoint; // How many allocation points assigned to this pool. UTACOs to distribute per block.
        uint256 lastRewardBlock; // Last block number that UTACOs distribution occurs.
        uint256 accUTacoPerShare; // Accumulated UTACOs per share, times 1e12. See below.
    }
    /// The UTACO TOKEN!
    UTacoToken public utaco;
    /// Dev address.
    address public devaddr;
    /// The Liquidity Provider
    ILiquidityProvider public provider;
    ///  Block number when bonus UTACO period ends.
    uint256 public endBlock;
    ///  UTACO tokens created in first block.
    uint256 public utacoForFirstBlock;
    /// The migrator contract. Can only be set through governance (owner).
    IMigrator public migrator;
    /// Info of each pool.
    PoolInfo[] public poolInfo;
    /// Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    mapping(address => bool) public isPoolExist;
    /// Total allocation poitns. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint;
    /// The block number when UTACO mining starts.
    uint256 public startBlock;
    uint256 private _apiID;
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Harvest(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event Provider(address oldProvider, address newProvider);
    event Api(uint256 id);
    event Migrator(address migratorAddress);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    modifier validatePoolByPid(uint256 _pid) {
        require(_pid < poolInfo.length, "Pool does not exist");
        _;
    }

    constructor(
        UTacoToken _utaco,
        address _devaddr,
        uint256 _utacoForFirstBlock,
        uint256 _startBlock,
        uint256 _endBlock
    ) public {
        require(address(_utaco) != address(0x0), "UTacoChef::set zero address");
        require(_devaddr != address(0x0), "UTacoChef::set zero address");

        utaco = _utaco;
        devaddr = _devaddr;
        utacoForFirstBlock = _utacoForFirstBlock;
        endBlock = _endBlock;
        startBlock = _startBlock;
    }

    /// @return All pools amount
    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    /**
     * @notice Function for set provider. Can be set by the owner
     * @param _provider: address of liquidity provider contract
     */
    function setProvider(address payable _provider) external onlyOwner {
        require(_provider != address(0x0), "UTacoChef::set zero address");
        emit Provider(address(provider), _provider);
        provider = ILiquidityProvider(_provider);
    }

    /**
     * @notice Function for set apiID. Can be set by the owner
     * @param _id: Api ID in liquidity provider contract
     */
    function setApi(uint256 _id) external onlyOwner {
        _apiID = _id;
        emit Api(_id);
    }

    /**
     * @notice Add a new lp to the pool. Can only be called by the owner
     * @param _allocPoint: allocPoint for new pool
     * @param _lpToken: address of lpToken for new pool
     * @param _withUpdate: if true, update all pools
     */
    function add(
        uint256 _allocPoint,
        IERC20 _lpToken,
        bool _withUpdate
    ) public onlyOwner {
        require(
            !isPoolExist[address(_lpToken)],
            "UTacoChef:: LP token already added"
        );
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock =
            block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                allocPoint: _allocPoint,
                lastRewardBlock: lastRewardBlock,
                accUTacoPerShare: 0
            })
        );
        isPoolExist[address(_lpToken)] = true;
    }

    /**
     * @notice Update the given pool's UTACO allocation point. Can only be called by the owner
     */
    function set(
        uint256 _pid,
        uint256 _allocPoint,
        bool _withUpdate
    ) public onlyOwner validatePoolByPid(_pid) {
        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(
            _allocPoint
        );
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    /**
     * @notice Set the migrator contract. Can only be called by the owner
     * @param _migrator: migrator contract
     */
    function setMigrator(IMigrator _migrator) public onlyOwner {
        migrator = _migrator;
        emit Migrator(address(_migrator));
    }

    /**
     * @notice Migrate lp token to another lp contract. Can be called by anyone
     * @param _pid: ID of pool which message sender wants to migrate
     */
    function migrate(uint256 _pid) public {
        require(address(migrator) != address(0), "migrate: no migrator");
        PoolInfo storage pool = poolInfo[_pid];
        IERC20 lpToken = pool.lpToken;
        uint256 bal = lpToken.balanceOf(address(this));
        lpToken.safeApprove(address(migrator), bal);
        IERC20 newLpToken = migrator.migrate(lpToken);
        require(bal == newLpToken.balanceOf(address(this)), "migrate: bad");
        pool.lpToken = newLpToken;
    }

    /**
     * @notice Reward decreases with each block
     * @param _block: block number for which the reward should be calculated
     * @return Returns reward for _block
     */
    function getRewardForBlock(uint256 _block) public view returns (uint256) {
        if (_block > endBlock || _block < startBlock) {
            return 0;
        }
        return
            utacoForFirstBlock.sub(
                _block.sub(startBlock).mul(utacoForFirstBlock).div(
                    endBlock.sub(startBlock)
                )
            );
    }

    /**
     * @param _from: block number from which the reward is calculated
     * @param _to: block number before which the reward is calculated
     * @return Return reward multiplier over the given _from to _to block
     */
    function getReward(uint256 _from, uint256 _to)
        public
        view
        returns (uint256)
    {
        require(
            _from <= _to,
            "UTacoChef:: from should be less or equal than to"
        );
        if (_to > endBlock) {
            _to = endBlock;
        }
        return
            getRewardForBlock(_to)
                .add(getRewardForBlock(_from + 1))
                .mul(_to.sub(_from))
                .div(2);
    }

    /**
     * @notice View function to see pending UTACOs on frontend
     * @param _pid: pool ID for which reward must be calculated
     * @param _user: user address for which reward must be calculated
     * @return Return reward for user
     */
    function pendingUTaco(uint256 _pid, address _user)
        external
        view
        validatePoolByPid(_pid)
        returns (uint256)
    {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accUTacoPerShare = pool.accUTacoPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));

        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getReward(pool.lastRewardBlock, block.number);
            uint256 utacoReward =
                multiplier.mul(pool.allocPoint).div(totalAllocPoint);
            accUTacoPerShare = accUTacoPerShare.add(
                utacoReward.mul(1e12).div(lpSupply)
            );
        }
        return user.amount.mul(accUTacoPerShare).div(1e12).sub(user.rewardDebt);
    }

    /**
     * @notice Update reward vairables for all pools
     */
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    /**
     * @notice Update reward variables of the given pool to be up-to-date
     * @param _pid: pool ID for which the reward variables should be updated
     */
    function updatePool(uint256 _pid) public validatePoolByPid(_pid) {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getReward(pool.lastRewardBlock, block.number);
        uint256 utacoReward =
            multiplier.mul(pool.allocPoint).div(totalAllocPoint);
        safeUTacoTransfer(devaddr, utacoReward.div(10));
        // utacoReward = utacoReward.mul(9).div(10);
        // safeUTacoTransfer(address(this), utacoReward); instant send 33% : 66%
        pool.accUTacoPerShare = pool.accUTacoPerShare.add(
            utacoReward.mul(1e12).div(lpSupply)
        );
        pool.lastRewardBlock = block.number;
    }

    /**
     * @notice Deposit LP tokens to UTacoChef for UTACO allocation
     * @param _pid: pool ID on which LP tokens should be deposited
     * @param _amount: the amount of LP tokens that should be deposited
     */
    function deposit(uint256 _pid, uint256 _amount)
        public
        validatePoolByPid(_pid)
    {
        updatePool(_pid);
        poolInfo[_pid].lpToken.safeTransferFrom(
            address(msg.sender),
            address(this),
            _amount
        );

        _deposit(_pid, _amount);
    }

    /**
     * @notice Function for updating user info
     */
    function _deposit(uint256 _pid, uint256 _amount) private {
        UserInfo storage user = userInfo[_pid][msg.sender];
        harvest ( _pid ) ;
        user.amount = user.amount.add(_amount);
        user.rewardDebt = user.amount.mul(poolInfo[_pid].accUTacoPerShare).div(
            1e12
        );
        emit Deposit(msg.sender, _pid, _amount);
    }

    /**
     * @notice Function which send accumulated UTaco tokens to messege sender
     * @param _pid: pool ID from which the accumulated UTaco tokens should be received
     */
    function harvest(uint256 _pid) public validatePoolByPid(_pid) {
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        uint256 accUTacoPerShare = poolInfo[_pid].accUTacoPerShare;
        uint256 accumulatedUTaco = user.amount.mul(accUTacoPerShare).div(1e12);
        uint256 pending = accumulatedUTaco.sub(user.rewardDebt);

        safeUTacoTransfer(msg.sender, pending);

        user.rewardDebt = user.amount.mul(accUTacoPerShare).div(1e12);

        emit Harvest(msg.sender, _pid, pending);
    }

    /**
     * @notice Function which send accumulated UTaco tokens to messege sender from all pools
     */
    function harvestAll() public {
        uint256 length = poolInfo.length;
        for (uint256 i = 0; i < length; i++) {
            harvest(i);
        }
    }

    /**
     * @notice Function which withdraw LP tokens to messege sender with the given amount
     * @param _pid: pool ID from which the LP tokens should be withdrawn
     * @param _amount: the amount of LP tokens that should be withdrawn
     */
    function withdraw(uint256 _pid, uint256 _amount)
        public
        validatePoolByPid(_pid)
    {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        updatePool(_pid);
        uint256 pending =
            user.amount.mul(pool.accUTacoPerShare).div(1e12).sub(
                user.rewardDebt
            );
        safeUTacoTransfer(msg.sender, pending);
        user.amount = user.amount.sub(_amount);
        user.rewardDebt = user.amount.mul(pool.accUTacoPerShare).div(1e12);
        pool.lpToken.safeTransfer(address(msg.sender), _amount);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    /**
     * @notice Function which withdraw all LP tokens to messege sender without caring about rewards
     */
    function emergencyWithdraw(uint256 _pid) public validatePoolByPid(_pid) nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
    }

    /**
     * @notice Function which transfer UTaco tokens to _to with the given amount
     * @param _to: transfer reciver address
     * @param _amount: amount of UTaco token which should be transfer
     */
    function safeUTacoTransfer(address _to, uint256 _amount) internal {
        uint256 utacoBal = utaco.balanceOf(address(this));
        if (_amount > utacoBal) {
            utaco.transfer(_to, utacoBal);
        } else {
            utaco.transfer(_to, _amount);
        }
    }

    /**
     * @notice Function which should be update dev address by the previous dev
     * @param _devaddr: new dev address
     */
    function dev(address _devaddr) public {
        require(msg.sender == devaddr, "UTacoCHef: dev wut?");
        require(_devaddr == address(0), "UTacoCHef: dev address can't be zero");
        devaddr = _devaddr;
    }

    /**
     * @notice Function which take ETH, add liquidity with provider and deposit given LP's
     * @param _pid: pool ID where we want deposit
     * @param _amountAMin: bounds the extent to which the B/A price can go up before the transaction reverts.
        Must be <= amountADesired.
     * @param _amountBMin: bounds the extent to which the A/B price can go up before the transaction reverts.
        Must be <= amountBDesired
     * @param _minAmountOutA: the minimum amount of output A tokens that must be received
        for the transaction not to revert
     * @param _minAmountOutB: the minimum amount of output B tokens that must be received
        for the transaction not to revert
     */
    function speedStake(
        uint256 _pid,
        uint256 _amountAMin,
        uint256 _amountBMin,
        uint256 _minAmountOutA,
        uint256 _minAmountOutB,
        uint256 _deadline
    ) public payable validatePoolByPid(_pid) {
        (address routerAddr, , ) = provider.apis(_apiID);
        IUniswapV2Router02 router = IUniswapV2Router02(routerAddr);
        delete routerAddr;
        require(
            address(router) != address(0),
            "MasterChef: Exchange does not set yet"
        );
        PoolInfo storage pool = poolInfo[_pid];
        uint256 lp;

        updatePool(_pid);

        IUniswapV2Pair lpToken = IUniswapV2Pair(address(pool.lpToken));
        if (
            (lpToken.token0() == router.WETH()) ||
            ((lpToken.token1() == router.WETH()))
        ) {
            lp = provider.addLiquidityETHByPair{value: msg.value}(
                lpToken,
                address(this),
                _amountAMin,
                _amountBMin,
                _minAmountOutA,
                _deadline,
                _apiID
            );
        } else {
            lp = provider.addLiquidityByPair{value: msg.value}(
                lpToken,
                _amountAMin,
                _amountBMin,
                _minAmountOutA,
                _minAmountOutB,
                address(this),
                _deadline,
                _apiID
            );
        }

        _deposit(_pid, lp);
    }

    /**
     * @notice Function which migrate pool to UTacoChef. Can only be called by the migrator
     */
    function setPools(
        IERC20 _lpToken,
        uint256 _allocPoint,
        uint256 _lastRewardBlock,
        uint256 _accUTacoPerShare,
        uint256 _totalAllocPoint
    ) public {
        require(
            msg.sender == address(migrator),
            "UTacoChef: Only migrator can call"
        );
        poolInfo.push(
            PoolInfo(
                IERC20(_lpToken),
                _allocPoint,
                _lastRewardBlock,
                _accUTacoPerShare
            )
        );
        totalAllocPoint = _totalAllocPoint;
    }

    /**
     * @notice Function which migrate user to UTacoChef
     */
    function setUser(
        uint256 _pid,
        address _user,
        uint256 _amount,
        uint256 _rewardDebt
    ) public {
        require(
            msg.sender == address(migrator),
            "UTacoChef: Only migrator can call"
        );
        require(poolInfo.length != 0, "UTacoChef: Pools must be migrated");
        updatePool(_pid);
        userInfo[_pid][_user] = UserInfo(_amount, _rewardDebt);
    }
}
