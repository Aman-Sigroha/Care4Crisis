import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Nav, Tab } from 'react-bootstrap';
import './TransparencyPage.css';
import Navigation from '../navigation/nav';
import Footer from '../home/footer/Footer';
import EventDistribution from '../events/EventDistribution';

const TransparencyPage = () => {
  const [walletData, setWalletData] = useState({
    bitcoin: { balance: '0.00000000', transactions: [] },
    ethereum: { balance: '0.000000', transactions: [] },
    usdt: { balance: '0.00', transactions: [] },
    solana: { balance: '0.000000', transactions: [] }
  });
  
  const [ngoTransactions, setNgoTransactions] = useState([]);
  
  const walletAddresses = {
    bitcoin: "bc1qk6lc37f7x4awhj2nnxkjll35wwz5g5nvlfl93y",
    ethereum: "0xFCe725102101817eC210FcE24F0ec91E277c7d29",
    usdt: "0xFCe725102101817eC210FcE24F0ec91E277c7d29",
    solana: "AWKV2E7xsQmnY1tz9tAfMygtrDDhzSsNUGKgc9RxPYcG"
  };
  
  // For demo purposes - would be replaced with actual API calls
  useEffect(() => {
    // Simulated data for display purposes
    // In production, you would fetch this from blockchain APIs
    const demoData = {
      bitcoin: {
        balance: '0.02350000',
        transactions: [
          { id: 'tx1btc', date: '2023-11-28', type: 'received', amount: '0.01250000', from: 'Donor', to: 'Care4Crisis', status: 'confirmed' },
          { id: 'tx2btc', date: '2023-11-29', type: 'sent', amount: '0.01000000', from: 'Care4Crisis', to: 'Water Relief NGO', status: 'confirmed' }
        ]
      },
      ethereum: {
        balance: '0.152000',
        transactions: [
          { id: 'tx1eth', date: '2023-11-27', type: 'received', amount: '0.050000', from: 'Donor', to: 'Care4Crisis', status: 'confirmed' },
          { id: 'tx2eth', date: '2023-11-28', type: 'received', amount: '0.120000', from: 'Corporate Donor', to: 'Care4Crisis', status: 'confirmed' }
        ]
      },
      usdt: {
        balance: '250.00',
        transactions: [
          { id: 'tx1usdt', date: '2023-11-26', type: 'received', amount: '100.00', from: 'Donor', to: 'Care4Crisis', status: 'confirmed' },
          { id: 'tx2usdt', date: '2023-11-29', type: 'sent', amount: '50.00', from: 'Care4Crisis', to: 'Education First NGO', status: 'confirmed' }
        ]
      },
      solana: {
        balance: '5.250000',
        transactions: [
          { id: 'tx1sol', date: '2023-11-25', type: 'received', amount: '3.500000', from: 'Donor', to: 'Care4Crisis', status: 'confirmed' },
          { id: 'tx2sol', date: '2023-11-28', type: 'received', amount: '1.750000', from: 'Anonymous', to: 'Care4Crisis', status: 'confirmed' }
        ]
      }
    };
    
    setWalletData(demoData);
    
    // Load NGO transactions from the distribution system
    const transactions = EventDistribution.getTransactions();
    setNgoTransactions(transactions);
  }, []);
  
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
  
  return (
    <>
      <Navigation />
      <div className="transparency-page">
        <div className="transparency-hero">
          <Container>
            <h1>Blockchain Transparency</h1>
            <p>All our cryptocurrency transactions are publicly visible on the blockchain</p>
          </Container>
        </div>
        
        <Container className="transparency-content">
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
                              <div className="currency-balance">{walletData[currency].balance}</div>
                              <div className="wallet-address">
                                <a href={getExplorerLink(currency, walletAddresses[currency])} target="_blank" rel="noopener noreferrer">
                                  {truncateAddress(walletAddresses[currency])} <i className="fas fa-external-link-alt"></i>
                                </a>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    
                    <h3>Recent Transactions</h3>
                    <div className="recent-transactions px-0">
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Currency</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(walletData).flatMap(currency => 
                            walletData[currency].transactions.map(tx => (
                              <tr key={tx.id}>
                                <td>{tx.date}</td>
                                <td>{currency.toUpperCase()}</td>
                                <td>{getTransactionTypeBadge(tx.type)}</td>
                                <td>{tx.amount}</td>
                                <td>{getTransactionStatusBadge(tx.status)}</td>
                                <td>
                                  <a href={getTransactionLink(currency, tx.id)} target="_blank" rel="noopener noreferrer">
                                    View <i className="fas fa-external-link-alt"></i>
                                  </a>
                                </td>
                              </tr>
                            ))
                          ).sort((a, b) => new Date(b.props.children[0].props.children) - new Date(a.props.children[0].props.children)).slice(0, 5)}
                        </tbody>
                      </Table>
                    </div>
                  </Tab.Pane>
                  
                  {['bitcoin', 'ethereum', 'usdt', 'solana'].map(currency => (
                    <Tab.Pane eventKey={currency} key={currency}>
                      <h3>{currency.charAt(0).toUpperCase() + currency.slice(1)} Transactions</h3>
                      <div className="wallet-info mb-4">
                        <p><strong>Address:</strong> <a href={getExplorerLink(currency, walletAddresses[currency])} target="_blank" rel="noopener noreferrer">
                          {walletAddresses[currency]}
                        </a></p>
                        <p><strong>Balance:</strong> {walletData[currency].balance} {currency.toUpperCase()}</p>
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
                          {walletData[currency].transactions.map(tx => (
                            <tr key={tx.id}>
                              <td>{tx.date}</td>
                              <td>{getTransactionTypeBadge(tx.type)}</td>
                              <td>{tx.amount}</td>
                              <td>{tx.type === 'received' ? tx.from : tx.to}</td>
                              <td>{getTransactionStatusBadge(tx.status)}</td>
                              <td>
                                <a href={getTransactionLink(currency, tx.id)} target="_blank" rel="noopener noreferrer">
                                  {tx.id.substring(0, 8)}... <i className="fas fa-external-link-alt"></i>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab.Pane>
                  ))}
                  
                  <Tab.Pane eventKey="ngo-distribution">
                    <h3>NGO Distribution History</h3>
                    <p>Funds are automatically transferred to NGOs when donation goals are met or events are completed.</p>
                    
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>NGO</th>
                          <th>Event</th>
                          <th>Amount</th>
                          <th>Currency</th>
                          <th>Transaction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ngoTransactions.length > 0 ? (
                          ngoTransactions.map(tx => (
                            <tr key={tx.id}>
                              <td>{formatDate(tx.date)}</td>
                              <td>{tx.to}</td>
                              <td>{tx.eventTitle}</td>
                              <td>{tx.amount}</td>
                              <td>{tx.currency}</td>
                              <td>
                                <a href={getTransactionLink(tx.currency.toLowerCase(), tx.id)} target="_blank" rel="noopener noreferrer">
                                  {tx.id.substring(0, 8)}... <i className="fas fa-external-link-alt"></i>
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
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
        </Container>
      </div>
      <Footer />
    </>
  );
};

// Helper functions to generate blockchain explorer links
function getExplorerLink(currency, address) {
  switch(currency) {
    case 'bitcoin':
      return `https://www.blockchain.com/explorer/addresses/btc/${address}`;
    case 'ethereum':
    case 'usdt':
      return `https://etherscan.io/address/${address}`;
    case 'solana':
      return `https://explorer.solana.com/address/${address}`;
    default:
      return '#';
  }
}

function getTransactionLink(currency, txId) {
  switch(currency) {
    case 'bitcoin':
      return `https://www.blockchain.com/explorer/transactions/btc/${txId}`;
    case 'ethereum':
    case 'usdt':
      return `https://etherscan.io/tx/${txId}`;
    case 'solana':
      return `https://explorer.solana.com/tx/${txId}`;
    default:
      return '#';
  }
}

export default TransparencyPage; 