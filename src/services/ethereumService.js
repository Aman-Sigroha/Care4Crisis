import { ethers } from "ethers";
import contractABI from "../../blockchain/artifacts/contracts/Care4CrisisDonation.sol/Care4CrisisDonation.json";

// This will be updated after deployment
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && Boolean(window.ethereum);
};

// Switch to Sepolia network
export const switchToSepoliaNetwork = async () => {
  try {
    // Sepolia chain ID in hex
    const sepoliaChainId = '0xaa36a7'; // 11155111 in decimal
    
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: sepoliaChainId }],
    });
    
    return true;
  } catch (error) {
    // This error code means the chain has not been added to MetaMask
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Error adding Sepolia network:', addError);
        throw addError;
      }
    } else {
      console.error('Error switching to Sepolia network:', error);
      throw error;
    }
  }
};

// Connect to MetaMask
export const getProvider = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed. Please install MetaMask browser extension.");
  }
  
  try {
    // Request accounts and switch to Sepolia
    await window.ethereum.request({ method: "eth_requestAccounts" });
    await switchToSepoliaNetwork();
    
    // Create provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Test the connection by getting the network
    const network = await provider.getNetwork();
    console.log("Connected to network:", network.name);
    
    return provider;
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    if (error.code === -32002) {
      // MetaMask is already processing a request
      throw new Error("MetaMask connection request already pending. Please check your MetaMask extension.");
    } else if (error.code === 4001) {
      // User rejected the request
      throw new Error("Connection request rejected. Please approve the connection request in MetaMask.");
    }
    throw error;
  }
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