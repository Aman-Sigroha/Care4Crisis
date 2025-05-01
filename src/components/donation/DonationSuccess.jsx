import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DonationNav from './DonationNav';
import BlockchainConfirmation from './BlockchainConfirmation';
import './DonationSuccess.css';

const DonationSuccess = () => {
  const location = useLocation();
  const [showBlockchainDetails, setShowBlockchainDetails] = useState(false);
  const [donationData, setDonationData] = useState(null);
  
  useEffect(() => {
    // In a real app, we would extract donation data from query params or state
    // For now, we'll set some demo data
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