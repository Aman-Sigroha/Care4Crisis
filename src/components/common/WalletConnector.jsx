import { useState, useEffect } from 'react';
import { Button, Modal, Tabs, Tab, Alert } from 'react-bootstrap';
import { getProvider, isMetaMaskInstalled, switchToSepoliaNetwork } from '../../services/ethereumService';
import { connectWallet as connectSolanaWallet, isWalletConnected as checkSolanaWalletConnected, getWalletPublicKey } from '../../services/solanaService';
import './WalletConnector.css';

const WalletConnector = ({ onWalletConnect }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeWallet, setActiveWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    setIsMetaMaskAvailable(isMetaMaskInstalled());
    
    // Check if wallets are already connected
    const checkWalletConnections = async () => {
      try {
        // Check Ethereum wallet
        if (window.ethereum && window.ethereum.selectedAddress) {
          setActiveWallet('ethereum');
          setWalletAddress(window.ethereum.selectedAddress);
          
          if (onWalletConnect) {
            onWalletConnect('ethereum', window.ethereum.selectedAddress);
          }
        }
        
        // Check Solana wallet
        const solanaConnected = await checkSolanaWalletConnected();
        if (solanaConnected) {
          const address = await getWalletPublicKey();
          setActiveWallet('solana');
          setWalletAddress(address);
          
          if (onWalletConnect) {
            onWalletConnect('solana', address);
          }
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    };
    
    checkWalletConnections();
  }, [onWalletConnect]);

  const connectEthereumWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if MetaMask is installed
      if (!isMetaMaskAvailable) {
        throw new Error("MetaMask is not installed. Please install MetaMask browser extension.");
      }
      
      // Try to switch to Sepolia network first
      try {
        await switchToSepoliaNetwork();
      } catch (switchError) {
        console.error("Error switching to Sepolia:", switchError);
        // Continue with connection attempt anyway
      }
      
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setActiveWallet('ethereum');
      setWalletAddress(address);
      setShowModal(false);
      
      if (onWalletConnect) {
        onWalletConnect('ethereum', address);
      }
    } catch (err) {
      console.error('Error connecting to Ethereum wallet:', err);
      
      // Provide more user-friendly error messages
      if (err.message.includes("user rejected")) {
        setError("Connection request rejected. Please approve the MetaMask connection request.");
      } else if (err.message.includes("already pending")) {
        setError("MetaMask request already pending. Please open MetaMask and check for pending requests.");
      } else if (err.message.includes("not installed")) {
        setError("MetaMask is not installed. Please install the MetaMask browser extension.");
      } else {
        setError("Failed to connect to Ethereum wallet. " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const connectSolana = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const address = await connectSolanaWallet();
      
      setActiveWallet('solana');
      setWalletAddress(address);
      setShowModal(false);
      
      if (onWalletConnect) {
        onWalletConnect('solana', address);
      }
    } catch (err) {
      console.error('Error connecting to Solana wallet:', err);
      setError('Failed to connect to Phantom wallet. Make sure it is installed and unlocked.');
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const renderMetaMaskTab = () => {
    return (
      <div className="text-center p-4">
        <img 
          src="/crypto-icons/metamask.png" 
          alt="MetaMask" 
          className="wallet-logo"
        />
        <h5>MetaMask</h5>
        <p>Connect to Ethereum Sepolia Testnet</p>
        
        {!isMetaMaskAvailable && (
          <div className="wallet-instructions mb-3">
            <h6>MetaMask Not Detected</h6>
            <p>Please install the MetaMask extension:</p>
            <ol>
              <li>Visit <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" style={{color: '#05c3dd'}}>metamask.io</a></li>
              <li>Install the extension for your browser</li>
              <li>Set up your wallet and refresh this page</li>
            </ol>
          </div>
        )}
        
        <Button 
          className="connect-wallet-btn w-100" 
          onClick={connectEthereumWallet}
          disabled={loading || !isMetaMaskAvailable}
        >
          {loading ? 'Connecting...' : isMetaMaskAvailable ? 'Connect MetaMask' : 'MetaMask Not Installed'}
        </Button>
        
        {activeWallet === 'ethereum' && (
          <div className="mt-3 text-success">
            <i className="fas fa-check-circle me-2"></i>
            Connected: {formatAddress(walletAddress)}
          </div>
        )}
        
        <div className="wallet-instructions mt-3">
          <h6>Connection Tips</h6>
          <ul>
            <li>Make sure MetaMask is unlocked</li>
            <li>Click "Connect MetaMask" and approve the connection request</li>
            <li>You will be prompted to switch to Sepolia Testnet</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      {activeWallet ? (
        <Button 
          className="wallet-button"
          onClick={() => setShowModal(true)}
        >
          <i className={`me-2 ${activeWallet === 'ethereum' ? 'fab fa-ethereum' : 'fas fa-wallet'}`}></i>
          {formatAddress(walletAddress)}
        </Button>
      ) : (
        <Button 
          className="connect-wallet-btn"
          onClick={() => setShowModal(true)}
        >
          Connect Wallet
        </Button>
      )}

      <Modal className="wallet-modal" show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Connect Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          
          <Tabs defaultActiveKey="ethereum" className="mb-4">
            <Tab eventKey="ethereum" title="Ethereum">
              {renderMetaMaskTab()}
            </Tab>
            <Tab eventKey="solana" title="Solana">
              <div className="text-center p-4">
                <img 
                  src="/crypto-icons/phantom.png" 
                  alt="Phantom" 
                  className="wallet-logo"
                />
                <h5>Phantom Wallet</h5>
                <p>Connect to Solana Testnet</p>
                
                <Button 
                  className="connect-wallet-btn w-100" 
                  onClick={connectSolana}
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : 'Connect Phantom'}
                </Button>
                
                {activeWallet === 'solana' && (
                  <div className="mt-3 text-success">
                    <i className="fas fa-check-circle me-2"></i>
                    Connected: {formatAddress(walletAddress)}
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
          
          <div className="blockchain-note mt-3">
            <i className="fas fa-info-circle note-icon"></i>
            <p className="mb-0">
              Care4Crisis uses testnet blockchains for donations.
              All transactions are recorded on the blockchain for transparency.
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WalletConnector; 