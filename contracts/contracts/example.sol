// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract VulnerableDeFi {
    mapping(address => uint256) public balances;
    uint256 public fee; // protocol fee (basis points)

    // Users deposit ETH
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "ETH transfer failed");

        balances[msg.sender] -= amount;
    }

    function setFee(uint256 _fee) external {
        // Anyone can change the fee
        fee = _fee;
    }

    function calculateReward(uint256 amount, uint256 multiplier)
        public
        pure
        returns (uint256)
    {
        // Solidity 0.8+ prevents overflow, but logic issues still possible
        return amount * multiplier;
    }
}
