import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Solana testnet connection
const connection = new Connection('https://api.testnet.solana.com', 'confirmed');

// Connect to Phantom wallet
export const connectWallet = async () => {
  if (!window.solana || !window.solana.isPhantom) {
    throw new Error('Phantom wallet not found! Please install Phantom to use Solana donations.');
  }
  
  try {
    const resp = await window.solana.connect();
    return resp.publicKey.toString();
  } catch (err) {
    console.error('Failed to connect to Phantom wallet:', err);
    throw err;
  }
};

// Get the connected wallet's public key
export const getWalletPublicKey = async () => {
  if (!window.solana?.isPhantom) {
    return null;
  }
  
  try {
    const resp = await window.solana.connect({ onlyIfTrusted: true });
    return resp.publicKey.toString();
  } catch (err) {
    return null;
  }
};

// Check if wallet is connected
export const isWalletConnected = async () => {
  return await getWalletPublicKey() !== null;
};

// Disconnect wallet
export const disconnectWallet = async () => {
  if (window.solana?.isPhantom) {
    await window.solana.disconnect();
  }
};

// Function to make a donation transaction
export const makeDonation = async (receiverAddress, amount) => {
  if (!window.solana?.isPhantom) {
    throw new Error('Phantom wallet not found');
  }
  
  try {
    // Ensure we're connected
    const publicKeyStr = await getWalletPublicKey();
    if (!publicKeyStr) {
      await connectWallet();
    }
    
    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(await getWalletPublicKey()),
        toPubkey: new PublicKey(receiverAddress),
        lamports: amount * LAMPORTS_PER_SOL, // Convert SOL to lamports
      }),
    );
    
    // Set recent blockhash and fee payer
    transaction.feePayer = new PublicKey(await getWalletPublicKey());
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    
    // Sign and send transaction
    const signedTransaction = await window.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);
    
    return {
      transactionHash: signature,
      senderAddress: await getWalletPublicKey(),
      receiverAddress,
      amount,
    };
  } catch (err) {
    console.error('Error making Solana donation:', err);
    throw err;
  }
};

// Track a campaign's donation status
// Note: Since we're not using a Solana program (smart contract) yet,
// this is a simplified version that just fetches transactions
export const getCampaignTransactions = async (campaignAddress) => {
  try {
    const publicKey = new PublicKey(campaignAddress);
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 20 });
    
    const transactions = await Promise.all(
      signatures.map(async (signatureInfo) => {
        const tx = await connection.getTransaction(signatureInfo.signature);
        return {
          signature: signatureInfo.signature,
          timestamp: new Date(signatureInfo.blockTime * 1000),
          sender: tx.transaction.message.accountKeys[0].toString(),
          amount: tx.meta.postBalances[1] - tx.meta.preBalances[1], // in lamports
        };
      })
    );
    
    return transactions;
  } catch (err) {
    console.error('Error fetching Solana transactions:', err);
    throw err;
  }
};

// Helper to check current SOL balance
export const getBalance = async (address) => {
  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL; // Convert lamports to SOL
  } catch (err) {
    console.error('Error fetching balance:', err);
    throw err;
  }
}; 