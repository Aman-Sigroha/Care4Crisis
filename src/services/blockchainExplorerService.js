import { ethers } from 'ethers';

// Get real transaction data from various blockchain explorers
// Note: This is a demo implementation using public APIs,
// in production you would use proper authenticated API calls

// Addresses to monitor - these are the donation contract addresses
const ADDRESSES = {
  bitcoin: "tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ethereum: "0xFCe725102101817eC210FcE24F0ec91E277c7d29",
  usdt: "0xFCe725102101817eC210FcE24F0ec91E277c7d29",
  solana: "AWKV2E7xsQmnY1tz9tAfMygtrDDhzSsNUGKgc9RxPYcG"
};

// Store transaction history in memory
let txCache = {
  ethereum: [],
  solana: [],
  bitcoin: [],
  usdt: []
};

// Add local transaction data from localStorage
const addLocalTransactionsToCache = () => {
  try {
    // Clear transaction cache first to avoid duplicates and ensure fresh data
    txCache = {
      ethereum: [],
      solana: [],
      bitcoin: [],
      usdt: []
    };
    
    // Get donation history from localStorage
    const donationHistoryStr = localStorage.getItem('donationHistory');
    if (donationHistoryStr) {
      const donationHistory = JSON.parse(donationHistoryStr);
      console.log('Loading donation history from localStorage, found:', donationHistory.length, 'items');
      
      // Add each donation to the appropriate cache
      donationHistory.forEach(donation => {
        if (!donation.txHash) return; // Skip donations without transaction hash
        
        const tx = {
          id: donation.txHash,
          date: donation.timestamp || new Date().toISOString(),
          type: 'received',
          amount: donation.amount.toString(),
          from: donation.from || 'Donor',
          to: ADDRESSES[donation.currency.toLowerCase()] || 'Care4Crisis',
          status: 'confirmed',
          currency: donation.currency
        };
        
        const currency = donation.currency.toLowerCase();
        if (txCache[currency]) {
          // No need to check for duplicates since we cleared the cache
          txCache[currency].push(tx);
          console.log(`Added transaction ${tx.id} to ${currency} cache`);
        }
      });
    }
  } catch (err) {
    console.error('Error adding local transactions to cache:', err);
  }
};

// Fetch Ethereum transactions from Sepolia Etherscan API
export const fetchEthereumTransactions = async () => {
  // First add any local transactions
  addLocalTransactionsToCache();
  
  try {
    // In a real app, you would use etherscan API with an API key
    // For demo, we'll use ethers.js to get the most recent transactions
    
    let balance = '0.0';
    
    // Try to get the real ETH balance if MetaMask is available
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const ethBalance = await provider.getBalance(ADDRESSES.ethereum);
        balance = ethers.formatEther(ethBalance);
        console.log('Fetched real ETH balance:', balance);
      } catch (err) {
        console.warn('Could not get real-time ETH balance:', err.message);
      }
    } else {
      console.log('No Ethereum provider available for real-time balance');
    }
    
    // Use our cached transactions and possibly add new ones from MetaMask history
    const connectedAddress = window.ethereum?.selectedAddress;
    
    if (connectedAddress) {
      // Check if any of our recent transactions in MetaMask were to our donation address
      // This is a simpler approach than using Etherscan API for the demo
      // A production app would use proper API calls to blockchain explorers
      
      // Add a placeholder transaction if none exist yet
      if (txCache.ethereum.length === 0) {
        const currentUser = localStorage.getItem('currentUser') 
          ? JSON.parse(localStorage.getItem('currentUser')).email 
          : 'User';
        
        txCache.ethereum.push({
          id: 'placeholder-eth-' + Date.now(),
          date: new Date().toISOString(),
          type: 'received',
          amount: '0.01',
          from: currentUser,
          to: 'Care4Crisis',
          status: 'confirmed',
          currency: 'ETH'
        });
      }
    }
    
    return {
      balance: balance, // Return the real balance if available
      transactions: txCache.ethereum
    };
  } catch (err) {
    console.error('Error fetching Ethereum transactions:', err);
    return { 
      balance: '0.0', 
      transactions: txCache.ethereum 
    };
  }
};

// Fetch Solana transactions 
export const fetchSolanaTransactions = async () => {
  // First add any local transactions
  addLocalTransactionsToCache();
  
  try {
    // For demo purposes, we'll primarily use our cache
    // In a real app, you would use Solana explorer API or solana/web3.js
    
    let balance = '0.0';
    
    // Try to get the Solana balance using the getBalance function if available
    try {
      const { Connection, PublicKey, LAMPORTS_PER_SOL } = await import('@solana/web3.js');
      const connection = new Connection('https://api.testnet.solana.com', 'confirmed');
      const solBalance = await connection.getBalance(new PublicKey(ADDRESSES.solana));
      balance = (solBalance / LAMPORTS_PER_SOL).toFixed(6);
      console.log('Fetched real Solana balance:', balance);
    } catch (err) {
      console.warn('Could not get real-time Solana balance:', err.message);
    }
    
    // Add a placeholder transaction if none exist yet
    if (txCache.solana.length === 0) {
      const currentUser = localStorage.getItem('currentUser') 
        ? JSON.parse(localStorage.getItem('currentUser')).email 
        : 'User';
      
      txCache.solana.push({
        id: 'placeholder-sol-' + Date.now(),
        date: new Date().toISOString(),
        type: 'received',
        amount: '0.05',
        from: currentUser,
        to: 'Care4Crisis',
        status: 'confirmed',
        currency: 'SOL'
      });
    }
    
    return {
      balance: balance,
      transactions: txCache.solana
    };
  } catch (err) {
    console.error('Error fetching Solana transactions:', err);
    return { 
      balance: '0.0', 
      transactions: txCache.solana 
    };
  }
};

// Fetch Bitcoin transactions (placeholder for demo)
export const fetchBitcoinTransactions = async () => {
  // First add any local transactions
  addLocalTransactionsToCache();
  
  // In a real app, you would use a Bitcoin explorer API
  return {
    balance: '0.001',
    transactions: txCache.bitcoin
  };
};

// Fetch USDT transactions (these would be ERC-20 transactions on Ethereum)
export const fetchUSDTTransactions = async () => {
  // First add any local transactions
  addLocalTransactionsToCache();
  
  // In a real app, you would use Etherscan Token API
  return {
    balance: '10.00',
    transactions: txCache.usdt
  };
};

// Add a transaction to the history (for demo purposes)
export const addTransactionToHistory = (transaction) => {
  if (!transaction || !transaction.currency) return;
  
  const currency = transaction.currency.toLowerCase();
  if (txCache[currency]) {
    // Ensure we have a valid transaction ID
    const txId = transaction.id || transaction.txHash || ('tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9));
    
    // Create a standardized transaction record
    const standardTx = {
      id: txId,
      date: transaction.date || new Date().toISOString(),
      type: 'received',
      amount: transaction.amount.toString(),
      from: transaction.from || 'Donor',
      to: transaction.to || ADDRESSES[currency] || 'Care4Crisis',
      status: 'confirmed',
      currency: transaction.currency
    };
    
    // Check if transaction is already in cache using the standardized ID
    const exists = txCache[currency].some(t => t.id === standardTx.id);
    if (!exists) {
      // Add to in-memory cache
      txCache[currency].push(standardTx);
      
      // Also store in local storage for persistence
      try {
        let donationHistory = [];
        const existingHistory = localStorage.getItem('donationHistory');
        if (existingHistory) {
          donationHistory = JSON.parse(existingHistory);
        }
        
        // Format the transaction to match what addLocalTransactionsToCache expects
        const historyEntry = {
          timestamp: standardTx.date,
          amount: standardTx.amount,
          currency: standardTx.currency,
          from: standardTx.from,
          to: standardTx.to,
          txHash: standardTx.id, // Use the standardized ID as txHash
          explorer: getTransactionLink(standardTx.currency, standardTx.id)
        };
        
        // Check if this transaction is already in the donation history
        const existsInHistory = donationHistory.some(item => item.txHash === standardTx.id);
        if (!existsInHistory) {
          donationHistory.push(historyEntry);
          
          localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
          console.log('Transaction saved to donation history:', standardTx.id);
        }
      } catch (err) {
        console.error('Error saving transaction to localStorage:', err);
      }
    }
  }
};

// Get all transactions for all currencies
export const getAllTransactions = async () => {
  // First add any local transactions
  addLocalTransactionsToCache();
  
  const ethereum = await fetchEthereumTransactions();
  const solana = await fetchSolanaTransactions();
  const bitcoin = await fetchBitcoinTransactions();
  const usdt = await fetchUSDTTransactions();
  
  return {
    ethereum,
    solana,
    bitcoin,
    usdt
  };
};

// Helper to generate explorer links
export const getExplorerLink = (currency, address) => {
  switch(currency.toLowerCase()) {
    case 'bitcoin':
      return `https://live.blockcypher.com/btc-testnet/address/${address}/`;
    case 'ethereum':
      return `https://sepolia.etherscan.io/address/${address}`;
    case 'usdt':
      return `https://sepolia.etherscan.io/address/${address}`;
    case 'solana':
      return `https://explorer.solana.com/address/${address}?cluster=testnet`;
    default:
      return '#';
  }
};

export const getTransactionLink = (currency, txId) => {
  switch(currency.toLowerCase()) {
    case 'bitcoin':
      return `https://live.blockcypher.com/btc-testnet/tx/${txId}/`;
    case 'ethereum':
      return `https://sepolia.etherscan.io/tx/${txId}`;
    case 'usdt':
      return `https://sepolia.etherscan.io/tx/${txId}`;
    case 'solana':
      return `https://explorer.solana.com/tx/${txId}?cluster=testnet`;
    default:
      return '#';
  }
}; 