import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Form, Button } from 'react-bootstrap';
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

  // Simulated data - in a real app this would come from an API
  useEffect(() => {
    // Fetch cause details based on causeId
    const sampleCauses = [
      {
        id: "1",
        title: "Clean Water Initiative",
        image: "/events/event1.jpg",
        category: "ENVIRONMENT",
        description: "Providing clean drinking water to remote villages in drought-affected regions.",
        goal: 15000,
        raised: 9750,
        organizer: "WaterAid Foundation"
      },
      {
        id: "2",
        title: "Education for Girls",
        image: "/events/event2.jpg",
        category: "EDUCATION",
        description: "Supporting education for girls in underserved communities.",
        goal: 25000,
        raised: 18200,
        organizer: "Education First NGO"
      }
    ];
    
    // Find the cause by id or use a default if not found
    const foundCause = sampleCauses.find(cause => cause.id === causeId) || sampleCauses[0];
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
    // Different wallet addresses for different cryptocurrencies
    const wallets = {
      ETH: '0xFCe725102101817eC210FcE24F0ec91E277c7d29',
      BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      USDT: '0xFCe725102101817eC210FcE24F0ec91E277c7d29', // USDT on Ethereum network
      SOL: '5YMnSXGsBDYWFDMBztEFT5bGQh6pArEU8rYB8xmT1t9L'
    };
    
    return wallets[cryptoCurrency] || wallets['ETH'];
  };

  // Generate QR code URL based on selected cryptocurrency
  const getQrCodeUrl = () => {
    const walletAddress = getWalletAddress(cryptoCurrency);
    
    // Different QR code formats based on cryptocurrency
    if (cryptoCurrency === 'BTC') {
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:${walletAddress}?amount=${amount}`;
    } else if (cryptoCurrency === 'SOL') {
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=solana:${walletAddress}?amount=${amount}`;
    } else {
      // ETH and USDT (on Ethereum)
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ethereum:${walletAddress}?value=${amount}`;
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
                            <option value="ETH">Ethereum (ETH)</option>
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="USDT">Tether (USDT)</option>
                            <option value="SOL">Solana (SOL)</option>
                          </Form.Select>
                        </Form.Group>
                        
                        {amount && (
                          <div className="qr-section">
                            <h3>Scan to Pay</h3>
                            <div className="qr-container">
                              <img src={getQrCodeUrl()} alt={`${cryptoCurrency} payment QR code`} />
                            </div>
                            <div className="wallet-address">
                              <p>Or send manually to:</p>
                              <div className="address-box">
                                <code>{getWalletAddress(cryptoCurrency)}</code>
                                <button className="copy-btn" onClick={() => {
                                  navigator.clipboard.writeText(getWalletAddress(cryptoCurrency));
                                  alert(`${cryptoCurrency} address copied to clipboard!`);
                                }}>
                                  <i className="fas fa-copy"></i>
                                </button>
                              </div>
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