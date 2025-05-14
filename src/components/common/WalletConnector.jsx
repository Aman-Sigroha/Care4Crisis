import { useState, useEffect } from 'react';
import { Button, Modal, Tabs, Tab, Alert } from 'react-bootstrap';
import { getProvider, switchToSepoliaNetwork, getMetaMaskProvider } from '../../services/ethereumService';
import { connectWallet as connectSolanaWallet, isWalletConnected as checkSolanaWalletConnected, getWalletPublicKey } from '../../services/solanaService';
import './WalletConnector.css';

const WalletConnector = ({ onWalletConnect }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeWallet, setActiveWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
  const [isPhantomAvailable, setIsPhantomAvailable] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    const metaMaskProvider = getMetaMaskProvider();
    setIsMetaMaskAvailable(metaMaskProvider !== null);
    console.log('MetaMask detection result:', metaMaskProvider !== null);
    if (metaMaskProvider) {
      console.log('MetaMask provider detected:', metaMaskProvider);
    }
    
    // Check if Phantom is installed
    const phantomAvailable = typeof window !== 'undefined' && Boolean(window.solana?.isPhantom);
    setIsPhantomAvailable(phantomAvailable);
    console.log('Phantom detection result:', phantomAvailable);
    
    // Check if wallets are already connected
    const checkWalletConnections = async () => {
      try {
        // Check Ethereum wallet independently
        const provider = getMetaMaskProvider();
        if (provider && provider.selectedAddress) {
          console.log('Found connected Ethereum wallet:', provider.selectedAddress);
          setActiveWallet('ethereum');
          setWalletAddress(provider.selectedAddress);
          
          if (onWalletConnect) {
            onWalletConnect('ethereum', provider.selectedAddress);
          }
          return; // Stop here if Ethereum is connected
        } else {
          console.log('No connected Ethereum wallet found');
        }
        
        // Only check Solana wallet if Ethereum isn't connected
        const solanaConnected = await checkSolanaWalletConnected();
        if (solanaConnected) {
          const address = await getWalletPublicKey();
          console.log('Found connected Solana wallet:', address);
          setActiveWallet('solana');
          setWalletAddress(address);
          
          if (onWalletConnect) {
            onWalletConnect('solana', address);
          }
        } else {
          console.log('No connected Solana wallet found');
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
      
      console.log('Attempting to connect to Ethereum wallet using MetaMask provider');
      
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
      
      console.log('Successfully connected to Ethereum wallet:', address);
      
      // Clear other wallet connections to ensure only one is active
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
      
      // Clear other wallet connections to ensure only one is active
      setActiveWallet('solana');
      setWalletAddress(address);
      setShowModal(false);
      
      if (onWalletConnect) {
        onWalletConnect('solana', address);
      }
    } catch (err) {
      console.error('Error connecting to Solana wallet:', err);
      setError(err.message || 'Failed to connect to Phantom wallet. Make sure it is installed and unlocked.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    console.log('Disconnecting wallet:', activeWallet);
    if (activeWallet === 'solana') {
      // Try to disconnect Phantom if possible
      if (window.solana?.disconnect) {
        try {
          window.solana.disconnect();
        } catch (err) {
          console.error('Error disconnecting Solana:', err);
        }
      }
    }
    
    // Reset state regardless of which wallet was active
    setActiveWallet(null);
    setWalletAddress('');
    setShowModal(false);
    
    if (onWalletConnect) {
      onWalletConnect(null, null);
    }
    
    console.log('Wallet disconnected');
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
        
        {/* Emergency fallback option if automatic detection fails */}
        <div className="mt-4 border-top pt-3">
          <h6 className="text-warning">Having Issues?</h6>
          <p className="small">If automatic detection fails, you can try the manual connection option:</p>
          <Button 
            size="sm"
            variant="outline-warning"
            onClick={() => {
              if (window.ethereum) {
                console.log("Attempting forced MetaMask connection");
                
                // Force disconnect Phantom if present
                if (window.solana && typeof window.solana.disconnect === 'function') {
                  try {
                    window.solana.disconnect();
                  } catch (e) { /* ignore */ }
                }
                
                // Try to connect directly using window.ethereum
                window.ethereum.request({ method: 'eth_requestAccounts' })
                  .then(accounts => {
                    if (accounts && accounts.length > 0) {
                      console.log("Forced connection succeeded:", accounts[0]);
                      setActiveWallet('ethereum');
                      setWalletAddress(accounts[0]);
                      setShowModal(false);
                      
                      if (onWalletConnect) {
                        onWalletConnect('ethereum', accounts[0]);
                      }
                    }
                  })
                  .catch(err => {
                    console.error("Forced connection failed:", err);
                    setError("Manual connection failed: " + err.message);
                  });
              } else {
                setError("No Ethereum provider found in browser");
              }
            }}
          >
            Force MetaMask Connection
          </Button>
        </div>
      </div>
    );
  };
  
  const renderPhantomTab = () => {
    return (
      <div className="text-center p-4">
        <img 
          src="/crypto-icons/phantom.png" 
          alt="Phantom" 
          className="wallet-logo"
        />
        <h5>Phantom Wallet</h5>
        <p>Connect to Solana Testnet</p>
        
        {!isPhantomAvailable && (
          <div className="wallet-instructions mb-3">
            <h6>Phantom Not Detected</h6>
            <p>Please install the Phantom wallet:</p>
            <ol>
              <li>Visit <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" style={{color: '#05c3dd'}}>phantom.app</a></li>
              <li>Install the extension for your browser</li>
              <li>Set up your wallet and refresh this page</li>
            </ol>
          </div>
        )}
        
        <Button 
          className="connect-wallet-btn w-100" 
          onClick={connectSolana}
          disabled={loading || !isPhantomAvailable}
        >
          {loading ? 'Connecting...' : isPhantomAvailable ? 'Connect Phantom' : 'Phantom Not Installed'}
        </Button>
        
        {activeWallet === 'solana' && (
          <div className="mt-3 text-success">
            <i className="fas fa-check-circle me-2"></i>
            Connected: {formatAddress(walletAddress)}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {activeWallet ? (
        <div className="d-flex">
          <Button 
            className="wallet-button"
            onClick={() => setShowModal(true)}
          >
            <i className={`me-2 ${activeWallet === 'ethereum' ? 'fab fa-ethereum' : 'fas fa-wallet'}`}></i>
            {formatAddress(walletAddress)}
          </Button>
          <Button 
            className="ms-2 disconnect-wallet-btn"
            variant="outline-danger"
            size="sm"
            onClick={disconnectWallet}
          >
            <i className="fas fa-sign-out-alt"></i>
          </Button>
        </div>
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
              {renderPhantomTab()}
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