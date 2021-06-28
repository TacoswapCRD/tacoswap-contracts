// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

// #if IS_PROXY
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// #else
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// #endif

// #if IS_PROXY
contract TestToken is ERC20Upgradeable, OwnableUpgradeable {
// #else
contract TestToken is ERC20("Test Token", "TT"), Ownable {
// #endif

    // #if IS_PROXY
    function initialize() public initializer {
        __Ownable_init();
        __ERC20_init("Test Token", "TT");
        mint(msg.sender, 10000000000000000000000); //10000 ETH
    }
    // #else
    constructor() public {
        mint(msg.sender, 10000000000000000000000); //10000 ETH
    }
    // #endif

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    function burn(uint256 _amount) public {
        _burn(msg.sender, _amount);
    }

    function burnFrom(address _account, uint256 _amount) public {
        uint256 currentAllowance = allowance(_account, msg.sender);
        require(
            currentAllowance >= _amount,
            "ERC20: burn amount exceeds allowance"
        );
        _approve(_account, msg.sender, currentAllowance - _amount);
        _burn(_account, _amount);
    }
}