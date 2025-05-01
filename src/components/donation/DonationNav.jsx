import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './DonationNav.css';

const DonationNav = () => {
  return (
    <Navbar className='donation-navbar' bg="dark" data-bs-theme="dark" expand="lg" sticky="top">
      <Container>
        <Link to="/">
          <Navbar.Brand>Care4Crisis</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/events" className="nav-link">Causes</Link>
            <Nav.Link href="#about">About Us</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <div className="secure-badge">
              <i className="fas fa-lock"></i> Secure Donation
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default DonationNav; 