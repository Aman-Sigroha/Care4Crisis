import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DonationNav from './DonationNav';
import './DonationPage.css';
import { sendEth } from '../../services/ethereumService';
import { makeDonation } from '../../services/solanaService';

// Import BASE_PATH constant from App.jsx or define it here
const BASE_PATH = '/Care4Crisis';

const DonationPage = () => {
  const [activeTab, setActiveTab] = useState('crypto');
  const [amount, setAmount] = useState('');
  const [cryptoCurrency, setCryptoCurrency] = useState('ETH');
  const [upiId, setUpiId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [email, setEmail] = useState('');
  const [causeDetails, setCauseDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const { causeId } = useParams();
  const navigate = useNavigate();

  // Simulate fetching data from a database
  // In a real application, this would be fetched from an API
  const causes = {
    1: {
      id: 1,
      title: "Clean Water Initiative",
      category: "Water & Sanitation",
      organizer: "WaterAid Foundation",
      organizerId: "wateraid-foundation",
      location: "Eastern Africa",
      description: "Support our mission to provide clean drinking water to 10,000 people in Eastern Africa. Access to clean water is a fundamental human right, yet millions still lack this basic necessity.",
      image: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      goal: 15000,
      raised: 9750,
      daysLeft: 12,
      donationOptions: [10, 25, 50, 100, 250, 500]
    },
    2: {
      id: 2,
      title: "Education for Girls",
      category: "Education",
      organizer: "Education First NGO",
      organizerId: "education-first-ngo",
      location: "South Asia",
      description: "Help us empower 5,000 girls through education in South Asia. By providing educational opportunities, we can break the cycle of poverty and create lasting change.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      goal: 25000,
      raised: 18200,
      daysLeft: 23,
      donationOptions: [10, 25, 50, 100, 250, 500]
    },
    3: {
      id: 3,
      title: "Community Well Construction",
      category: "Infrastructure",
      organizer: "WaterAid Foundation",
      organizerId: "wateraid-foundation",
      location: "South Asia",
      description: "Fund the construction of 15 community wells that will provide clean water to rural villages in South Asia. Each well will serve approximately 200 families.",
      image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      goal: 22000,
      raised: 15300,
      daysLeft: 35,
      donationOptions: [10, 25, 50, 100, 250, 500]
    },
    4: {
      id: 4, 
      title: "School Building Project",
      category: "Education",
      organizer: "Education First NGO",
      organizerId: "education-first-ngo",
      location: "East Africa",
      description: "Support the construction of a new school that will provide quality education to 500 children in a remote area of East Africa. The school will include classrooms, a library, and computer facilities.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      goal: 40000,
      raised: 22500,
      daysLeft: 45,
      donationOptions: [10, 25, 50, 100, 250, 500]
    }
  };

  useEffect(() => {
    // Fetch cause details based on causeId
    const foundCause = causes[causeId] || causes[1];
    setCauseDetails(foundCause);
  }, [causeId]);

  // Get wallet address based on selected cryptocurrency
  const getWalletAddress = (cryptoCurrency) => {
    console.log('Getting wallet address for:', cryptoCurrency);
    // Different wallet addresses for different cryptocurrencies
    // TESTNET ADDRESSES - for demonstration purposes only
    const wallets = {
      ETH: '0xFCe725102101817eC210FcE24F0ec91E277c7d29', // ETH: Sepolia testnet
      BTC: 'tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // BTC: Bitcoin testnet (tb1 prefix)
      USDT: '0xFCe725102101817eC210FcE24F0ec91E277c7d29', // USDT: Sepolia testnet
      SOL: 'AWKV2E7xsQmnY1tz9tAfMygtrDDhzSsNUGKgc9RxPYcG'  // SOL: Solana testnet
    };
    
    const address = wallets[cryptoCurrency] || wallets['ETH'];
    console.log('Selected wallet address:', address, 'for currency:', cryptoCurrency);
    return address;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTransactionResult(null);
    setTransactionError(null);
    
    // Process donation based on active tab
    const donationData = {
      causeId,
      amount: parseFloat(amount),
      paymentMethod: activeTab,
      email
    };

    try {
      // Add payment method specific details
      if (activeTab === 'crypto') {
        donationData.cryptoCurrency = cryptoCurrency;
        
        // Handle cryptocurrency donations with actual blockchain transactions
        if (cryptoCurrency === 'ETH' || cryptoCurrency === 'USDT') {
          // Get recipient address
          const recipientAddress = getWalletAddress(cryptoCurrency);
          console.log(`Starting ETH transaction: Sending ${amount} ${cryptoCurrency} to ${recipientAddress}`);
          
          try {
            // Execute Ethereum transaction - make sure MetaMask is connected
            if (window.ethereum) {
              console.log("Found Ethereum provider, requesting accounts...");
              try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log("Ethereum accounts requested, executing sendEth");
              } catch (connErr) {
                console.error("Error connecting to MetaMask:", connErr);
                // Continue with transaction attempt anyway
              }
            }
            
            // Execute transaction
            const result = await sendEth(recipientAddress, amount);
            console.log('Ethereum transaction result:', result);
            
            if (!result || !result.txHash) {
              throw new Error("Transaction failed - no transaction hash returned");
            }
            
            // Create transaction result object
            const txResult = {
              txHash: result.txHash,
              blockNumber: result.blockNumber,
              from: result.from,
              to: result.to,
              amount: result.amount,
              currency: cryptoCurrency,
              explorer: `https://sepolia.etherscan.io/tx/${result.txHash}`
            };
            
            // Update state and navigate
            setTransactionResult(txResult);
            console.log('Ethereum donation successful:', result);
            
            // Navigate after a slight delay to ensure state is updated
            setTimeout(() => {
              navigate(`${BASE_PATH}/donation-success`, { 
                state: { 
                  transactionResult: txResult,
                  donationData 
                }
              });
            }, 500);
            
            return; // Return early to avoid the navigation at the end
          } catch (ethError) {
            console.error('Ethereum transaction error:', ethError);
            setTransactionError(ethError.message || "Failed to execute Ethereum transaction");
            setIsProcessing(false);
            return;
          }
        } 
        else if (cryptoCurrency === 'SOL') {
          // Get recipient address
          const recipientAddress = getWalletAddress(cryptoCurrency);
          console.log(`Starting SOL transaction: Sending ${amount} SOL to ${recipientAddress}`);
          
          try {
            // Make sure Phantom is connected
            if (window.solana && !window.solana.isConnected) {
              console.log("Solana wallet not connected, trying to connect...");
              try {
                await window.solana.connect();
                console.log("Solana wallet connected");
              } catch (connErr) {
                console.error("Error connecting to Phantom:", connErr);
                throw new Error("Could not connect to Phantom wallet. Please ensure it is installed and unlocked.");
              }
            }
            
            // Add a slight variation to the amount to avoid duplicate transaction errors
            // Solana often has issues with identical transactions
            const adjustedAmount = parseFloat(amount) + (Math.random() * 0.000001);
            console.log(`Adjusted amount for uniqueness: ${adjustedAmount}`);
            
            // Execute Solana transaction
            const result = await makeDonation(recipientAddress, adjustedAmount.toString());
            console.log('Solana transaction complete:', result);
            
            // Create transaction result object
            const txResult = {
              txHash: result.transactionHash,
              from: result.senderAddress,
              to: result.receiverAddress,
              amount: result.amount,
              currency: cryptoCurrency,
              explorer: `https://explorer.solana.com/tx/${result.transactionHash}?cluster=testnet`
            };
            
            // Update state and navigate
            setTransactionResult(txResult);
            console.log('Solana donation successful, navigating to success page');
            
            // Navigate after a slight delay to ensure state is updated
            setTimeout(() => {
              navigate(`${BASE_PATH}/donation-success`, { 
                state: { 
                  transactionResult: txResult,
                  donationData 
                }
              });
            }, 500);
            
            return; // Return early to avoid the navigation at the end
          } catch (solError) {
            console.error('Solana transaction error:', solError);
            
            // If this is a duplicate transaction error, offer to retry with a different amount
            if (solError.message.includes('already been processed')) {
              setTransactionError(
                "Transaction was already processed. Please try again with a slightly different amount. " +
                "Solana requires each transaction to be unique."
              );
            } else {
              setTransactionError(solError.message || "Failed to execute Solana transaction");
            }
            
            setIsProcessing(false);
            return;
          }
        }
        else if (cryptoCurrency === 'BTC') {
          // For Bitcoin, we currently don't have direct integration
          // This would require additional setup with a Bitcoin testnet library
          setTransactionError("Direct Bitcoin testnet transactions are not yet implemented. Please use the QR code or address to send a manual transaction.");
          setIsProcessing(false);
          return;
        }
      } else if (activeTab === 'upi') {
        donationData.upiId = upiId;
        // Simulate UPI transaction
        await new Promise(resolve => setTimeout(resolve, 1500));
        const txResult = {
          reference: `UPI${Date.now()}`,
          method: 'UPI',
          to: 'care4crisis@ybl',
          amount: amount,
          currency: 'INR'
        };
        
        setTransactionResult(txResult);
        
        // Navigate after state is updated
        setTimeout(() => {
          navigate(`${BASE_PATH}/donation-success`, { 
            state: { 
              transactionResult: txResult,
              donationData 
            }
          });
        }, 500);
        
        return; // Return early
      } else if (activeTab === 'netbanking') {
        donationData.accountDetails = {
          name: accountName,
          accountNumber,
          ifscCode
        };
        // Simulate netbanking transaction
        await new Promise(resolve => setTimeout(resolve, 1500));
        const txResult = {
          reference: `NB${Date.now()}`,
          method: 'Net Banking',
          to: 'Care4Crisis Foundation',
          amount: amount,
          currency: 'INR'
        };
        
        setTransactionResult(txResult);
        
        // Navigate after state is updated
        setTimeout(() => {
          navigate(`${BASE_PATH}/donation-success`, { 
            state: { 
              transactionResult: txResult,
              donationData 
            }
          });
        }, 500);
        
        return; // Return early
      }

      console.log('Processing donation:', donationData);
    } catch (error) {
      console.error('Donation error:', error);
      setTransactionError(error.message || 'An error occurred during the donation process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate wallet address and QR code as separate components with their own state
  const CryptoQRCode = ({ cryptoCurrency, amount }) => {
    const [qrUrl, setQrUrl] = useState('');
    
    useEffect(() => {
      console.log(`CryptoQRCode: Generating QR for ${cryptoCurrency} with amount ${amount}`);
      const walletAddress = getWalletAddress(cryptoCurrency);
      let url = '';
      
      // Generate different URL formats based on cryptocurrency
      if (cryptoCurrency === 'BTC') {
        url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:${walletAddress}?amount=${amount}&testnet=true`;
      } else if (cryptoCurrency === 'SOL') {
        url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=solana:${walletAddress}?amount=${amount}&cluster=testnet`;
      } else {
        // ETH and USDT on Sepolia testnet
        url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ethereum:${walletAddress}@11155111?value=${amount}`;
      }
      
      console.log(`Generated QR URL for ${cryptoCurrency}:`, url);
      setQrUrl(url);
    }, [cryptoCurrency, amount]);
    
    return (
      <div className="qr-container">
        {qrUrl && <img src={qrUrl} alt={`${cryptoCurrency} payment QR code`} key={`qr-${cryptoCurrency}-${amount}`} />}
      </div>
    );
  };
  
  const CryptoAddressDisplay = ({ cryptoCurrency }) => {
    const [address, setAddress] = useState('');
    
    useEffect(() => {
      console.log(`CryptoAddressDisplay: Getting address for ${cryptoCurrency}`);
      const walletAddress = getWalletAddress(cryptoCurrency);
      setAddress(walletAddress);
      console.log(`Set address for ${cryptoCurrency}:`, walletAddress);
    }, [cryptoCurrency]);
    
    return (
      <div className="address-box">
        <code className={`crypto-address ${cryptoCurrency}`}>{address}</code>
        <button 
          className="copy-btn" 
          onClick={() => {
            navigator.clipboard.writeText(address);
            alert(`${cryptoCurrency} address copied to clipboard!`);
          }}
        >
          <i className="fas fa-copy"></i>
        </button>
      </div>
    );
  };

  // NGO data for logos and contact info
  const ngoData = {
    "wateraid-foundation": {
      logo: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      email: "contact@wateraid.org",
      website: "https://www.wateraid.org"
    },
    "education-first-ngo": {
      logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      email: "info@educationfirst.org",
      website: "https://www.educationfirst.org"
    },
    "rapid-response-relief": {
      logo: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      email: "info@rapidresponse.org",
      website: "https://www.rapidresponse.org"
    },
    "childrens-health-foundation": {
      logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      email: "contact@childrenshealth.org",
      website: "https://www.childrenshealth.org"
    }
  };

  if (!causeDetails) return <div className="loading">Loading...</div>;

  return (
    <div className="donation-page">
      <DonationNav />
      
      <div className="donation-hero">
        <h1>SUPPORT THE <span className="highlight">CAUSE</span></h1>
        <p>Make a difference with your contribution</p>
      </div>
      
      <Container>
        <Alert variant="info" className="mb-4">
          <Alert.Heading>Demo Mode - Testnet</Alert.Heading>
          <p>
            This donation platform is currently running on Ethereum Sepolia testnet for demonstration purposes.
            No real cryptocurrency is being transferred. Use testnet tokens to experience the donation flow.
          </p>
          <hr />
          <p className="mb-0">
            Need testnet ETH? <a href="https://sepolia-faucet.pk910.de/" target="_blank" rel="noopener noreferrer">Get Sepolia ETH here</a>
          </p>
        </Alert>
        
        <Row className="donation-content">
          <Col lg={4} md={5}>
            <div className="cause-summary">
              <Card className="summary-card">
                <Card.Img variant="top" src={causeDetails.image || "https://via.placeholder.com/400x250?text=Donation+Cause"} />
                <Card.Body>
                  <div className="cause-category">{causeDetails.category}</div>
                  <Card.Title>{causeDetails.title}</Card.Title>
                  <div className="organizer">
                    <i className="fas fa-building"></i> {causeDetails.organizer}
                    <Button 
                      variant="link" 
                      className="view-ngo-btn"
                      onClick={() => navigate(`${BASE_PATH}/ngo-info/${causeDetails.organizerId}`)}
                    >
                      <i className="fas fa-info-circle"></i> NGO Info
                    </Button>
                  </div>
                  
                  <div className="ngo-info-area">
                    <div className="ngo-logo">
                      <img 
                        src={ngoData[causeDetails.organizerId]?.logo || "https://via.placeholder.com/60x60?text=NGO"} 
                        alt={causeDetails.organizer} 
                      />
                    </div>
                    <div className="ngo-details">
                      <div className="ngo-contact">
                        <div className="contact-item">
                          <i className="fas fa-envelope"></i> 
                          <span title={ngoData[causeDetails.organizerId]?.email}>
                            {ngoData[causeDetails.organizerId]?.email || "contact@ngo.org"}
                          </span>
                        </div>
                        <div className="contact-item">
                          <i className="fas fa-globe"></i> 
                          <a 
                            href={ngoData[causeDetails.organizerId]?.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ngo-website-link"
                            title={ngoData[causeDetails.organizerId]?.website}
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="cause-description">{causeDetails.description}</p>
                  
                  <div className="funding-progress">
                    <div className="progress-stats">
                      <div className="raised">
                        <span>Raised:</span> ${causeDetails.raised}
                      </div>
                      <div className="goal">
                        <span>Goal:</span> ${causeDetails.goal}
                      </div>
                    </div>
                    
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${Math.round((causeDetails.raised / causeDetails.goal) * 100)}%` }}
                      >
                        <div className="progress-glow"></div>
                      </div>
                    </div>
                    
                    <div className="progress-percentage">
                      {Math.round((causeDetails.raised / causeDetails.goal) * 100)}% Complete
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <div className="blockchain-note">
                <div className="note-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <p>All donations are verified through our blockchain system for complete transparency.</p>
              </div>
            </div>
          </Col>
          
          <Col lg={8} md={7}>
            <Card className="donation-form-card">
              <Card.Body>
                <h2>Make Your Donation</h2>
                <p className="form-subtitle">Choose your preferred payment method</p>
                
                <Alert variant="info" className="mb-4">
                  <Alert.Heading>Testing Guidelines</Alert.Heading>
                  <p>
                    For testing purposes, we recommend donating small amounts (0.01-0.05 ETH/SOL).
                    Make sure your wallet has sufficient funds for both the donation and gas fees.
                  </p>
                  <hr />
                  <p className="mb-0">
                    Need testnet ETH? <a href="https://sepolia-faucet.pk910.de/" target="_blank" rel="noopener noreferrer">Get Sepolia ETH here</a>
                  </p>
                </Alert>
                
                {transactionError && (
                  <Alert variant="danger" className="mb-4">
                    <Alert.Heading>Transaction Error</Alert.Heading>
                    <p>{transactionError}</p>
                  </Alert>
                )}
                
                {transactionResult && (
                  <Alert variant="success" className="mb-4">
                    <Alert.Heading>Transaction Successful!</Alert.Heading>
                    <p>Your donation has been processed successfully.</p>
                    {transactionResult.txHash && (
                      <div>
                        <p className="mb-1"><strong>Transaction Hash:</strong></p>
                        <code className="d-block mb-2">{transactionResult.txHash}</code>
                        <a 
                          href={transactionResult.explorer}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          View on Blockchain Explorer
                        </a>
                      </div>
                    )}
                  </Alert>
                )}
                
                <Nav variant="tabs" className="payment-tabs">
                  <Nav.Item>
                    <Nav.Link 
                      className={activeTab === 'crypto' ? 'active' : ''} 
                      onClick={() => setActiveTab('crypto')}
                    >
                      <i className="fab fa-bitcoin"></i> Cryptocurrency
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      className={activeTab === 'upi' ? 'active' : ''} 
                      onClick={() => setActiveTab('upi')}
                    >
                      <i className="fas fa-mobile-alt"></i> UPI Payment
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      className={activeTab === 'netbanking' ? 'active' : ''} 
                      onClick={() => setActiveTab('netbanking')}
                    >
                      <i className="fas fa-university"></i> Net Banking
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                
                <div className="payment-content">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label>Amount (USD)</Form.Label>
                      <Form.Control 
                        type="number" 
                        placeholder="Enter donation amount" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0.01"
                        step="0.01"
                      />
                      <Form.Text className="text-muted">
                        For test transactions, we recommend using 0.01-0.1 {activeTab === 'crypto' ? cryptoCurrency : 'USD'}.
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Enter your email for receipt" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    {activeTab === 'crypto' && (
                      <div className="crypto-options">
                        <Form.Group className="mb-4">
                          <Form.Label>Select Cryptocurrency</Form.Label>
                          <Form.Select 
                            value={cryptoCurrency}
                            onChange={(e) => setCryptoCurrency(e.target.value)}
                          >
                            <option value="ETH">Ethereum (ETH) - Sepolia Testnet</option>
                            <option value="BTC">Bitcoin (BTC) - Testnet</option>
                            <option value="USDT">Tether (USDT) - Sepolia Testnet</option>
                            <option value="SOL">Solana (SOL) - Testnet</option>
                          </Form.Select>
                        </Form.Group>
                        
                        {amount && (
                          <div className="qr-section">
                            <h3>Scan to Pay with {cryptoCurrency}</h3>
                            <CryptoQRCode 
                              key={`qr-${cryptoCurrency}`}
                              cryptoCurrency={cryptoCurrency} 
                              amount={amount} 
                            />
                            <div className="wallet-address">
                              <p>Or send manually to:</p>
                              <CryptoAddressDisplay 
                                key={`address-${cryptoCurrency}`}
                                cryptoCurrency={cryptoCurrency} 
                              />
                              {cryptoCurrency === 'BTC' && (
                                <div className="testnet-note mt-2">
                                  <small className="text-warning">
                                    <i className="fas fa-info-circle"></i> Bitcoin testnet requires a special testnet wallet.
                                    Visit <a href="https://coinfaucet.eu/en/btc-testnet/" target="_blank" rel="noopener noreferrer">this faucet</a> to get test BTC.
                                  </small>
                                </div>
                              )}
                              {cryptoCurrency === 'SOL' && (
                                <div className="testnet-note mt-2">
                                  <small className="text-info">
                                    <i className="fas fa-check-circle"></i> Solana testnet is configured and ready. Make sure your Phantom wallet is set to Testnet mode.
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {activeTab === 'upi' && (
                      <div className="upi-options">
                        <Form.Group className="mb-4">
                          <Form.Label>Your UPI ID</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Enter your UPI ID (e.g., name@ybl)" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            required
                          />
                        </Form.Group>
                        
                        {amount && (
                          <div className="qr-section">
                            <h3>Scan to Pay with UPI</h3>
                            <div className="qr-container">
                              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=care4crisis@ybl&pn=Care4Crisis&am=${amount}&cu=INR&tn=DonationFor${causeDetails.title.replace(/\s+/g, '')}`} alt="UPI payment QR code" />
                            </div>
                            <div className="upi-id-display">
                              <p>UPI ID: <strong>care4crisis@ybl</strong></p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {activeTab === 'netbanking' && (
                      <div className="netbanking-options">
                        <Form.Group className="mb-3">
                          <Form.Label>Account Holder Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Enter account holder name" 
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            required
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Account Number</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Enter account number" 
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            required
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-4">
                          <Form.Label>IFSC Code</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Enter bank IFSC code" 
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value)}
                            required
                          />
                        </Form.Group>
                        
                        <div className="bank-details">
                          <h4>Bank Account Details:</h4>
                          <p><strong>Account Name:</strong> Care4Crisis Foundation</p>
                          <p><strong>Account Number:</strong> 1234567890123456</p>
                          <p><strong>IFSC Code:</strong> CARE0001234</p>
                          <p><strong>Bank Name:</strong> Global Crisis Relief Bank</p>
                          <p className="note">Please use your name and email as reference</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="form-actions">
                      <Button type="submit" className="donate-submit-btn" disabled={isProcessing}>
                        {isProcessing ? <Spinner animation="border" size="sm" /> : 'Complete Donation'}
                      </Button>
                      <Link to={`${BASE_PATH}/events`} className="cancel-link">Cancel</Link>
                    </div>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <footer className="donation-footer">
        <Container>
          <div className="footer-content">
            <div className="footer-logo">
              <h3>CARE4CRISIS</h3>
              <p>Transparent Blockchain Donations</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Navigation</h4>
                <ul>
                  <li><Link to={`${BASE_PATH}/`}>Home</Link></li>
                  <li><Link to={`${BASE_PATH}/events`}>Causes</Link></li>
                  <li><a href="#about">About</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              <div className="link-group">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#privacy">Privacy Policy</a></li>
                  <li><a href="#terms">Terms of Service</a></li>
                  <li><a href="#refund">Refund Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Care4Crisis. All rights reserved.</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default DonationPage;