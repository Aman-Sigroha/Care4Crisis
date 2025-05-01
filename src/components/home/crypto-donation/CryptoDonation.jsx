import './CryptoDonation.css';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CryptoDonation = () => {
  // Crypto donation addresses (these would be your actual wallet addresses)
  const cryptoAddresses = {
    bitcoin: "bc1qk6lc37f7x4awhj2nnxkjll35wwz5g5nvlfl93y",
    ethereum: "0xFCe725102101817eC210FcE24F0ec91E277c7d29",
    usdt: "0xFCe725102101817eC210FcE24F0ec91E277c7d29",
    solana: "AWKV2E7xsQmnY1tz9tAfMygtrDDhzSsNUGKgc9RxPYcG"
  };

  return (
    <div className="crypto-donation-container">
      <div className="crypto-donation-header">
        <div className="crypto-title-decoration left"></div>
        <h2>DONATE WITH <span className="crypto-highlight">CRYPTOCURRENCY</span></h2>
        <div className="crypto-title-decoration right"></div>
      </div>
      
      <div className="crypto-grid">
        <div className="crypto-option">
          <div className="crypto-icon bitcoin-icon">
            <svg viewBox="0 0 64 64" width="100%" height="100%">
              <g transform="translate(0.00630876,-0.00301984)">
                <path fill="#f7931a" d="m63.033,39.744c-4.274,17.143-21.637,27.576-38.782,23.301-17.138-4.274-27.571-21.638-23.295-38.78 4.272-17.145 21.635-27.579 38.775-23.305 17.144,4.274 27.576,21.64 23.302,38.784z"/>
                <path fill="#ffffff" d="m46.103,27.444c0.637-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.511-0.875-1.4,5.616c-0.923-0.23-1.871-0.447-2.813-0.662l1.41-5.653-3.509-0.875-1.439,5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018-4.842-1.209-0.934,3.75s2.605,0.597 2.55,0.634c1.422,0.355 1.679,1.296 1.636,2.042l-1.638,6.571c0.098,0.025 0.225,0.061 0.365,0.117-0.117-0.029-0.242-0.061-0.371-0.092l-2.296,9.205c-0.174,0.432-0.615,1.08-1.609,0.834 0.035,0.051-2.552-0.637-2.552-0.637l-1.743,4.019 4.569,1.139c0.85,0.213 1.683,0.436 2.503,0.646l-1.453,5.834 3.507,0.875 1.439-5.772c0.958,0.26 1.888,0.5 2.798,0.726l-1.434,5.745 3.511,0.875 1.453-5.823c5.987,1.133 10.489,0.676 12.384-4.739 1.527-4.36-0.076-6.875-3.226-8.515 2.294-0.529 4.022-2.038 4.483-5.155zm-8.022,11.249c-1.085,4.36-8.426,2.003-10.806,1.412l1.928-7.729c2.38,0.594 10.012,1.77 8.878,6.317zm1.086-11.312c-0.99,3.966-7.1,1.951-9.082,1.457l1.748-7.01c1.982,0.494 8.365,1.416 7.334,5.553z"/>
              </g>
            </svg>
          </div>
          <h3>Bitcoin</h3>
          <div className="wallet-address">
            <p>{cryptoAddresses.bitcoin.slice(0, 12)}...{cryptoAddresses.bitcoin.slice(-8)}</p>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(cryptoAddresses.bitcoin)}>
              <i className="fas fa-copy"></i>
            </button>
          </div>
          <Link to="/donate">
            <Button className="donate-btn" variant="outline-primary">Donate BTC</Button>
          </Link>
        </div>
        
        <div className="crypto-option">
          <div className="crypto-icon ethereum-icon">
            <svg viewBox="0 0 784.37 1277.39" width="100%" height="100%">
              <g>
                <polygon fill="#343434" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"/>
                <polygon fill="#8C8C8C" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"/>
                <polygon fill="#3C3C3B" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"/>
                <polygon fill="#8C8C8C" points="392.07,1277.38 392.07,956.52 0,724.89"/>
                <polygon fill="#141414" points="392.07,882.29 784.13,650.54 392.07,472.33"/>
                <polygon fill="#393939" points="0,650.54 392.07,882.29 392.07,472.33"/>
              </g>
            </svg>
          </div>
          <h3>Ethereum</h3>
          <div className="wallet-address">
            <p>{cryptoAddresses.ethereum.slice(0, 12)}...{cryptoAddresses.ethereum.slice(-8)}</p>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(cryptoAddresses.ethereum)}>
              <i className="fas fa-copy"></i>
            </button>
          </div>
          <Link to="/donate">
            <Button className="donate-btn" variant="outline-primary">Donate ETH</Button>
          </Link>
        </div>
        
        <div className="crypto-option">
          <div className="crypto-icon usdt-icon">
            <svg viewBox="0 0 2000 2000" width="100%" height="100%">
              <path fill="#26A17B" d="M1000,0c552.26,0,1000,447.74,1000,1000S1552.24,2000,1000,2000,0,1552.38,0,1000,447.68,0,1000,0"/>
              <path fill="#FFFFFF" d="M1123.42,866.76V718H1463.6V451.34H537.28V718H876.58V866.64C601,879.34,393.1,934.1,393.1,999.7s208,120.36,483.48,133.14v476.5h246V1132.8c274.6-12.74,481.52-67.46,481.52-133s-206.92-120.26-480.68-133m0,225.64v-0.12c-6.94.44-42.6,2.58-122,2.58-63.48,0-108.14-1.8-123.88-2.62v0.2c-246.4-11.2-430.18-49.26-430.18-94.84s183.78-83.66,430.18-94.86v156.3c16.1,0.96,62.16,3.22,124.94,3.22,75.86,0,114-2.52,121-3.12V804.84c245.39,11.2,428.09,49.24,428.09,94.7s-182.68,83.64-428.12,94.84"/>
            </svg>
          </div>
          <h3>USDT</h3>
          <div className="wallet-address">
            <p>{cryptoAddresses.usdt.slice(0, 12)}...{cryptoAddresses.usdt.slice(-8)}</p>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(cryptoAddresses.usdt)}>
              <i className="fas fa-copy"></i>
            </button>
          </div>
          <Link to="/donate">
            <Button className="donate-btn" variant="outline-primary">Donate USDT</Button>
          </Link>
        </div>
        
        <div className="crypto-option">
          <div className="crypto-icon solana-icon">
            <svg viewBox="0 0 397.7 311.7" width="100%" height="100%">
              <linearGradient id="solana-gradient" gradientUnits="userSpaceOnUse" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
                <stop offset="0" style={{stopColor:'#00FFA3'}}/>
                <stop offset="1" style={{stopColor:'#DC1FFF'}}/>
              </linearGradient>
              <path fill="url(#solana-gradient)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
              <path fill="url(#solana-gradient)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
              <path fill="url(#solana-gradient)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8 h317.4c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
            </svg>
          </div>
          <h3>Solana</h3>
          <div className="wallet-address">
            <p>{cryptoAddresses.solana.slice(0, 12)}...{cryptoAddresses.solana.slice(-8)}</p>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(cryptoAddresses.solana)}>
              <i className="fas fa-copy"></i>
            </button>
          </div>
          <Link to="/donate">
            <Button className="donate-btn" variant="outline-primary">Donate SOL</Button>
          </Link>
        </div>
      </div>

      <div className="donation-stats">
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fas fa-hand-holding-heart"></i>
          </div>
          <div className="stat-data">
            <h3>248</h3>
            <p>Donations this month</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-data">
            <h3>$42,592</h3>
            <p>Total value raised</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fas fa-coins"></i>
          </div>
          <div className="stat-data">
            <h3>4</h3>
            <p>Cryptocurrencies accepted</p>
          </div>
        </div>
      </div>

      <div className="donation-methods">
        <div className="method-title">
          <h3>Other Donation Methods</h3>
        </div>
        <div className="method-options">
          <div className="method-option">
            <div className="method-icon">
              <i className="fas fa-credit-card"></i>
            </div>
            <h4>Card Payment</h4>
            <Link to="/donate">
              <Button variant="outline-light" size="sm">Donate Now</Button>
            </Link>
          </div>
          <div className="method-option">
            <div className="method-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h4>UPI Payment</h4>
            <Link to="/donate?method=upi">
              <Button variant="outline-light" size="sm">Donate Now</Button>
            </Link>
          </div>
          <div className="method-option">
            <div className="method-icon">
              <i className="fas fa-university"></i>
            </div>
            <h4>Bank Transfer</h4>
            <Link to="/donate?method=netbanking">
              <Button variant="outline-light" size="sm">Donate Now</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="crypto-benefits">
        <div className="benefit-icon">
          <i className="fas fa-shield-alt"></i>
        </div>
        <div className="benefit-text">
          <p>All donations are securely processed and transferred to NGOs with full transparency on the blockchain</p>
        </div>
      </div>
    </div>
  );
};

export default CryptoDonation; 