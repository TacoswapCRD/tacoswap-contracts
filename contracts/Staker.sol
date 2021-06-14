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

    // #if IS_PROXY
    function initialize(address _mChef, address _token) public initializer {
        __Ownable_init();
        _masterChef = IMasterChef(_mChef);
        IERC20(_token).safeApprove(_mChef, type(uint256).max);
    }
    // #else
    constructor(address _mChef, address _token) public {
        _masterChef = IMasterChef(_mChef);
        IERC20(_token).safeApprove(_mChef, type(uint256).max);
    }
    // #endif

    function depositToMasterChef(address _token, uint256 _pid, uint256 _amount) external onlyOwner {
        _masterChef.deposit(_pid, _amount);
    }

    function harvestFromMasterChef(uint256 _pid) external onlyOwner {
        _masterChef.harvest(_pid);
    }

    function withdrawAssets(address _token, uint256 _amount) external onlyOwner {
        require(_amount == 0, "Staker::Amount should be gretaer than 0");
        IERC20(_token).safeTransferFrom(address(this), msg.sender, _amount);
    }

    function withdrawAssets(address _token) public onlyOwner {
        IERC20(_token).safeTransferFrom(address(this), msg.sender, IERC20(_token).balanceOf(address(this)));
    }

}