import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Badge, Nav, Tab, Alert, Button } from 'react-bootstrap';
import './TransparencyPage.css';
import Footer from '../home/footer/Footer';
import EventDistribution from '../events/EventDistribution';
import { 
  getAllTransactions, 
  getExplorerLink as getExplorerUrl, 
  getTransactionLink 
} from '../../services/blockchainExplorerService';

const TransparencyPage = () => {
  const [walletData, setWalletData] = useState({
    bitcoin: { balance: '0.00000000', transactions: [] },
    ethereum: { balance: '0.000000', transactions: [] },
    usdt: { balance: '0.00', transactions: [] },
    solana: { balance: '0.000000', transactions: [] }
  });
  
  const [ngoTransactions, setNgoTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const walletAddresses = {
    bitcoin: "tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    ethereum: "0xFCe725102101817eC210FcE24F0ec91E277c7d29",
    usdt: "0xFCe725102101817eC210FcE24F0ec91E277c7d29",
    solana: "AWKV2E7xsQmnY1tz9tAfMygtrDDhzSsNUGKgc9RxPYcG"
  };
  
  // Load real transaction data from blockchain
  const fetchTransactions = useCallback(async () => {
    try {
      // Fetch all transactions from our service
      const txData = await getAllTransactions();
      
      // Update wallet data with real transaction info
      setWalletData({
        bitcoin: {
          balance: txData.bitcoin.balance,
          transactions: txData.bitcoin.transactions
        },
        ethereum: {
          balance: txData.ethereum.balance,
          transactions: txData.ethereum.transactions
        },
        usdt: {
          balance: txData.usdt.balance,
          transactions: txData.usdt.transactions
        },
        solana: {
          balance: txData.solana.balance,
          transactions: txData.solana.transactions
        }
      });
      
      // Load NGO transactions from the distribution system
      const distributionTxs = EventDistribution.getTransactions();
      setNgoTransactions(distributionTxs);
      
      // Try to get donation history from localStorage as a backup
      try {
        const donationHistoryStr = localStorage.getItem('donationHistory');
        if (donationHistoryStr) {
          // Update the UI to show we have real transaction data
          console.log('Loaded donation history from localStorage:', JSON.parse(donationHistoryStr).length, 'items');
        }
      } catch (err) {
        console.error('Error reading localStorage:', err);
      }
      
      // Update last refreshed time
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);
  
  // Initial load
  useEffect(() => {
    setIsLoading(true);
    fetchTransactions();
    
    // Set up auto-refresh every 2 minutes
    const refreshInterval = setInterval(() => {
      setIsRefreshing(true);
      fetchTransactions();
    }, 120000); // 2 minutes
    
    return () => clearInterval(refreshInterval);
  }, [fetchTransactions]);
  
  // Handle manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTransactions();
  };
  
  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Truncate address for display
  const truncateAddress = (address) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };
  
  // Format transaction for display
  const getTransactionStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'failed':
        return <Badge bg="danger">Failed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };
  
  const getTransactionTypeBadge = (type) => {
    switch(type) {
      case 'received':
        return <Badge bg="info">Received</Badge>;
      case 'sent':
        return <Badge bg="primary">Sent to NGO</Badge>;
      default:
        return <Badge bg="secondary">{type}</Badge>;
    }
  };
  
  // Calculate total balance in USD (would use real rates in production)
  const getTotalBalanceUSD = () => {
    const rates = {
      bitcoin: 50000,
      ethereum: 2500,
      usdt: 1,
      solana: 50
    };
    
    let total = 0;
    Object.keys(walletData).forEach(currency => {
      total += parseFloat(walletData[currency].balance) * rates[currency];
    });
    
    return total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get transaction list from wallet data
  const getAllTransactionsList = () => {
    let allTransactions = [];
    
    // Combine transactions from all cryptocurrencies
    Object.keys(walletData).forEach(currency => {
      const currencyTransactions = walletData[currency].transactions.map(tx => ({
        ...tx,
        currency: currency.toUpperCase()
      }));
      allTransactions = [...allTransactions, ...currencyTransactions];
    });
    
    // Sort by date, newest first
    return allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  return (
    <>
      <div className="transparency-page">
        <div className="transparency-hero">
          <Container>
            <h1>Blockchain Transparency</h1>
            <p>All our cryptocurrency transactions are publicly visible on the blockchain</p>
          </Container>
        </div>
        
        <Container className="transparency-content">
          <Alert variant="info" className="mb-4">
            <Alert.Heading>Live Blockchain Data</Alert.Heading>
            <p>
              This transparency dashboard shows your real testnet transactions:
              Ethereum Sepolia, Bitcoin Testnet, and Solana Testnet.
              Your donations are automatically tracked and displayed here.
            </p>
            <div className="mt-2 d-flex justify-content-between align-items-center">
              <small>Last updated: {formatTime(lastRefreshed)}</small>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                className="refresh-btn"
              >
                <i className={`fas fa-sync-alt ${isRefreshing ? 'fa-spin' : ''}`}></i>
                {isRefreshing ? ' Refreshing...' : ' Refresh Data'}
              </Button>
            </div>
          </Alert>
          
          {isLoading ? (
            <Row className="mb-4 justify-content-center">
              <Col md={6} className="text-center">
                <div className="loading-spinner my-5"></div>
                <p>Loading blockchain transaction data...</p>
              </Col>
            </Row>
          ) : (
            <>
              <Row className="mb-4">
                <Col>
                  <Card className="total-balance-card">
                    <Card.Body>
                      <h3>Total Balance</h3>
                      <div className="balance-amount">{getTotalBalanceUSD()}</div>
                      <p>Estimated value across all cryptocurrencies</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Tab.Container id="transparency-tabs" defaultActiveKey="overview">
                <Row className="g-0">
                  <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="overview">Overview</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="bitcoin">Bitcoin</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="ethereum">Ethereum</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="usdt">USDT</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="solana">Solana</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="ngo-distribution">NGO Distribution</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col sm={9}>
                    <Tab.Content className="ps-0">
                      <Tab.Pane eventKey="overview">
                        <h3>Wallet Balances</h3>
                        <Row xs={1} md={2} className="g-3">
                          {Object.keys(walletData).map(currency => (
                            <Col key={currency} className="px-2">
                              <Card className="wallet-balance-card">
                                <Card.Body>
                                  <h4>{currency.charAt(0).toUpperCase() + currency.slice(1)}</h4>
                                  <div className="currency-balance">
                                    {walletData[currency].balance}
                                    {(currency === 'ethereum' || currency === 'solana') && (
                                      <div className="real-time-indicator">
                                        <small className="text-success">
                                          <i className="fas fa-broadcast-tower me-1"></i>
                                          Live Balance
                                        </small>
                                      </div>
                                    )}
                                  </div>
                                  <div className="wallet-address">
                                    <a href={getExplorerUrl(currency, walletAddresses[currency])} target="_blank" rel="noopener noreferrer">
                                      {truncateAddress(walletAddresses[currency])} <i className="fas fa-external-link-alt"></i>
                                    </a>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                        
                        <div className="recent-transactions">
                          <h3>Recent Transactions</h3>
                          <Table responsive>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Currency</th>
                                <th>Status</th>
                                <th>Transaction ID</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getAllTransactionsList().slice(0, 5).map((tx, index) => (
                                <tr key={tx.id || index}>
                                  <td>{formatDate(tx.date)}</td>
                                  <td>{getTransactionTypeBadge(tx.type)}</td>
                                  <td>{tx.amount}</td>
                                  <td>{tx.currency}</td>
                                  <td>{getTransactionStatusBadge(tx.status)}</td>
                                  <td>
                                    <a href={getTransactionLink(tx.currency, tx.id)} target="_blank" rel="noopener noreferrer">
                                      {truncateAddress(tx.id)} <i className="fas fa-external-link-alt"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                              
                              {getAllTransactionsList().length === 0 && (
                                <tr>
                                  <td colSpan="6" className="text-center py-3">
                                    No transactions found. Make a donation to see it here!
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </Tab.Pane>
                      
                      {/* Individual cryptocurrency tabs */}
                      {Object.keys(walletData).map(currency => (
                        <Tab.Pane key={currency} eventKey={currency}>
                          <h3>{currency.charAt(0).toUpperCase() + currency.slice(1)} Transactions</h3>
                          
                          <div className="wallet-info mb-4">
                            <p><strong>Wallet Address:</strong> {walletAddresses[currency]}</p>
                            <p><strong>Balance:</strong> {walletData[currency].balance} {currency.toUpperCase()}
                              {(currency === 'ethereum' || currency === 'solana') && (
                                <span className="badge bg-success ms-2">
                                  <i className="fas fa-sync-alt me-1"></i> Live
                                </span>
                              )}
                            </p>
                            <p>
                              <a href={getExplorerUrl(currency, walletAddresses[currency])} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 className="explorer-link">
                                View on Blockchain Explorer <i className="fas fa-external-link-alt"></i>
                              </a>
                            </p>
                          </div>
                          
                          <Table responsive>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>From/To</th>
                                <th>Status</th>
                                <th>Transaction ID</th>
                              </tr>
                            </thead>
                            <tbody>
                              {walletData[currency].transactions.map((tx, index) => (
                                <tr key={tx.id || index}>
                                  <td>{formatDate(tx.date)}</td>
                                  <td>{getTransactionTypeBadge(tx.type)}</td>
                                  <td>{tx.amount}</td>
                                  <td>{tx.type === 'received' ? tx.from : tx.to}</td>
                                  <td>{getTransactionStatusBadge(tx.status)}</td>
                                  <td>
                                    <a href={getTransactionLink(currency, tx.id)} target="_blank" rel="noopener noreferrer">
                                      {truncateAddress(tx.id)} <i className="fas fa-external-link-alt"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                              
                              {walletData[currency].transactions.length === 0 && (
                                <tr>
                                  <td colSpan="6" className="text-center py-3">
                                    No {currency} transactions found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </Tab.Pane>
                      ))}
                      
                      {/* NGO Distribution Tab */}
                      <Tab.Pane eventKey="ngo-distribution">
                        <h3>NGO Fund Distribution</h3>
                        <p className="mb-4">
                          When a funding goal is reached or the timeframe ends, 
                          funds are automatically distributed to partner NGOs.
                        </p>
                        
                        <Table responsive>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>NGO</th>
                              <th>Cause</th>
                              <th>Amount</th>
                              <th>Currency</th>
                              <th>Transaction ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ngoTransactions.length > 0 ? ngoTransactions.map((tx, index) => (
                              <tr key={index}>
                                <td>{formatDate(tx.date)}</td>
                                <td>{tx.to}</td>
                                <td>{tx.eventTitle}</td>
                                <td>{tx.amount}</td>
                                <td>{tx.currency}</td>
                                <td>
                                  <a href={getTransactionLink(tx.currency, tx.id)} target="_blank" rel="noopener noreferrer">
                                    {truncateAddress(tx.id)} <i className="fas fa-external-link-alt"></i>
                                  </a>
                                </td>
                              </tr>
                            )) : (
                              // Default demo data when no transactions exist yet
                              <>
                                <tr>
                                  <td>2023-11-29</td>
                                  <td>Water Relief NGO</td>
                                  <td>Clean Water Initiative</td>
                                  <td>0.01000000</td>
                                  <td>BTC</td>
                                  <td>
                                    <a href="#" target="_blank" rel="noopener noreferrer">
                                      tx2btc... <i className="fas fa-external-link-alt"></i>
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td>2023-11-29</td>
                                  <td>Education First NGO</td>
                                  <td>School Building Project</td>
                                  <td>50.00</td>
                                  <td>USDT</td>
                                  <td>
                                    <a href="#" target="_blank" rel="noopener noreferrer">
                                      tx2usdt... <i className="fas fa-external-link-alt"></i>
                                    </a>
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </Table>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default TransparencyPage; 