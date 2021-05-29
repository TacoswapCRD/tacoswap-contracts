// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

/**
 *  @title  UTacoBar contract
 *  @notice This contract handles swapping to and from xUTaco, TacoSwap's staking token
 **/

contract UTacoBar is ERC20("UTacoBar", "xUTACO"){
    using SafeMath for uint256;
    IERC20 public utaco;

    /**
     * @notice Define the UTaco token contract
     *  @param _utaco The address of UTacoToken contract.
     **/

    constructor(IERC20 _utaco) public {
        utaco = _utaco;
    }

    /**
     * @notice Pay some UTACOs. Earn some shares. Locks UTaco and mints xUTaco
     *  @param _amount The amount of Utaco tokens that should be locked.
     **/
    function enter(uint256 _amount) public {
        // Gets the amount of UTaco locked in the contract
        uint256 totalUTaco = utaco.balanceOf(address(this));
        // Gets the amount of xUTaco in existence
        uint256 totalShares = totalSupply();
        // If no xUTaco exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalUTaco == 0) {
            _mint(msg.sender, _amount);
        } 
        // Calculate and mint the amount of xUTaco the UTaco is worth. The ratio will change overtime, 
        // as xUTaco is burned/minted and UTaco deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount.mul(totalShares).div(totalUTaco);
            _mint(msg.sender, what);
        }
        // Lock the UTaco in the contract
        utaco.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your UTACOs.
    // Unlocks the staked + gained UTaco and burns xUTaco
    function leave(uint256 _share) public {
        // Gets the amount of xUTaco in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of UTaco the xUTaco is worth
        uint256 what = _share.mul(utaco.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        utaco.transfer(msg.sender, what);
    }
}
