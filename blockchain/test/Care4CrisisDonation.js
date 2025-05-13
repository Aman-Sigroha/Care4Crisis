const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Care4CrisisDonation", function () {
  let Care4CrisisDonation;
  let donation;
  let owner;
  let ngo;
  let donor1;
  let donor2;

  // Deploy a new contract before each test
  beforeEach(async function () {
    [owner, ngo, donor1, donor2] = await ethers.getSigners();
    Care4CrisisDonation = await ethers.getContractFactory("Care4CrisisDonation");
    donation = await Care4CrisisDonation.deploy();
    await donation.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await donation.platformOwner()).to.equal(owner.address);
    });

    it("Should have 0 campaigns initially", async function () {
      expect(await donation.numberOfCampaigns()).to.equal(0);
    });
  });

  describe("Campaign Creation", function () {
    it("Should create a new campaign correctly", async function () {
      const title = "Water Project";
      const description = "Clean water for rural areas";
      const targetAmount = ethers.parseEther("1.0");
      const oneWeekInSeconds = 7 * 24 * 60 * 60;
      const deadline = Math.floor(Date.now() / 1000) + oneWeekInSeconds;

      await donation.createCampaign(
        ngo.address,
        title,
        description,
        targetAmount,
        deadline
      );

      expect(await donation.numberOfCampaigns()).to.equal(1);

      const campaignDetails = await donation.getCampaignDetails(0);
      expect(campaignDetails.ngoAddress).to.equal(ngo.address);
      expect(campaignDetails.title).to.equal(title);
      expect(campaignDetails.description).to.equal(description);
      expect(campaignDetails.targetAmount).to.equal(targetAmount);
      expect(campaignDetails.deadline).to.equal(deadline);
      expect(campaignDetails.amountCollected).to.equal(0);
      expect(campaignDetails.isComplete).to.equal(false);
    });

    it("Should revert when deadline is in the past", async function () {
      const title = "Water Project";
      const description = "Clean water for rural areas";
      const targetAmount = ethers.parseEther("1.0");
      const deadline = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

      await expect(
        donation.createCampaign(
          ngo.address,
          title,
          description,
          targetAmount,
          deadline
        )
      ).to.be.revertedWith("Deadline must be in the future");
    });
  });

  describe("Donations", function () {
    let campaignId;
    const title = "Water Project";
    const description = "Clean water for rural areas";
    const targetAmount = ethers.parseEther("1.0");
    const oneWeekInSeconds = 7 * 24 * 60 * 60;
    const deadline = Math.floor(Date.now() / 1000) + oneWeekInSeconds;

    beforeEach(async function () {
      await donation.createCampaign(
        ngo.address,
        title,
        description,
        targetAmount,
        deadline
      );
      campaignId = 0;
    });

    it("Should accept donations and update campaign data", async function () {
      const donationAmount = ethers.parseEther("0.5");
      
      await donation.connect(donor1).donateToCampaign(campaignId, {
        value: donationAmount,
      });

      const campaignDetails = await donation.getCampaignDetails(campaignId);
      expect(campaignDetails.amountCollected).to.equal(donationAmount);

      const donors = await donation.getCampaignDonors(campaignId);
      expect(donors[0]).to.equal(donor1.address);

      const donations = await donation.getCampaignDonations(campaignId);
      expect(donations[0]).to.equal(donationAmount);
    });

    it("Should automatically release funds when target is reached", async function () {
      const donationAmount = ethers.parseEther("1.0"); // Equal to target amount
      const initialNgoBalance = await ethers.provider.getBalance(ngo.address);
      
      await donation.connect(donor1).donateToCampaign(campaignId, {
        value: donationAmount,
      });

      const campaignDetails = await donation.getCampaignDetails(campaignId);
      expect(campaignDetails.isComplete).to.equal(true);

      const finalNgoBalance = await ethers.provider.getBalance(ngo.address);
      expect(finalNgoBalance - initialNgoBalance).to.equal(donationAmount);
    });
  });

  describe("Fund Release", function () {
    let campaignId;
    const title = "Water Project";
    const description = "Clean water for rural areas";
    const targetAmount = ethers.parseEther("2.0");
    const oneWeekInSeconds = 7 * 24 * 60 * 60;
    const deadline = Math.floor(Date.now() / 1000) + oneWeekInSeconds;

    beforeEach(async function () {
      await donation.createCampaign(
        ngo.address,
        title,
        description,
        targetAmount,
        deadline
      );
      campaignId = 0;
      
      // Donate half of the target amount
      await donation.connect(donor1).donateToCampaign(campaignId, {
        value: ethers.parseEther("1.0"),
      });
    });

    it("Should allow manual release after deadline", async function () {
      // Increase time to pass deadline
      await ethers.provider.send("evm_increaseTime", [oneWeekInSeconds + 1]);
      await ethers.provider.send("evm_mine");

      const initialNgoBalance = await ethers.provider.getBalance(ngo.address);
      
      await donation.releaseFunds(campaignId);
      
      const campaignDetails = await donation.getCampaignDetails(campaignId);
      expect(campaignDetails.isComplete).to.equal(true);

      const finalNgoBalance = await ethers.provider.getBalance(ngo.address);
      expect(finalNgoBalance - initialNgoBalance).to.equal(ethers.parseEther("1.0"));
    });

    it("Should prevent release before deadline if target not reached", async function () {
      await expect(donation.releaseFunds(campaignId)).to.be.revertedWith(
        "Release conditions not met"
      );
    });
  });
}); 