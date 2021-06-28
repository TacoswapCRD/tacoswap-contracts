// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/**
 *  @title TacoToETaco contract
 *  @dev Swaps Taco tokens to eTaco tokens with 10:1 ratio.
 **/

contract TacoToETaco is Ownable {
    IERC20 private _taco;
    IERC20 private _etaco;

    /**
     *  @param tacoToken The address of TacoToken
     *  @param etaco The address of eTacoToken
     **/
    constructor(address tacoToken, address etaco) public {
        require(tacoToken != address(0x0), "TacoToETaco::set zero address");
        require(etaco != address(0x0), "TacoToETaco::set zero address");
        _taco = IERC20(tacoToken);
        _etaco = IERC20(etaco);
    }

    /**
     *  @dev Swaps Taco tokens to eTaco tokens with 10:1 ratio.
     *  @param _amountIn The amount of Taco tokens that been given by the user.
     *  @param _to The address of the asset receiver .
     **/
    function swap(uint256 _amountIn, address _to) external {
        require(
            _amountIn % 10 == 0,
            "TacoToETaco: Amount must be divisible by 10"
        );

        _taco.transferFrom(_to, address(this), _amountIn);
        _safeTransfer(_to, _amountIn / 10);
    }

    /**
     *  @dev It transfers the whole contracts balance of eTaco tokens if the given amount is bigger
     *   than contracts balance, otherwise it transfers the given amount.
     *  @param _amount The amount of eTaco tokens that must be sent to user.
     *  @param _to The address of the asset receiver .
     **/
    function _safeTransfer(address _to, uint256 _amount) private {
        if (_amount > _etaco.balanceOf(address(this))) {
            _etaco.transferFrom(
                address(this),
                _to,
                _etaco.balanceOf(address(this))
            );
            return;
        }
        _etaco.transferFrom(address(this), _to, _amount);
    }
}
