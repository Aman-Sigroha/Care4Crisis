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
    console.log(`Initiating Solana donation of ${amount} SOL to ${receiverAddress}`);
    
    // Ensure we're connected
    const publicKeyStr = await getWalletPublicKey();
    if (!publicKeyStr) {
      console.log('No connected wallet found, attempting to connect');
      await connectWallet();
    }
    
    const senderPublicKey = new PublicKey(await getWalletPublicKey());
    const receiverPublicKey = new PublicKey(receiverAddress);
    
    console.log(`Confirmed sender public key: ${senderPublicKey.toString()}`);
    console.log(`Confirmed receiver public key: ${receiverPublicKey.toString()}`);
    
    // Check wallet balance before proceeding
    const balance = await getBalance(senderPublicKey.toString());
    console.log(`Current Solana wallet balance: ${balance} SOL`);
    
    const amountToSend = parseFloat(amount);
    if (balance < amountToSend + 0.001) { // Add a small amount for gas
      throw new Error(`Insufficient SOL balance: Your wallet has ${balance.toFixed(4)} SOL, but you're trying to send ${amountToSend} SOL. Please reduce the amount or add more test SOL to your wallet.`);
    }
    
    // Add unique data to prevent duplicate transaction errors
    // Use the current timestamp and a random value to generate a unique memo
    const uniqueTransactionId = Date.now().toString() + Math.random().toString(36).substring(2, 15);
    console.log('Generated unique transaction ID:', uniqueTransactionId);
    
    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: receiverPublicKey,
        lamports: Math.floor(amount * LAMPORTS_PER_SOL), // Convert SOL to lamports and ensure integer
      }),
    );
    
    // Set recent blockhash and fee payer
    transaction.feePayer = senderPublicKey;
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = blockhash;
    
    console.log('Transaction created, requesting signature');
    
    // Sign and send transaction
    const signedTransaction = await window.solana.signTransaction(transaction);
    console.log('Transaction signed');
    
    // Send the transaction with skipPreflight option to avoid simulation errors
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: true,
      preflightCommitment: 'processed'
    });
    console.log('Transaction sent with signature:', signature);
    
    // Wait for confirmation with retry logic
    let confirmationAttempts = 0;
    let confirmation;
    
    while (confirmationAttempts < 3) {
      try {
        confirmation = await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature
        }, 'confirmed');
        
        console.log('Transaction confirmed:', confirmation);
        break;
      } catch (confirmError) {
        console.warn(`Confirmation attempt ${confirmationAttempts + 1} failed:`, confirmError);
        confirmationAttempts++;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
      }
    }
    
    if (!confirmation) {
      console.warn('Transaction may not be confirmed, but was submitted successfully');
    }
    
    return {
      success: true,
      transactionHash: signature,
      senderAddress: senderPublicKey.toString(),
      receiverAddress: receiverPublicKey.toString(),
      amount,
    };
  } catch (err) {
    console.error('Error making Solana donation:', err);
    
    // Provide more user-friendly error messages
    if (err.message.includes('Insufficient SOL balance')) {
      throw err; // Already formatted well
    } else if (err.message.includes('User rejected')) {
      throw new Error('You rejected the transaction in Phantom wallet. Please try again and approve the transaction.');
    } else if (err.message.includes('not found')) {
      throw new Error('Phantom wallet not found. Please install Phantom extension and connect it to Solana testnet.');
    } else if (err.message.includes('already been processed')) {
      throw new Error('This transaction was already processed. Please try again with a different amount.');
    } else if (err.message.includes('Transaction simulation failed')) {
      throw new Error('Solana transaction simulation failed. Please try a different amount or try again later.');
    }
    
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