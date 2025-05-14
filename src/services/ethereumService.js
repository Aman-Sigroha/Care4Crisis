import { ethers } from "ethers";
import contractABI from "../../blockchain/artifacts/contracts/Care4CrisisDonation.sol/Care4CrisisDonation.json";

// This will be updated after deployment
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

// Get the MetaMask provider specifically
export const getMetaMaskProvider = () => {
  console.log("Checking for MetaMask provider...");
  
  // Check if window.ethereum exists
  if (!window.ethereum) {
    console.log("window.ethereum is not available");
    return null;
  }

  console.log("window.ethereum properties:", Object.getOwnPropertyNames(window.ethereum));
  
  // Check if window.ethereum has providers
  if (window.ethereum.providers) {
    console.log("window.ethereum.providers exists, checking for MetaMask...");
    const providers = window.ethereum.providers;
    console.log("Available providers:", providers.map(p => p.isMetaMask ? "MetaMask" : (p.isPhantom ? "Phantom" : "Unknown")));
    const metaMaskProvider = providers.find(provider => provider.isMetaMask);
    if (metaMaskProvider) {
      console.log("Found MetaMask in providers array");
      return metaMaskProvider;
    }
  }

  // If window.ethereum.isMetaMask exists and is true, it's MetaMask
  if (window.ethereum.isMetaMask) {
    console.log("window.ethereum.isMetaMask is true");
    
    // Check if it's also identified as Phantom
    if (window.ethereum.isPhantom) {
      console.log("WARNING: Provider is identified as both MetaMask and Phantom");
      // We need to determine which one it really is
      // For now, we'll assume it's not MetaMask if it's also identified as Phantom
      return null;
    }
    
    return window.ethereum;
  }

  // In some cases, window.ethereum might be injected by another wallet even though it's MetaMask
  console.log("Additional provider checks:");
  if (window.ethereum.isPhantom) console.log("- isPhantom: true");
  if (window.ethereum.isBraveWallet) console.log("- isBraveWallet: true");
  
  // If it's identified as another wallet, it's not MetaMask
  if (window.ethereum.isPhantom || window.ethereum.isBraveWallet) {
    console.log("Identified as another wallet, not MetaMask");
    return null;
  }
  
  // If we get here and none of the above conditions match, it might still be MetaMask
  // This is a fallback for older versions or unusual configurations
  console.log("Using fallback detection for MetaMask");
  return window.ethereum;
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return getMetaMaskProvider() !== null;
};

// Switch to Sepolia network
export const switchToSepoliaNetwork = async () => {
  try {
    // Get the MetaMask provider
    const provider = getMetaMaskProvider();
    
    // Check if ethereum object exists
    if (!provider) {
      throw new Error("MetaMask is not installed or not accessible");
    }
    
    // Sepolia chain ID in hex
    const sepoliaChainId = '0xaa36a7'; // 11155111 in decimal
    
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: sepoliaChainId }],
    });
    
    return true;
  } catch (error) {
    // This error code means the chain has not been added to MetaMask
    if (error.code === 4902) {
      try {
        const provider = getMetaMaskProvider();
        await provider.request({
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
  const metaMaskProvider = getMetaMaskProvider();
  
  if (!metaMaskProvider) {
    throw new Error("MetaMask is not installed. Please install MetaMask browser extension.");
  }
  
  try {
    console.log("Using MetaMask provider:", metaMaskProvider);
    
    // Special handling for cases where Phantom is interfering
    if (window.ethereum && window.ethereum.isPhantom) {
      console.log("Detected Phantom may be interfering with MetaMask, trying workaround");
      
      // If Phantom exposes a disconnect method, try to disconnect it first
      if (window.solana && typeof window.solana.disconnect === 'function') {
        try {
          console.log("Attempting to disconnect Phantom first");
          await window.solana.disconnect();
          console.log("Successfully disconnected Phantom");
        } catch (err) {
          console.warn("Failed to disconnect Phantom:", err);
          // Continue anyway
        }
      }
    }
    
    // Request accounts and switch to Sepolia
    await metaMaskProvider.request({ method: "eth_requestAccounts" });
    await switchToSepoliaNetwork();
    
    // Create provider
    const provider = new ethers.BrowserProvider(metaMaskProvider);
    
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

// Send Sepolia ETH to a recipient address
export const sendEth = async (recipientAddress, amount) => {
  try {
    console.log(`Sending ${amount} ETH to ${recipientAddress}`);
    
    const metaMaskProvider = getMetaMaskProvider();
    if (!metaMaskProvider) {
      throw new Error("MetaMask not found. Please connect your MetaMask wallet.");
    }
    
    // Get the BrowserProvider and signer
    const provider = new ethers.BrowserProvider(metaMaskProvider);
    const signer = await provider.getSigner();
    const fromAddress = await signer.getAddress();
    
    // Check balance to provide better error messages
    const balance = await provider.getBalance(fromAddress);
    const balanceInEth = parseFloat(ethers.formatEther(balance));
    console.log(`Current wallet balance: ${balanceInEth} ETH`);
    
    const amountToSend = parseFloat(amount);
    
    if (balanceInEth < amountToSend) {
      throw new Error(`Insufficient funds: Your wallet has ${balanceInEth.toFixed(4)} ETH, but you're trying to send ${amountToSend} ETH. Please reduce the amount or add more test ETH to your wallet from a Sepolia faucet.`);
    }
    
    console.log(`Sending from ${fromAddress} to ${recipientAddress}`);
    
    // Build the transaction
    const tx = {
      to: recipientAddress,
      value: ethers.parseEther(amount.toString()),
    };
    
    // Send the transaction
    const txResponse = await signer.sendTransaction(tx);
    console.log('Transaction sent:', txResponse.hash);
    
    // Wait for the transaction to be mined
    const receipt = await txResponse.wait();
    console.log('Transaction confirmed in block:', receipt.blockNumber);
    
    return {
      success: true,
      txHash: txResponse.hash,
      blockNumber: receipt.blockNumber,
      from: fromAddress,
      to: recipientAddress,
      amount
    };
  } catch (error) {
    console.error('Error sending ETH:', error);
    
    // Provide more user-friendly error messages for common issues
    if (error.message.includes("insufficient funds")) {
      throw new Error("Insufficient funds in your wallet. Please get test ETH from a Sepolia faucet.");
    } else if (error.code === "ACTION_REJECTED") {
      throw new Error("You rejected the transaction in MetaMask. Please try again and approve the transaction.");
    } else if (error.message.includes("user rejected") || error.message.includes("User denied")) {
      throw new Error("You rejected the transaction. Please try again and approve the transaction in your wallet.");
    }
    
    throw error;
  }
}; 