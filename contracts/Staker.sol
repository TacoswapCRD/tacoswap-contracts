// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IMasterChef.sol";

// #if IS_PROXY
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
// #else
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
// #endif

// #if IS_PROXY
contract Staker is OwnableUpgradeable {
    using SafeERC20Upgradeable for IERC20;
// #else
contract Staker is Ownable {
    using SafeERC20 for IERC20;
// #endif
    IMasterChef private _masterChef;
    IERC20 public token;

    // #if IS_PROXY
    function initialize(IMasterChef _mChef, IERC20 _token) public initializer {
        __Ownable_init();
        _masterChef = _mChef;
        token = _token;
        IERC20(_token).safeApprove(address(_mChef), type(uint256).max);
    }
    // #else
    constructor(IMasterChef _mChef, IERC20 _token) public {
        _masterChef = _mChef;
        token = _token;
        IERC20(_token).safeApprove(address(_mChef), type(uint256).max);
    }
    // #endif

    function depositToMasterChef(uint256 _pid, uint256 _amount) external onlyOwner {
        _masterChef.deposit(_pid, _amount);
    }

    function harvestFromMasterChef(uint256 _pid) external onlyOwner {
        _masterChef.harvest(_pid);
    }
}
