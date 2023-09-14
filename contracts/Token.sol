// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Import the console.sol library from the Hardhat development environment for debugging purposes.
import "hardhat/console.sol";

contract Token {
    // Public variables for the token
    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply;

    // Mapping to store balances of token holders
    mapping(address => uint256) public balanceOf;
    // Mapping to track allowances for spending tokens on behalf of others
    mapping(address => mapping(address => uint256)) public allowance;

    // Events for tracking transfers and approvals
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    // Constructor to initialize the token
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply; // Assign the initial supply to the contract deployer
    }

    // Transfer tokens from sender to the specified recipient
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value); // Ensure sender has enough tokens

        _transfer(msg.sender, _to, _value); // Internal function to perform the transfer

        return true;
    }

    // Internal function to perform token transfer
    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        require(_to != address(0)); // Prevent transfers to the zero address

        // Update sender and recipient balances
        balanceOf[_from] = balanceOf[_from] - _value;
        balanceOf[_to] = balanceOf[_to] + _value;

        // Emit a Transfer event to log the transfer
        emit Transfer(_from, _to, _value);
    }

    // Approve an address to spend a specified amount of tokens on behalf of the sender
    function approve(address _spender, uint256 _value)
        public
        returns(bool success)
    {
        require(_spender != address(0)); // Ensure the spender's address is valid

        allowance[msg.sender][_spender] = _value; // Set allowance for the spender

        // Emit an Approval event to log the approval
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Transfer tokens from one address to another on behalf of the sender
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
        public
        returns (bool success)
    {
        require(_value <= balanceOf[_from]); // Ensure sender has enough tokens to transfer
        require(_value <= allowance[_from][msg.sender]); // Ensure sender is allowed to spend the specified amount

        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value; // Update the spender's allowance

        _transfer(_from, _to, _value); // Internal function to perform the transfer

        return true;
    }
}
