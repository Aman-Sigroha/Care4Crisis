import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import DonationNav from './DonationNav'; // Removed to prevent double navbar
import BlockchainConfirmation from './BlockchainConfirmation';
import { addTransactionToHistory } from '../../services/blockchainExplorerService';
import './DonationSuccess.css';

// Default wallet addresses for donations (matching the ones in blockchainExplorerService)
const ADDRESSES = {
  bitcoin: "tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ethereum: "0xFCe725102101817eC210FcE24F0ec91E277c7d29",
  usdt: "0xFCe725102101817eC210FcE24F0ec91E277c7d29",
  solana: "AWKV2E7xsQmnY1tz9tAfMygtrDDhzSsNUGKgc9RxPYcG"
};

const DonationSuccess = () => {
  const location = useLocation();
  const [showBlockchainDetails, setShowBlockchainDetails] = useState(false);
  const [donationData, setDonationData] = useState(null);
  
  useEffect(() => {
    // Get transaction data from location state if available
    if (location.state && location.state.transactionResult) {
      console.log('Transaction data received:', location.state);
      
      // Process the transaction data
      const txResult = location.state.transactionResult;
      const donationInfo = location.state.donationData;
      
      // Create a combined data structure for donation details
      const combinedData = {
        id: txResult.txHash || txResult.reference || ('tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)),
        amount: txResult.amount || donationInfo?.amount?.toString() || '0',
        currency: txResult.currency || donationInfo?.cryptoCurrency || 'ETH',
        cause: donationInfo?.causeId ? `Cause ID: ${donationInfo.causeId}` : 'Clean Water Initiative',
        ngo: 'Water Relief NGO', // In a real app, this would come from API
        timestamp: new Date().toISOString(),
        walletAddress: txResult.from || 'Unknown',
        ngoWallet: txResult.to || '0xFCe725102101817eC210FcE24F0ec91E277c7d29',
        status: 'confirmed',
        blockNumber: txResult.blockNumber,
        txHash: txResult.txHash,
        explorerUrl: txResult.explorer
      };
      
      setDonationData(combinedData);
      
      // Save to donation history in localStorage for transparency page
      const transaction = {
        id: txResult.txHash || ('tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9)),
        date: new Date().toISOString(),
        type: 'received',
        amount: String(txResult.amount || '0'),
        from: txResult.from || 'Anonymous Donor',
        to: txResult.to || ADDRESSES[txResult.currency.toLowerCase()] || 'Care4Crisis',
        status: 'confirmed',
        currency: txResult.currency || 'ETH'
      };
      
      // Log the transaction we're about to add
      console.log('Adding transaction to history:', transaction);
      
      // Add the transaction to history service
      addTransactionToHistory(transaction);
    } else {
      // Fallback to default demo data if no transaction data is available
      const demoData = {
        id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        amount: '0.025',
        currency: 'ETH',
        cause: 'Clean Water Initiative',
        ngo: 'Water Relief NGO',
        timestamp: new Date().toISOString(),
        walletAddress: '0xFCe725102101817eC210FcE24F0ec91E277c7d29',
        ngoWallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        status: 'confirmed'
      };
      
      setDonationData(demoData);
    }
    
    // Auto-show blockchain details after 1 second for better UX
    const timer = setTimeout(() => {
      setShowBlockchainDetails(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  // If we're showing blockchain details, render the blockchain confirmation component
  if (showBlockchainDetails && donationData) {
    return (
      <>
        {/* <DonationNav /> Removed to prevent double navbar */}
        <BlockchainConfirmation donation={donationData} />
      </>
    );
  }
  
  // Otherwise show the initial success animation
  return (
    <div className="success-page">
      {/* <DonationNav /> Removed to prevent double navbar */}
      <Container className="success-container text-center">
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark-stem"></div>
            <div className="checkmark-kick"></div>
          </div>
        </div>
        
        <h1>Thank You for Your Donation!</h1>
        <p className="success-message">
          Your contribution will make a real difference in addressing this crisis.
        </p>
        
        <div className="loading-blockchain">
          <div className="spinner"></div>
          <p>Confirming your donation on the blockchain...</p>
        </div>
      </Container>
    </div>
  );
};

export default DonationSuccess; 