import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DonationNav from './DonationNav';
import './DonationPage.css';

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
        image: "/events/event1.jpg",
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
        image: "/events/event2.jpg",
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
      image: "/events/event3.jpg",
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
      image: "/events/event4.jpg",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process donation based on active tab
    const donationData = {
      causeId,
      amount: parseFloat(amount),
      paymentMethod: activeTab,
      email
    };

    // Add payment method specific details
    if (activeTab === 'crypto') {
      donationData.cryptoCurrency = cryptoCurrency;
    } else if (activeTab === 'upi') {
      donationData.upiId = upiId;
    } else if (activeTab === 'netbanking') {
      donationData.accountDetails = {
        name: accountName,
        accountNumber,
        ifscCode
      };
    }

    console.log('Processing donation:', donationData);
    
    // Simulate successful donation
    alert(`Thank you for your donation of $${amount} via ${activeTab.toUpperCase()}!`);
    navigate(`${BASE_PATH}/donation-success`);
  };

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

  // Generate wallet address and QR code as separate components with their own state
  const CryptoQRCode = ({ cryptoCurrency, amount }) => {
    const [qrUrl, setQrUrl] = useState('');
    
    useEffect(() => {
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
        {qrUrl && <img src={qrUrl} alt={`${cryptoCurrency} payment QR code`} />}
      </div>
    );
  };
  
  const CryptoAddressDisplay = ({ cryptoCurrency }) => {
    const [address, setAddress] = useState('');
    
    useEffect(() => {
      const walletAddress = getWalletAddress(cryptoCurrency);
      setAddress(walletAddress);
      console.log(`Setting address for ${cryptoCurrency}:`, walletAddress);
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
                        src={causeDetails.organizerId === "wateraid-foundation" 
                          ? "https://via.placeholder.com/60x60?text=W" 
                          : "https://via.placeholder.com/60x60?text=E"
                        } 
                        alt={causeDetails.organizer} 
                      />
                    </div>
                    <div className="ngo-details">
                      <div className="ngo-contact">
                        <div className="contact-item">
                          <i className="fas fa-envelope"></i> 
                          <span title={causeDetails.organizerId === "wateraid-foundation" 
                            ? "contact@wateraidfoundation.org" 
                            : "info@educationfirst.org"
                          }>
                            {causeDetails.organizerId === "wateraid-foundation" 
                              ? "contact@wateraid.org" 
                              : "info@edufirst.org"
                            }
                          </span>
                        </div>
                        <div className="contact-item">
                          <i className="fas fa-globe"></i> 
                          <a 
                            href={causeDetails.organizerId === "wateraid-foundation" 
                              ? "https://www.wateraidfoundation.org" 
                              : "https://www.educationfirst.org"
                            } 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ngo-website-link"
                            title={causeDetails.organizerId === "wateraid-foundation" 
                              ? "www.wateraidfoundation.org" 
                              : "www.educationfirst.org"
                            }
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
                        min="1"
                      />
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
                      <Button type="submit" className="donate-submit-btn">
                        Complete Donation
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