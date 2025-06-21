import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './EventsNav.css';

const EventsNav = () => {
  return (
    <Navbar className='events-navbar' bg="dark" data-bs-theme="dark" expand="lg" sticky="top">
      <Container>
        <Link to="/Care4Crisis/home">
          <Navbar.Brand href="#home">Care4Crisis</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/Care4Crisis/home" className="nav-link">Home</Link>
            <Nav.Link href="#top" className="active">Causes</Nav.Link>
            <Link to="/Care4Crisis/transparency" className="nav-link">Transparency</Link>
          </Nav>
          <Nav className="ms-auto">
            <Link to="/Care4Crisis/donate">
              <Button variant="outline-primary" className="donate-nav-btn">
                <i className="fas fa-coins"></i> Donate Now
              </Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default EventsNav; 