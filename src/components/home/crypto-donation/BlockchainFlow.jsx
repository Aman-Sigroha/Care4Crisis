import { useEffect } from 'react';
import './BlockchainFlow.css';

const BlockchainFlow = () => {
  useEffect(() => {
    // Animation to start when component mounts
    const intervalId = setInterval(() => {
      animateFlow();
    }, 6000); // Increased interval for better visualization
    
    // Initial animation
    setTimeout(() => {
      animateFlow();
    }, 500); // Slight delay for initial animation
    
    return () => clearInterval(intervalId);
  }, []);

  const animateFlow = () => {
    const blocks = document.querySelectorAll('.blockchain-block');
    const tokens = document.querySelectorAll('.token');
    
    // Reset animations
    blocks.forEach(block => {
      block.classList.remove('pulse');
    });
    
    tokens.forEach(token => {
      token.style.opacity = '0';
      // Reset position
      if (token.classList.contains('token-1')) {
        token.style.left = '12.5%';
      } else if (token.classList.contains('token-2')) {
        token.style.left = '37.5%';
      } else if (token.classList.contains('token-3')) {
        token.style.left = '62.5%';
      }
    });
    
    // Animate blocks sequentially
    setTimeout(() => {
      if (blocks[0]) blocks[0].classList.add('pulse');
      const token1 = document.querySelector('.token-1');
      if (token1) token1.style.opacity = '1';
    }, 500);
    
    setTimeout(() => {
      const token1 = document.querySelector('.token-1');
      if (token1) token1.style.left = '37.5%';
      setTimeout(() => {
        if (blocks[1]) blocks[1].classList.add('pulse');
      }, 500);
    }, 1000);
    
    setTimeout(() => {
      const token2 = document.querySelector('.token-2');
      if (token2) token2.style.opacity = '1';
    }, 2000);
    
    setTimeout(() => {
      const token2 = document.querySelector('.token-2');
      if (token2) token2.style.left = '62.5%';
      setTimeout(() => {
        if (blocks[2]) blocks[2].classList.add('pulse');
      }, 500);
    }, 2500);
    
    setTimeout(() => {
      const token3 = document.querySelector('.token-3');
      if (token3) token3.style.opacity = '1';
    }, 3500);
    
    setTimeout(() => {
      const token3 = document.querySelector('.token-3');
      if (token3) token3.style.left = '87.5%';
      setTimeout(() => {
        if (blocks[3]) blocks[3].classList.add('pulse');
      }, 500);
    }, 4000);
  };

  return (
    <div className="blockchain-flow-container">
      <h2>HOW DONATIONS FLOW THROUGH THE <span className="blockchain-highlight">BLOCKCHAIN</span></h2>
      
      <div className="blockchain-visualization">
        <div className="blockchain-path">
          <div className="blockchain-block" id="block-1">
            <div className="block-header">
              <div className="block-hash">#F8D1...</div>
              <div className="block-number">BLOCK 12783</div>
            </div>
            <div className="block-content">
              <div className="tx-label">DONOR</div>
              <div className="tx-id">TX: 0xfe8c...</div>
              <div className="tx-amount">0.5 ETH</div>
            </div>
          </div>
          
          <div className="blockchain-block" id="block-2">
            <div className="block-header">
              <div className="block-hash">#A3E7...</div>
              <div className="block-number">BLOCK 12784</div>
            </div>
            <div className="block-content">
              <div className="tx-label">PLATFORM</div>
              <div className="tx-id">TX: 0x71b9...</div>
              <div className="tx-amount">VERIFY</div>
            </div>
          </div>
          
          <div className="blockchain-block" id="block-3">
            <div className="block-header">
              <div className="block-hash">#C2D9...</div>
              <div className="block-number">BLOCK 12785</div>
            </div>
            <div className="block-content">
              <div className="tx-label">SMART<br/>CONTRACT</div>
              <div className="tx-id">TX: 0x91f3...</div>
              <div className="tx-amount">ESCROW</div>
            </div>
          </div>
          
          <div className="blockchain-block" id="block-4">
            <div className="block-header">
              <div className="block-hash">#B7F2...</div>
              <div className="block-number">BLOCK 12786</div>
            </div>
            <div className="block-content">
              <div className="tx-label">NGO</div>
              <div className="tx-id">TX: 0x82d5...</div>
              <div className="tx-amount">0.5 ETH</div>
            </div>
          </div>
          
          <div className="token token-1">
            <i className="fas fa-coins"></i>
          </div>
          
          <div className="token token-2">
            <i className="fas fa-coins"></i>
          </div>
          
          <div className="token token-3">
            <i className="fas fa-coins"></i>
          </div>
          
          <div className="blockchain-arrow arrow-1"></div>
          <div className="blockchain-arrow arrow-2"></div>
          <div className="blockchain-arrow arrow-3"></div>
        </div>
        
        <div className="blockchain-labels">
          <div className="label">You Donate</div>
          <div className="label">Verified on Blockchain</div>
          <div className="label">Held in Smart Contract</div>
          <div className="label">Transferred to NGO</div>
        </div>
      </div>
      
      <div className="blockchain-features">
        <div className="feature">
          <div className="feature-icon">
            <i className="fas fa-search-dollar"></i>
          </div>
          <h3>Complete Transparency</h3>
          <p>Every transaction is recorded on a public ledger that anyone can verify at any time</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">
            <i className="fas fa-robot"></i>
          </div>
          <h3>Automated Release</h3>
          <p>Smart contracts automatically release funds when donation goals are reached</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">
            <i className="fas fa-file-contract"></i>
          </div>
          <h3>Immutable Records</h3>
          <p>Donation records cannot be altered, ensuring complete accountability</p>
        </div>
      </div>
    </div>
  );
};

export default BlockchainFlow; 