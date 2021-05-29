// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

interface IUTacoChef {
    function poolLength() external view returns (uint256);

    function startBlock() external view returns (uint256);

    function setProvider(address) external;

    function setApi(uint256) external;

    function getrewardForBlock(uint256) external view returns (uint256);

    function getReward(uint256, uint256) external view returns (uint256);

    function poolInfo(uint256)
        external
        view
        returns (
            address,
            uint256,
            uint256,
            uint256
        );

    function userInfo(uint256, uint256)
        external
        view
        returns (uint256, uint256);

    function pendingUTaco(uint256, address) external view returns (uint256);

    function speedStake(
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256
    ) external payable returns (uint256);

    function totalAllocPoint() external view returns (uint256);

    function deposit(uint256, uint256) external;

    function setPools(
        address,
        uint256,
        uint256,
        uint256,
        uint256
    ) external;

    function setUser(
        uint256,
        address,
        uint256,
        uint256
    ) external;
}
