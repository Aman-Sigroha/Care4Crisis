import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './BlockchainConfirmation.css';

// Import BASE_PATH constant from App.jsx or define it here
const BASE_PATH = '/Care4Crisis';

const BlockchainConfirmation = ({ donation }) => {
  // In a real app, this would receive actual transaction data
  // For now, we'll use mock data
  const transactionData = donation || {
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
  
  // Generate blockchain explorer link based on currency
  const getExplorerLink = (currency, txId) => {
    // If transaction has a specific explorer URL, use that
    if (transactionData.explorerUrl) {
      return transactionData.explorerUrl;
    }
    
    // Otherwise generate based on currency and testnet
    const isTestnet = true; // Assuming testnet for demo purposes
    
    switch(currency.toLowerCase()) {
      case 'btc':
      case 'bitcoin':
        return isTestnet 
          ? `https://live.blockcypher.com/btc-testnet/tx/${txId}/`
          : `https://www.blockchain.com/explorer/transactions/btc/${txId}`;
      case 'eth':
      case 'ethereum':
        return isTestnet
          ? `https://sepolia.etherscan.io/tx/${txId}`
          : `https://etherscan.io/tx/${txId}`;
      case 'usdt':
        return isTestnet
          ? `https://sepolia.etherscan.io/tx/${txId}`
          : `https://etherscan.io/tx/${txId}`;
      case 'sol':
      case 'solana':
        return isTestnet
          ? `https://explorer.solana.com/tx/${txId}?cluster=testnet`
          : `https://explorer.solana.com/tx/${txId}`;
      default:
        return '#';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Container className="blockchain-confirmation">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="confirmation-card">
            <Card.Header className="text-center">
              <div className="blockchain-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Donation Confirmed on Blockchain</h2>
              <p>Your donation has been securely recorded on the blockchain</p>
            </Card.Header>
            
            <Card.Body>
              <Alert variant="success" className="status-alert">
                <i className="fas fa-shield-alt"></i> Transaction Status: <strong>{transactionData.status.toUpperCase()}</strong>
              </Alert>
              
              <div className="transaction-details">
                <h3>Transaction Details</h3>
                <Row>
                  <Col md={6} className="detail-item">
                    <span className="detail-label">Transaction ID:</span>
                    <span className="detail-value">{transactionData.id}</span>
                  </Col>
                  <Col md={6} className="detail-item">
                    <span className="detail-label">Date & Time:</span>
                    <span className="detail-value">{formatDate(transactionData.timestamp)}</span>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="detail-item">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value">{transactionData.amount} {transactionData.currency}</span>
                  </Col>
                  <Col md={6} className="detail-item">
                    <span className="detail-label">Cause:</span>
                    <span className="detail-value">{transactionData.cause}</span>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="detail-item">
                    <span className="detail-label">From Wallet:</span>
                    <span className="detail-value truncate-address">{transactionData.walletAddress}</span>
                  </Col>
                  <Col md={6} className="detail-item">
                    <span className="detail-label">To NGO:</span>
                    <span className="detail-value truncate-address">{transactionData.ngoWallet}</span>
                  </Col>
                </Row>
                {transactionData.blockNumber && (
                  <Row>
                    <Col md={6} className="detail-item">
                      <span className="detail-label">Block Number:</span>
                      <span className="detail-value">{transactionData.blockNumber}</span>
                    </Col>
                    {transactionData.txHash && transactionData.txHash !== transactionData.id && (
                      <Col md={6} className="detail-item">
                        <span className="detail-label">TX Hash:</span>
                        <span className="detail-value truncate-address">{transactionData.txHash}</span>
                      </Col>
                    )}
                  </Row>
                )}
              </div>
              
              <div className="verification-links">
                <h4>Verify on Blockchain</h4>
                <p>You can verify this transaction on the blockchain by clicking the link below:</p>
                <a 
                  href={getExplorerLink(transactionData.currency, transactionData.id)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="verify-btn"
                >
                  <i className="fas fa-external-link-alt"></i> View on Blockchain Explorer
                </a>
              </div>
              
              <div className="distribution-info">
                <h4>Automatic Distribution</h4>
                <p>
                  Once the donation goal for this cause is reached or the event timeframe ends, 
                  all collected funds will be automatically transferred to {transactionData.ngo}&apos;s 
                  wallet through our secure distribution system.
                </p>
                <p>
                  You can track this process on our <Link to={`${BASE_PATH}/transparency`}>transparency page</Link>.
                </p>
              </div>
            </Card.Body>
            
            <Card.Footer className="text-center">
              <Link to={`${BASE_PATH}/transparency`}>
                <Button variant="primary" className="mx-2">
                  <i className="fas fa-chart-bar"></i> View All Transactions
                </Button>
              </Link>
              <Link to={`${BASE_PATH}/events`}>
                <Button variant="outline-primary" className="mx-2">
                  <i className="fas fa-hand-holding-heart"></i> Explore More Causes
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BlockchainConfirmation; 