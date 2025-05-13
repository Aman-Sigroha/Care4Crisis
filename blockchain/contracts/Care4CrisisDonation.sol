// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Care4CrisisDonation {
    struct Campaign {
        address payable ngoAddress;
        string title;
        string description;
        uint256 targetAmount;
        uint256 deadline;
        uint256 amountCollected;
        bool isComplete;
        address[] donors;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;
    address public platformOwner;

    event CampaignCreated(uint256 campaignId, address ngoAddress, string title, uint256 targetAmount, uint256 deadline);
    event DonationMade(uint256 campaignId, address donor, uint256 amount);
    event FundsReleased(uint256 campaignId, address ngoAddress, uint256 amount);

    constructor() {
        platformOwner = msg.sender;
    }

    function createCampaign(
        address payable _ngoAddress,
        string memory _title, 
        string memory _description, 
        uint256 _targetAmount, 
        uint256 _deadline
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_targetAmount > 0, "Target amount must be greater than 0");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        
        campaign.ngoAddress = _ngoAddress;
        campaign.title = _title;
        campaign.description = _description;
        campaign.targetAmount = _targetAmount;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.isComplete = false;

        emit CampaignCreated(numberOfCampaigns, _ngoAddress, _title, _targetAmount, _deadline);
        
        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(block.timestamp < campaign.deadline, "Campaign deadline has passed");
        require(!campaign.isComplete, "Campaign is already complete");
        require(msg.value > 0, "Donation amount must be greater than 0");

        campaign.donors.push(msg.sender);
        campaign.donations.push(msg.value);
        campaign.amountCollected += msg.value;

        emit DonationMade(_campaignId, msg.sender, msg.value);

        // Check if target has been reached
        if (campaign.amountCollected >= campaign.targetAmount) {
            releaseFunds(_campaignId);
        }
    }

    function releaseFunds(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(!campaign.isComplete, "Funds have already been released");
        require(
            block.timestamp > campaign.deadline || campaign.amountCollected >= campaign.targetAmount,
            "Release conditions not met"
        );

        campaign.isComplete = true;
        campaign.ngoAddress.transfer(campaign.amountCollected);
        
        emit FundsReleased(_campaignId, campaign.ngoAddress, campaign.amountCollected);
    }

    function getCampaignDonors(uint256 _campaignId) public view returns (address[] memory) {
        return campaigns[_campaignId].donors;
    }

    function getCampaignDonations(uint256 _campaignId) public view returns (uint256[] memory) {
        return campaigns[_campaignId].donations;
    }

    function getCampaignDetails(uint256 _campaignId) public view returns (
        address ngoAddress,
        string memory title,
        string memory description,
        uint256 targetAmount,
        uint256 deadline,
        uint256 amountCollected,
        bool isComplete
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        
        return (
            campaign.ngoAddress,
            campaign.title,
            campaign.description,
            campaign.targetAmount,
            campaign.deadline,
            campaign.amountCollected,
            campaign.isComplete
        );
    }
} 