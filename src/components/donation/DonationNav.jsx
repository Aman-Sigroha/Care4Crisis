import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './DonationNav.css';
import WalletConnector from '../common/WalletConnector';

// Import BASE_PATH constant from App.jsx or define it here
const BASE_PATH = '/Care4Crisis';

const DonationNav = ({ isWalletConnected, walletAddress, walletType, onWalletUpdate }) => {
  return (
    <Navbar className='donation-navbar' bg="dark" data-bs-theme="dark" expand="lg" sticky="top">
      <Container>
        <Link to={`${BASE_PATH}/`}>
          <Navbar.Brand>Care4Crisis</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to={`${BASE_PATH}/`} className="nav-link">Home</Link>
            <Link to={`${BASE_PATH}/events`} className="nav-link">Causes</Link>
          </Nav>
          <Nav className="ms-auto d-flex align-items-center">
            <WalletConnector
              isWalletConnected={isWalletConnected}
              walletAddress={walletAddress}
              walletType={walletType}
              onWalletConnect={onWalletUpdate}
            />
            <div className="secure-badge ms-3">
              <i className="fas fa-lock"></i> Secure Donation
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default DonationNav; 