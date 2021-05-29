// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/**
 *  @title TacoToUTaco contract
 *  @dev Swaps Taco tokens to UTaco tokens with 10:1 ratio.
 **/

contract TacoToUTaco is Ownable {
    IERC20 private _taco;
    IERC20 private _utaco;

    /**
     *  @param tacoToken The address of TacoToken
     *  @param utaco The address of UTacoToken
     **/
    constructor(address tacoToken, address utaco) public {
        require(tacoToken != address(0x0), "TacoToUTaco::set zero address");
        require(utaco != address(0x0), "TacoToUTaco::set zero address");
        _taco = IERC20(tacoToken);
        _utaco = IERC20(utaco);
    }

    /**
     *  @dev Swaps Taco tokens to UTaco tokens with 10:1 ratio.
     *  @param _amountIn The amount of Taco tokens that been given by the user.
     *  @param _to The address of the asset receiver .
     **/
    function swap(uint256 _amountIn, address _to) external {
        require(
            _amountIn % 10 == 0,
            "TacoToUTaco: Amount must be divisible by 10"
        );

        _taco.transferFrom(_to, address(this), _amountIn);
        _safeTransfer(_to, _amountIn / 10);
    }

    /**
     *  @dev It transfers the whole contracts balance of UTaco tokens if the given amount is bigger
     *   than contracts balance, otherwise it transfers the given amount.
     *  @param _amount The amount of UTaco tokens that must be sent to user.
     *  @param _to The address of the asset receiver .
     **/
    function _safeTransfer(address _to, uint256 _amount) private {
        if (_amount > _utaco.balanceOf(address(this))) {
            _utaco.transferFrom(
                address(this),
                _to,
                _utaco.balanceOf(address(this))
            );
            return;
        }
        _utaco.transferFrom(address(this), _to, _amount);
    }
}
