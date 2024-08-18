import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tachyons/css/tachyons.min.css'; 
import './home.css';
import about1 from './images/about1.jpg';
import about2 from './images/about2.jpg';
import about3 from './images/about3.jpg';



class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            companyName: 'Care4Crisis'
        }
    }
    render() {
        return (
          <div>
            <a id="top"></a>
            <div id='1' className='image'>
              <div className='logoContainer'>
                <h1 className='logo'>{this.state.companyName}</h1>
                <div className='buttonContainer'>
                  <Button className='banner_button donate' variant="primary"><h2>Donate</h2></Button>
                  <Button className='banner_button explore' variant="primary"><h2>Explore</h2></Button>
                </div>
              </div>
            </div>
            <Navbar className='sticky-navbar' bg="dark" data-bs-theme="dark">
              <Container>
                <Navbar.Brand href="#home">{this.state.companyName}</Navbar.Brand>
                <Nav className="me-auto">
                  <Nav.Link href="#top">Home</Nav.Link>
                  <Nav.Link href="#about">About Us</Nav.Link>
                  <Nav.Link href="#causes">Causes</Nav.Link>
                  <Nav.Link href="#events">Events</Nav.Link>
                  <Nav.Link href="#gallery">Gallery</Nav.Link>
                  <Nav.Link href="#donate">Donate</Nav.Link>
                </Nav>
                <Navbar.Collapse className="justify-content-end">
                  {this.props.isSignedIn == false ? (
                    <Nav.Link href="#pricing">Pricing</Nav.Link>
                  ) : (
                    <Navbar.Text>
                    Signed in as: <a href="#account" className='name'>{this.props.userName}</a>
                    </Navbar.Text>
                  )}
                </Navbar.Collapse>
              </Container>
            </Navbar>
            <a id="about"></a>
            <section className='about'>
              <div className='about1'>
                <div className='sectionTitle'>
                  <h2>WELCOME TO <span className='aboutName'>{this.state.companyName}</span></h2>
                </div>
                <p>
                We are Care4Crisis/ non-profit/ fundraising/ NGO organizations. Our donation activities are taken place around the world,let
                contribute to them with us by your hand to be a better life.
                </p>
              </div>
              <div className='aboutCardHolder'>
              <div className='aboutCard'>
                <img src={about1}></img>
                <div className='aboutCardTitle'>
                  <h2>Support Peoples</h2>
                  <h5>Be Good to People</h5>
                </div>
                <div className='aboutPara'>All children are our future. They all deserve our love. Join us to feed, teach, protect, and nurture children in India...</div>
              </div>

              <div className='aboutCard'>
                <img src={about2}></img>
                <div className='aboutCardTitle'>
                  <h2>Save Wild Animals</h2>
                  <h5>Live and Let Live</h5>
                </div>
                <div className='aboutPara'>Who loves or pursues or desires to obtain pain of itself, because it is all pain, but occasionally circumstances occur which toil...</div>
              </div>

              <div className='aboutCard'>
                <img src={about3}></img>
                <div className='aboutCardTitle'>
                  <h2>Protect Our Planet</h2>
                  <h5>Stop Destroying Our Planet</h5>
                </div>
                <div className='aboutPara'>Pleasure and praising pain was born and I will give you a complete account of the ut system expound the actual teachings...</div>
              </div>
            
              </div>
            </section>

          </div>
        );
    }
}

export default Home;