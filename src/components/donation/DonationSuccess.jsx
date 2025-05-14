import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DonationNav from './DonationNav';
import BlockchainConfirmation from './BlockchainConfirmation';
import { addTransactionToHistory } from '../../services/blockchainExplorerService';
import './DonationSuccess.css';

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
        id: txResult.txHash,
        date: new Date().toISOString(),
        type: 'received',
        amount: txResult.amount,
        from: txResult.from,
        to: txResult.to,
        status: 'confirmed',
        currency: txResult.currency,
        txHash: txResult.txHash
      };
      
      // Add the transaction to history service
      addTransactionToHistory(transaction);
      
      // Also update localStorage directly (belt and suspenders approach)
      try {
        let donationHistory = [];
        const existingHistory = localStorage.getItem('donationHistory');
        if (existingHistory) {
          donationHistory = JSON.parse(existingHistory);
        }
        
        // Check if this transaction is already in history
        const exists = donationHistory.some(item => item.txHash === txResult.txHash);
        
        if (!exists && txResult.txHash) {
          donationHistory.push({
            timestamp: new Date().toISOString(),
            amount: txResult.amount,
            currency: txResult.currency,
            from: txResult.from,
            to: txResult.to,
            txHash: txResult.txHash,
            explorer: txResult.explorer
          });
          
          localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
          console.log('Transaction saved to donation history');
        }
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
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
        <DonationNav />
        <BlockchainConfirmation donation={donationData} />
      </>
    );
  }
  
  // Otherwise show the initial success animation
  return (
    <div className="success-page">
      <DonationNav />
      
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