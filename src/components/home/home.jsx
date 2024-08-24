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
import AboutCard from './aboutCard/aboutCard';
import CauseCard from './causesCard/causeCard';
import urgentCause1 from './images/urgentCauses1.jpg'
import urgentCause2 from './images/urgentCauses2.jpg'
import urgentCause3 from './images/urgentCauses3.jpg'




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
                  <Button className='banner_button donate button1' variant="primary"><h2>Donate</h2></Button>
                  <Button className='banner_button explore button1' variant="primary"><h2>Explore</h2></Button>
                </div>
              </div>
            </div>
            <Navbar className='sticky-navbar' bg="dark" data-bs-theme="dark">
              <Container>
                <Navbar.Brand href="#home">{this.state.companyName}</Navbar.Brand>
                <Nav className="me-auto">
                  <Nav.Link href="#top">Home</Nav.Link>
                  <Nav.Link href="#aboutSection">About Us</Nav.Link>
                  <Nav.Link href="#urgentCauseSection">Causes</Nav.Link>
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

            {/* about section */}
            <a id="aboutSection"></a>
            <section className='about'>
              <div className='about1'>
                <div className='aboutSectionTitle'>
                  <h2>WELCOME TO <span className='aboutName'>{this.state.companyName}</span></h2>
                </div>
                <p>
                We are Care4Crisis/ non-profit/ fundraising/ NGO organizations. Our donation activities are taken place around the world,let
                contribute to them with us by your hand to be a better life.
                </p>
              </div>
              <div className='aboutCardHolder'>
                <AboutCard source={about1} h2='Support Peoples' h5='Be Good to People' para='All children are our future. They all deserve our love. Join us to feed, teach, protect, and nurture children in India...'></AboutCard>
                <AboutCard source={about2} h2='Save Wild Animals' h5='Live and Let Live' para='Who loves or pursues or desires to obtain pain of itself, because it is all pain, but occasionally circumstances occur which toil...'></AboutCard>
                <AboutCard source={about3} h2='Protect Our Planet' h5='Stop Destroying Our Planet' para='Pleasure and praising pain was born and I will give you a complete account of the ut system expound the actual teachings...'></AboutCard>
              </div>
            </section>
            
            {/* urgent cause section */}
            <a id = 'urgentCauseSection'></a>
            <section className='urgentCause'>
              <div className='urgentCause1'>
                <div className='causeSectionTitle'>
                  <h3>URGENT CAUSE</h3>
                  <Button variant="outline-warning button2">ALL CAUSES</Button>
                </div>

                <div className='causeCardHolder'>
                  <CauseCard source={urgentCause1} h3='Chilrens to get their home' para='Fusce et augue placerat, dictu velit sit amet, egestasuna. cras aliquam pretium ornar liquam metus. Aenean venenatis sodales...' goal={10000} raised={2000}></CauseCard>
                  <CauseCard source={urgentCause2} h3='We encourage girls education' para='Phasellus cursus nunc arcu, eget sollicitudin milacinia tempurs. Donec ligula turpis, egestas at volutpat no liquam...' goal={10000} raised={4000}></CauseCard>
                  <CauseCard source={urgentCause3} h3='The people to help themselves' para='Etiam vitae leo diam pellentesque portaed eleifend ultricies risu, vel rutrum era commodos Praesent finib congue euismod...' goal={10000} raised={6000}></CauseCard>
                </div>

              </div>
            </section>

          </div>
        );
    }
}

export default Home;