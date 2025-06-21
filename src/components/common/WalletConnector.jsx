import { useState, useEffect } from 'react';
import { Button, Modal, Tabs, Tab, Alert } from 'react-bootstrap';
import { getProvider, switchToSepoliaNetwork, getMetaMaskProvider } from '../../services/ethereumService';
import { connectWallet as connectSolanaWallet, isWalletConnected as checkSolanaWalletConnected, getWalletPublicKey } from '../../services/solanaService';
import './WalletConnector.css';

const WalletConnector = ({ isWalletConnected, walletAddress, walletType, onWalletConnect }) => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
  const [isPhantomAvailable, setIsPhantomAvailable] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    const metaMaskProvider = getMetaMaskProvider();
    setIsMetaMaskAvailable(metaMaskProvider !== null);
    
    // Check if Phantom is installed
    const phantomAvailable = typeof window !== 'undefined' && Boolean(window.solana?.isPhantom);
    setIsPhantomAvailable(phantomAvailable);
  }, []);

  const connectEthereumWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isMetaMaskAvailable) {
        throw new Error("MetaMask is not installed. Please install MetaMask browser extension.");
      }
      
        await switchToSepoliaNetwork();
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      onWalletConnect('ethereum', address); // Report up to App.jsx
      setShowModal(false);
      
    } catch (err) {
      console.error('Error connecting to Ethereum wallet:', err);
      if (err.message.includes("user rejected")) {
        setError("Connection request rejected. Please approve the MetaMask connection request.");
      } else {
        setError("Failed to connect to Ethereum wallet: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const connectSolana = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isPhantomAvailable) {
        throw new Error("Phantom wallet is not installed. Please install the Phantom extension.");
      }
      
      const address = await connectSolanaWallet();
      onWalletConnect('solana', address); // Report up to App.jsx
      setShowModal(false);
      
    } catch (err) {
      console.error('Error connecting to Solana wallet:', err);
      setError(err.message || 'Failed to connect to Phantom wallet.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    if (walletType === 'solana' && window.solana?.disconnect) {
          window.solana.disconnect();
    }
    onWalletConnect(null, null); // Report disconnection up to App.jsx
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // --- Render Logic ---

  if (isWalletConnected) {
    return (
      <div className="wallet-connector-container">
        <Button className="cyber-button connected-wallet-btn" onClick={disconnectWallet}>
          <span className="wallet-icon-container">
            {walletType === 'ethereum' && <img src="/crypto-icons/metamask.png" alt="MetaMask" className="wallet-icon" />}
            {walletType === 'solana' && <img src="/crypto-icons/phantom.png" alt="Phantom" className="wallet-icon" />}
          </span>
          {formatAddress(walletAddress)}
          <span className="disconnect-icon-container">
            <i className="fas fa-sign-out-alt"></i>
          </span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button className="cyber-button" onClick={() => setShowModal(true)}>
          Connect Wallet
        </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Connect Your Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Tabs defaultActiveKey="ethereum" id="wallet-tabs" className="mb-3" justify>
            <Tab eventKey="ethereum" title="Ethereum (MetaMask)">
              {/* MetaMask Tab Content */}
              <div className="text-center p-4">
                <img src="/crypto-icons/metamask.png" alt="MetaMask" className="wallet-logo"/>
                <h5>MetaMask</h5>
                <p>Connect to Ethereum Sepolia Testnet</p>
                {!isMetaMaskAvailable && (
                  <Alert variant="warning">
                    MetaMask is not installed. Please install the browser extension.
            </Alert>
          )}
                <Button className="connect-wallet-btn w-100" onClick={connectEthereumWallet} disabled={loading || !isMetaMaskAvailable}>
                  {loading ? 'Connecting...' : 'Connect MetaMask'}
                </Button>
              </div>
            </Tab>
            <Tab eventKey="solana" title="Solana (Phantom)">
              {/* Phantom Tab Content */}
              <div className="text-center p-4">
                <img src="/crypto-icons/phantom.png" alt="Phantom" className="wallet-logo"/>
                <h5>Phantom</h5>
                <p>Connect your Solana wallet</p>
                {!isPhantomAvailable && (
                   <Alert variant="warning">
                    Phantom is not installed. Please install the browser extension.
                  </Alert>
                )}
                <Button className="connect-wallet-btn w-100" onClick={connectSolana} disabled={loading || !isPhantomAvailable}>
                  {loading ? 'Connecting...' : 'Connect Phantom'}
                </Button>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WalletConnector; 