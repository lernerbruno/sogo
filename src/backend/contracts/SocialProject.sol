// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SocialProject {
    struct Claim {
        string firstName;
        string lastName;
        string eMail;
        address desiredWallet;
    }
    event CashOutComplete(uint256 cashOutAmount);
    event ClaimCreated(string claimId, Claim claim);
    event ClaimApproved(string claimId, Claim claim);
    event ClaimRejected(string claimId, Claim claim);

    string public orgName;
    string public purpose;
    string public description;
    uint256 public orgId;
    uint256 balance;
    mapping(address => uint256) public donations;
    address[] donors;
    uint256[] donationsAmounts;

    
    mapping(string => Claim) public pendingClaims; // claim UUID to Claim
    Claim public activeClaim;
    
    constructor(uint _orgId, string memory _orgName, string memory _purpose, string memory _description) {
        orgName = _orgName;
        orgId = _orgId;
        purpose = _purpose;
        description = _description;
    }

    function withdraw(uint _amount) external {
        // require(msg.sender == ongAccount, "caller is not owner");
        payable(msg.sender).transfer(_amount);
    }

    function getBalance() external view returns (uint256) {
        // When we'll have more tokens:
        // IERC20 tokenContract = IERC20(tokenAddress);
        // uint256 balance = tokenContract.balanceOf(address(this));
        return balance;
    }

    function getName() public view returns (string memory){
        return orgName;
    }

    function getPurpose() public view returns (string memory){
        return purpose;
    }

    function getDescription() public view returns (string memory){
        return description;
    }

    function getDonors() public view returns (address[] memory){
        return donors;
    }

    function getDonationsAmounts() public view returns (uint256[] memory){
        return donationsAmounts;
    }

    function directDonate(uint256 _amount) public payable {
        require(msg.value >= _amount, "not enough ether to donate this amount");
        // payable(address(this)).transfer(msg.value);
        donations[msg.sender] += _amount;
        donors.push(msg.sender);
        donationsAmounts.push(_amount);
        balance += _amount;
    }
}