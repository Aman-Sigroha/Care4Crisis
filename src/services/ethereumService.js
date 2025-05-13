import { ethers } from "ethers";
import contractABI from "../../blockchain/artifacts/contracts/Care4CrisisDonation.sol/Care4CrisisDonation.json";

// This will be updated after deployment
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

// Connect to MetaMask or provider
export const getProvider = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error("No Ethereum wallet found. Please install MetaMask.");
};

// Get contract instance
export const getContract = async (withSigner = false) => {
  const provider = await getProvider();
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractABI.abi,
    provider
  );

  if (withSigner) {
    const signer = await provider.getSigner();
    return contract.connect(signer);
  }

  return contract;
};

// Get all campaigns
export const getAllCampaigns = async () => {
  try {
    const contract = await getContract();
    const campaignCount = await contract.numberOfCampaigns();
    const campaigns = [];

    for (let i = 0; i < campaignCount; i++) {
      const campaignDetails = await contract.getCampaignDetails(i);
      
      // Format campaign data
      campaigns.push({
        id: i,
        ngoAddress: campaignDetails[0],
        title: campaignDetails[1],
        description: campaignDetails[2],
        targetAmount: ethers.formatEther(campaignDetails[3]),
        deadline: new Date(campaignDetails[4] * 1000), // Convert Unix timestamp to Date
        amountCollected: ethers.formatEther(campaignDetails[5]),
        isComplete: campaignDetails[6],
        // Get additional details if needed
        donors: await contract.getCampaignDonors(i),
        donations: (await contract.getCampaignDonations(i)).map(amount => 
          ethers.formatEther(amount)
        )
      });
    }

    return campaigns;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

// Create a new campaign
export const createCampaign = async (ngoAddress, title, description, targetAmount, deadline) => {
  try {
    const contract = await getContract(true);
    const tx = await contract.createCampaign(
      ngoAddress,
      title,
      description,
      ethers.parseEther(targetAmount.toString()),
      Math.floor(deadline.getTime() / 1000) // Convert Date to Unix timestamp
    );

    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};

// Donate to a campaign
export const donateToCampaign = async (campaignId, amount) => {
  try {
    const contract = await getContract(true);
    const tx = await contract.donateToCampaign(campaignId, {
      value: ethers.parseEther(amount.toString())
    });

    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error donating to campaign:", error);
    throw error;
  }
};

// Release funds for a campaign
export const releaseFunds = async (campaignId) => {
  try {
    const contract = await getContract(true);
    const tx = await contract.releaseFunds(campaignId);

    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error releasing funds:", error);
    throw error;
  }
};

// Listen for events (donations, releases, etc.)
export const setupEventListeners = (onDonation, onFundRelease) => {
  const setupEvents = async () => {
    const contract = await getContract();
    
    contract.on("DonationMade", (campaignId, donor, amount, event) => {
      if (onDonation) {
        onDonation({
          campaignId: campaignId.toString(),
          donor,
          amount: ethers.formatEther(amount),
          transactionHash: event.log.transactionHash
        });
      }
    });
    
    contract.on("FundsReleased", (campaignId, ngoAddress, amount, event) => {
      if (onFundRelease) {
        onFundRelease({
          campaignId: campaignId.toString(),
          ngoAddress,
          amount: ethers.formatEther(amount),
          transactionHash: event.log.transactionHash
        });
      }
    });
    
    // Return a cleanup function
    return () => {
      contract.removeAllListeners();
    };
  };
  
  return setupEvents();
}; 