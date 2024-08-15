import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'tachyons/css/tachyons.min.css'; 
import './home.css'

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: 'Care4Crisis'
        }
    }
    render() {
        return (
          <div>
            <a id="top"></a>
            <div id='1' className='image'>
              <div className='logoContainer'>
                <h1 className='logo'>{this.state.name}</h1>
                <div className='buttonContainer'>
                  <Button className='button' variant="primary"><h2>Donate</h2></Button>
                  <Button className='button' variant="primary"><h2>Explore</h2></Button>
                </div>
              </div>
            </div>
            <Navbar className='sticky-navbar' bg="dark" data-bs-theme="dark">
              <Container>
                <Navbar.Brand href="#home">{this.state.name}</Navbar.Brand>
                <Nav className="me-auto">
                  <Nav.Link href="#top">Home</Nav.Link>
                  <Nav.Link href="#about">About Us</Nav.Link>
                  <Nav.Link href="#pricing">Pricing</Nav.Link>
                </Nav>
                <Navbar.Collapse className="justify-content-end">
                  <Navbar.Text>
                    Signed in as: <a href="#login">{this.props.userName}</a>
                  </Navbar.Text>
                </Navbar.Collapse>
              </Container>
            </Navbar>
            <a id="about"></a>
            

          </div>
        );
    }
}

export default Home;