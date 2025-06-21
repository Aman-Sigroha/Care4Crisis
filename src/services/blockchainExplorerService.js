import { ethers } from 'ethers';

// Addresses to monitor
const ADDRESSES = {
  bitcoin: "tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ethereum: "0xFCe725102101817eC210FcE24F0ec91E277c7d29",
  usdt: "0xFCe725102101817eC210FcE24F0ec91E277c7d29", // Same as ETH for USDT
  solana: "AWKV2E7xsQmnY1tz9tAfMygtrDDhzSsNUGKgc9RxPYcG"
};

// !!! IMPORTANT: REPLACE WITH YOUR OWN KEYS !!!
const ETHERSCAN_API_KEY = 'YOUR_ETHERSCAN_API_KEY'; 
const USDT_CONTRACT_ADDRESS = '0x...'; // Replace with the actual Sepolia USDT contract address

// --- Fetching Functions for Each Blockchain ---

// Fetch Bitcoin data from BlockCypher
export const fetchBitcoinTransactions = async () => {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${ADDRESSES.bitcoin}/full`);
    if (!response.ok) throw new Error('Failed to fetch Bitcoin data');
    const data = await response.json();

    const balance = (data.final_balance / 1e8).toFixed(8);
    const transactions = (data.txs || []).map(tx => ({
      id: tx.hash,
      date: tx.confirmed,
      type: tx.inputs.some(inp => inp.addresses.includes(ADDRESSES.bitcoin)) ? 'sent' : 'received',
      amount: (tx.outputs.find(out => out.addresses.includes(ADDRESSES.bitcoin))?.value / 1e8 || 0).toFixed(8),
      from: tx.inputs[0]?.addresses[0] || 'Unknown',
      to: tx.outputs[0]?.addresses[0] || 'Unknown',
      status: tx.confirmations > 0 ? 'confirmed' : 'pending',
      currency: 'BTC'
    }));

    return { balance, transactions };
  } catch (error) {
    console.error('Error fetching Bitcoin transactions:', error);
    return { balance: '0.00000000', transactions: [] };
  }
};

// Fetch Ethereum & USDT data from Etherscan
export const fetchEthereumTransactions = async () => {
  try {
    const ethBalanceResponse = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${ADDRESSES.ethereum}&tag=latest&apikey=${ETHERSCAN_API_KEY}`);
    const ethTxResponse = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${ADDRESSES.ethereum}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`);

    if (!ethBalanceResponse.ok || !ethTxResponse.ok) throw new Error('Failed to fetch Ethereum data');
    
    const balanceData = await ethBalanceResponse.json();
    const txData = await ethTxResponse.json();

    const balance = ethers.formatEther(balanceData.result);
    const transactions = (txData.result || []).map(tx => ({
      id: tx.hash,
      date: new Date(tx.timeStamp * 1000).toISOString(),
      type: tx.from.toLowerCase() === ADDRESSES.ethereum.toLowerCase() ? 'sent' : 'received',
      amount: ethers.formatEther(tx.value),
      from: tx.from,
      to: tx.to,
      status: tx.isError === '0' ? 'confirmed' : 'failed',
      currency: 'ETH'
    }));

    return { balance, transactions };
  } catch (error) {
    console.error('Error fetching Ethereum transactions:', error);
    return { balance: '0.000000', transactions: [] };
  }
};

export const fetchUSDTTransactions = async () => {
  try {
    const usdtTxResponse = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=tokentx&contractaddress=${USDT_CONTRACT_ADDRESS}&address=${ADDRESSES.usdt}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`);
    const usdtBalanceResponse = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${USDT_CONTRACT_ADDRESS}&address=${ADDRESSES.usdt}&tag=latest&apikey=${ETHERSCAN_API_KEY}`);

    if (!usdtTxResponse.ok || !usdtBalanceResponse.ok) throw new Error('Failed to fetch USDT data');

    const txData = await usdtTxResponse.json();
    const balanceData = await usdtBalanceResponse.json();

    const balance = (balanceData.result / 1e6).toFixed(2); // Assuming 6 decimals for USDT
    const transactions = (txData.result || []).map(tx => ({
      id: tx.hash,
      date: new Date(tx.timeStamp * 1000).toISOString(),
      type: tx.from.toLowerCase() === ADDRESSES.usdt.toLowerCase() ? 'sent' : 'received',
      amount: (tx.value / 1e6).toFixed(2),
      from: tx.from,
      to: tx.to,
      status: 'confirmed',
      currency: 'USDT'
    }));

    return { balance, transactions };
  } catch (error) {
    console.error('Error fetching USDT transactions:', error);
    return { balance: '0.00', transactions: [] };
  }
};

// Fetch Solana data from public RPC
export const fetchSolanaTransactions = async () => {
  try {
    const { Connection, PublicKey, LAMPORTS_PER_SOL } = await import('@solana/web3.js');
    const connection = new Connection('https://api.testnet.solana.com', 'confirmed');
    const pubKey = new PublicKey(ADDRESSES.solana);

    const solBalance = await connection.getBalance(pubKey);
    const balance = (solBalance / LAMPORTS_PER_SOL).toFixed(6);

    const signatures = await connection.getSignaturesForAddress(pubKey, { limit: 20 });
    const transactionDetails = await connection.getParsedTransactions(signatures.map(s => s.signature));

    const transactions = transactionDetails.filter(Boolean).map((tx, i) => {
      const signature = signatures[i];
      const accountIndex = tx.transaction.message.accountKeys.findIndex(acc => acc.pubkey.toBase58() === ADDRESSES.solana);
      const preBalance = tx.meta.preBalances[accountIndex];
      const postBalance = tx.meta.postBalances[accountIndex];
      const lamports = postBalance - preBalance;
      
      return {
        id: signature.signature,
        date: new Date(signature.blockTime * 1000).toISOString(),
        type: lamports > 0 ? 'received' : 'sent',
        amount: (Math.abs(lamports) / LAMPORTS_PER_SOL).toFixed(6),
        from: tx.transaction.message.accountKeys[0].pubkey.toBase58(),
        to: tx.transaction.message.accountKeys[1]?.pubkey.toBase58() || 'Unknown',
        status: tx.meta.err ? 'failed' : 'confirmed',
        currency: 'SOL'
      };
    });

    return { balance, transactions };
  } catch (error) {
    console.error('Error fetching Solana transactions:', error);
    return { balance: '0.000000', transactions: [] };
  }
};


// --- Main Functions ---

export const getAllTransactions = async () => {
  console.log("Fetching all live blockchain transactions...");
  
  const [bitcoin, ethereum, usdt, solana] = await Promise.all([
    fetchBitcoinTransactions(),
    fetchEthereumTransactions(),
    fetchUSDTTransactions(),
    fetchSolanaTransactions()
  ]);

  return { bitcoin, ethereum, usdt, solana };
};

// --- Helper Functions ---

export const getExplorerLink = (currency, address) => {
  const c = currency.toLowerCase();
  if (c === 'bitcoin') return `https://www.blockcypher.com/btc-testnet/address/${address}`;
  if (c === 'ethereum' || c === 'usdt') return `https://sepolia.etherscan.io/address/${address}`;
  if (c === 'solana') return `https://explorer.solana.com/address/${address}?cluster=testnet`;
  return '#';
};

export const getTransactionLink = (currency, txId) => {
  const c = currency.toLowerCase();
  if (c === 'bitcoin') return `https://www.blockcypher.com/btc-testnet/tx/${txId}`;
  if (c === 'ethereum' || c === 'usdt') return `https://sepolia.etherscan.io/tx/${txId}`;
  if (c === 'solana') return `https://explorer.solana.com/tx/${txId}?cluster=testnet`;
  return '#';
}; 