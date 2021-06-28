// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./tacoswapv2/interfaces/ITacoswapV2Pair.sol";
import "./tacoswapv2/interfaces/ITacoswapV2Router01.sol";
import "./tacoswapv2/interfaces/ITacoswapV2Factory.sol";
import "./tacoswapv2/libraries/TacoswapV2Library.sol";
import "hardhat/console.sol";

/**
 *  @title  eTacoRoll contract
 *  @notice eTacoRoll helps to migrate your existing UniSwap or SushiSwap LP tokens to TacoSwap LP ones
 **/
contract eTacoRoll {
    using SafeERC20 for IERC20;

    ITacoswapV2Router01 public router;

    /**
     * @notice Construct a new eTacoRoll contract
     *  @param _router The address of TacoSwapV2Router.
     **/
    constructor(ITacoswapV2Router01 _router) public {
        router = _router;
    }

    function migrateWithPermit(
        address tokenA,
        address tokenB,
        address factory,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        ITacoswapV2Pair pair =
            ITacoswapV2Pair(pairForOldRouter(tokenA, tokenB, factory));
        pair.permit(msg.sender, address(this), liquidity, deadline, v, r, s);

        migrate(
            tokenA,
            tokenB,
            factory,
            liquidity,
            amountAMin,
            amountBMin,
            deadline
        );
    }

    /**
     * @notice msg.sender should have approved 'liquidity' amount of LP token of 'tokenA' and 'tokenB'
     * @dev Migrate function removes msg.sender`s LP tokens from old router, 
        add liquidity to new router and after it send remaining tokens to msg.sender
     * @param tokenA The contract address of the desired token.
     * @param tokenB The contract address of the desired token.
     * @param factory The address of old router`s factory.
     * @param liquidity 'liquidity' amount of LP token taht user wants to migrate.
     * @param amountAMin The minimum amount of tokenA that must be received for the transaction not to revert.
     * @param amountBMin The minimum amount of tokenB that must be received for the transaction not to revert.
     * @param deadline Unix timestamp after which the transaction will revert.
     */

    function migrate(
        address tokenA,
        address tokenB,
        address factory,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        uint256 deadline
    ) public {
        require(deadline >= block.timestamp, "TacoSwap: EXPIRED");

        (uint256 amountA, uint256 amountB) =
            _removeLiquidity(
                tokenA,
                tokenB,
                factory,
                liquidity,
                amountAMin,
                amountBMin
            );

        (uint256 pooledAmountA, uint256 pooledAmountB) =
            addLiquidity(tokenA, tokenB, amountA, amountB);

        if (amountA > pooledAmountA) {
            IERC20(tokenA).safeTransfer(msg.sender, amountA - pooledAmountA);
        }
        if (amountB > pooledAmountB) {
            IERC20(tokenB).safeTransfer(msg.sender, amountB - pooledAmountB);
        }
    }

    /**
     * @dev Removes 'liquidity' amount of LP token from old router.
     * @param tokenA The contract address of the desired token.
     * @param tokenB The contract address of the desired token.
     * @param factory The address of old router`s factory.
     * @param liquidity 'liquidity' amount of LP token taht user wants to migrate.
     * @param amountAMin The minimum amount of tokenA that must be received for the transaction not to revert.
     * @param amountBMin The minimum amount of tokenB that must be received for the transaction not to revert.
     */

    function _removeLiquidity(
        address tokenA,
        address tokenB,
        address factory,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin
    ) internal returns (uint256 amountA, uint256 amountB) {
        ITacoswapV2Pair pair =
            ITacoswapV2Pair(pairForOldRouter(tokenA, tokenB, factory));
        pair.transferFrom(msg.sender, address(pair), liquidity);
        (uint256 amount0, uint256 amount1) = pair.burn(address(this));
        (address token0, ) = TacoswapV2Library.sortTokens(tokenA, tokenB);
        (amountA, amountB) = tokenA == token0
            ? (amount0, amount1)
            : (amount1, amount0);
        require(amountA >= amountAMin, "eTacoRoll: INSUFFICIENT_A_AMOUNT");
        require(amountB >= amountBMin, "eTacoRoll: INSUFFICIENT_B_AMOUNT");
    }

    /**
     * @dev Calculates the CREATE2 address for a pair without making any external calls.
     * @param _tokenA The contract address of the desired token.
     * @param _tokenB The contract address of the desired token.
     * @param _factory The address of old router`s factory.
     */
    function pairForOldRouter(
        address _tokenA,
        address _tokenB,
        address _factory
    ) internal view returns (address pair) {
        ITacoswapV2Factory factory = ITacoswapV2Factory(_factory);
        pair = factory.getPair(_tokenA, _tokenB);
    }

    /**
     * @dev Add Liquidity in new router.
     * @param tokenA The contract address of the desired token.
     * @param tokenB The contract address of the desired token.
     * @param amountADesired The amount of tokenA to add as liquidity if 
     *  the B/A price is <= amountBDesired/amountADesired (A depreciates).
     * @param amountBDesired The amount of tokenB to add as liquidity if 
     *  the A/B price is <= amountADesired/amountBDesired (B depreciates).
     */

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired
    ) internal returns (uint256 amountA, uint256 amountB) {
        (amountA, amountB) = _addLiquidity(
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired
        );
        address pair =
            TacoswapV2Library.pairFor(router.factory(), tokenA, tokenB);
        IERC20(tokenA).safeTransfer(pair, amountA);
        IERC20(tokenB).safeTransfer(pair, amountB);
        ITacoswapV2Pair(pair).mint(msg.sender);
    }

    function _addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired
    ) internal returns (uint256 amountA, uint256 amountB) {
        // create the pair if it doesn't exist yet
        ITacoswapV2Factory factory = ITacoswapV2Factory(router.factory());
        if (factory.getPair(tokenA, tokenB) == address(0)) {
            factory.createPair(tokenA, tokenB);
        }
        (uint256 reserveA, uint256 reserveB) =
            TacoswapV2Library.getReserves(address(factory), tokenA, tokenB);
        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            uint256 amountBOptimal =
                TacoswapV2Library.quote(amountADesired, reserveA, reserveB);
            if (amountBOptimal <= amountBDesired) {
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint256 amountAOptimal =
                    TacoswapV2Library.quote(amountBDesired, reserveB, reserveA);
                assert(amountAOptimal <= amountADesired);
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }
}
