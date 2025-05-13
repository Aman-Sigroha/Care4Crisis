import React, { useState, useEffect } from 'react';
import { Button, Modal, Tabs, Tab, Alert } from 'react-bootstrap';
import { getProvider } from '../../services/ethereumService';
import { connectWallet as connectSolanaWallet, isWalletConnected as checkSolanaWalletConnected, getWalletPublicKey } from '../../services/solanaService';

const WalletConnector = ({ onWalletConnect }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeWallet, setActiveWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
      const provider = await getProvider();
      const address = await provider.getSigner().getAddress();
      
      setActiveWallet('ethereum');
      setWalletAddress(address);
      setShowModal(false);
      
      if (onWalletConnect) {
        onWalletConnect('ethereum', address);
      }
    } catch (err) {
      console.error('Error connecting to Ethereum wallet:', err);
      setError('Failed to connect to Ethereum wallet. Make sure MetaMask is installed and unlocked.');
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

  return (
    <>
      {activeWallet ? (
        <Button 
          variant="outline-light" 
          className="wallet-button"
          onClick={() => setShowModal(true)}
        >
          <i className={`me-2 ${activeWallet === 'ethereum' ? 'fab fa-ethereum' : 'fas fa-wallet'}`}></i>
          {formatAddress(walletAddress)}
        </Button>
      ) : (
        <Button 
          variant="primary" 
          onClick={() => setShowModal(true)}
        >
          Connect Wallet
        </Button>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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
              <div className="text-center p-4">
                <img 
                  src="/crypto-icons/metamask.png" 
                  alt="MetaMask" 
                  style={{ width: '80px', height: '80px', marginBottom: '15px' }}
                />
                <h5>MetaMask</h5>
                <p className="text-muted mb-3">Connect to Ethereum Sepolia Testnet</p>
                
                <Button 
                  variant="primary" 
                  className="w-100" 
                  onClick={connectEthereumWallet}
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : 'Connect MetaMask'}
                </Button>
                
                {activeWallet === 'ethereum' && (
                  <div className="mt-3 text-success">
                    <i className="fas fa-check-circle me-2"></i>
                    Connected: {formatAddress(walletAddress)}
                  </div>
                )}
              </div>
            </Tab>
            <Tab eventKey="solana" title="Solana">
              <div className="text-center p-4">
                <img 
                  src="/crypto-icons/phantom.png" 
                  alt="Phantom" 
                  style={{ width: '80px', height: '80px', marginBottom: '15px' }}
                />
                <h5>Phantom Wallet</h5>
                <p className="text-muted mb-3">Connect to Solana Testnet</p>
                
                <Button 
                  variant="primary" 
                  className="w-100" 
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