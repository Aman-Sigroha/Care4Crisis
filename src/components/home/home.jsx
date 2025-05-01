import { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tachyons/css/tachyons.min.css'; 
import './home.css';
import './home-extended.css';
import './crypto-section.css';
import home1 from './images/home1.jpg';
import home2 from './images/home2.jpg';
import home3 from './images/home3.jpg';
import AboutCard from './aboutCard/aboutCard';
import CauseCard from './causesCard/causeCard';
import urgentCause1 from './images/urgentCauses1.jpg'
import urgentCause2 from './images/urgentCauses2.jpg'
import urgentCause3 from './images/urgentCauses3.jpg'
import about1 from './images/about1.jpeg';
import about2 from './images/about2.jpeg';
import VolunteerStats from './volunteer/volunteer';
import Footer from './footer/Footer';
import CryptoDonation from './crypto-donation/CryptoDonation';
import BlockchainFlow from './crypto-donation/BlockchainFlow';
import { Link } from 'react-router-dom';



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
                  <Link to="/Care4Crisis/donate">
                  <Button className='banner_button donate button1' variant="primary"><h2>Donate</h2></Button>
                  </Link>
                  <Link to="/Care4Crisis/events">
                  <Button className='banner_button explore button1' variant="primary"><h2>Explore</h2></Button>
                  </Link>
                </div>
              </div>
            </div>
            <Navbar className='sticky-navbar' bg="dark" data-bs-theme="dark">
              <Container style={{padding: '0', margin: '0', maxWidth: '100%'}}>
                <Navbar.Brand href="#home">{this.state.companyName}</Navbar.Brand>
                <Nav className="me-auto">
                  <Nav.Link href="#top">Home</Nav.Link>
                  <Nav.Link href="#cryptoSection">Why Crypto</Nav.Link>
                  <Nav.Link href="#blockchain-flow">Blockchain</Nav.Link>
                  <Nav.Link href="#donate-crypto">Donate</Nav.Link>
                  <Nav.Link href="#aboutSection">About Us</Nav.Link>
                  <Nav.Link href="#urgentCauseSection">Causes</Nav.Link>
                  <Nav.Link href="#volunteer">Volunteer</Nav.Link>
                  <Nav.Link href="/Care4Crisis/transparency">Transparency</Nav.Link>
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

            {/* home section */}
            <section className='home'>
              <div className='home1'>
                <div className='homeSectionTitle'>
                  <h2>WELCOME TO <span className='homeName'>{this.state.companyName}</span></h2>
                </div>
                <p>
                We are Care4Crisis/ non-profit/ fundraising/ NGO organizations. Our donation activities are taken place around the world,let
                contribute to them with us by your hand to be a better life.
                </p>
              </div>
              <div className='homeCardHolder' style={{
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                gap: '2rem',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                <AboutCard source={home1} h2='Support Peoples' h5='Be Good to People' para='All children are our future. They all deserve our love. Join us to feed, teach, protect, and nurture children in India...'></AboutCard>
                <AboutCard source={home2} h2='Save Wild Animals' h5='Live and Let Live' para='Who loves or pursues or desires to obtain pain of itself, because it is all pain, but occasionally circumstances occur which toil...'></AboutCard>
                <AboutCard source={home3} h2='Protect Our Planet' h5='Stop Destroying Our Planet' para='Pleasure and praising pain was born and I will give you a complete account of the ut system expound the actual teachings...'></AboutCard>
              </div>
            </section>
            
            {/* urgent cause section */}
            <a id = 'urgentCauseSection'></a>
            <section className='urgentCause'>
              <div className='urgentCause1'>
                <div className='causeSectionTitle'>
                  <h3>URGENT CAUSE</h3>
                  <Link to="/Care4Crisis/events">
                  <Button variant="outline-warning button2">ALL CAUSES</Button>
                  </Link>
                </div>

                <div className='causeCardHolder'>
                  <CauseCard source={urgentCause1} h3='Chilrens to get their home' para='Fusce et augue placerat, dictu velit sit amet, egestasuna. cras aliquam pretium ornar liquam metus. Aenean venenatis sodales...' goal={10000} raised={2000}></CauseCard>
                  <CauseCard source={urgentCause2} h3='We encourage girls education' para='Phasellus cursus nunc arcu, eget sollicitudin milacinia tempurs. Donec ligula turpis, egestas at volutpat no liquam...' goal={10000} raised={4000}></CauseCard>
                  <CauseCard source={urgentCause3} h3='The people to help themselves' para='Etiam vitae leo diam pellentesque portaed eleifend ultricies risu, vel rutrum era commodos Praesent finib congue euismod...' goal={10000} raised={6000}></CauseCard>
                </div>

              </div>
            </section>
            
            {/* why crypto section */}
            <a id="cryptoSection"></a>
            <section className='cryptoSection'>
              <div className='container'>
                <div className='cryptoSectionTitle'>
                  <h2>WHY WE USE <span className='cryptoName'>CRYPTOCURRENCY</span> FOR DONATIONS</h2>
                </div>
                <div className='cryptoContent'>
                  <div className='cryptoGrid'>
                    <div className='cryptoCard'>
                      <div className='cryptoIcon'>
                        <i className="fas fa-lock"></i>
                      </div>
                      <h3>Full Transparency</h3>
                      <p>Every transaction is recorded on the blockchain and can be publicly verified. You can track exactly where your donation goes and how it&apos;s used.</p>
                    </div>
                    <div className='cryptoCard'>
                      <div className='cryptoIcon'>
                        <i className="fas fa-globe"></i>
                      </div>
                      <h3>Global Accessibility</h3>
                      <p>Cryptocurrency allows us to receive and distribute funds worldwide without the restrictions, delays, and high fees of traditional banking systems.</p>
                    </div>
                    <div className='cryptoCard'>
                      <div className='cryptoIcon'>
                        <i className="fas fa-exchange-alt"></i>
                      </div>
                      <h3>Direct Transfers</h3>
                      <p>Funds go directly to NGOs as soon as donation goals are reached or timeframes end. No middlemen, no delays, no administrative holdups.</p>
                    </div>
                    <div className='cryptoCard'>
                      <div className='cryptoIcon'>
                        <i className="fas fa-hand-holding-usd"></i>
                      </div>
                      <h3>Lower Fees</h3>
                      <p>Traditional money transfers and payment processors often charge high fees. Cryptocurrency transactions typically have lower fees, meaning more of your donation goes to the cause.</p>
                    </div>
                    <div className='cryptoCard'>
                      <div className='cryptoIcon'>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <h3>Protection Against Corruption</h3>
                      <p>The immutable nature of blockchain makes it difficult for funds to be misappropriated, ensuring your donation reaches its intended destination.</p>
                    </div>
                    <div className='cryptoCard'>
                      <div className='cryptoIcon'>
                        <i className="fas fa-credit-card"></i>
                      </div>
                      <h3>Multiple Payment Options</h3>
                      <p>Don&apos;t have crypto? No problem! We accept UPI payments and convert them to cryptocurrency, giving you all the benefits of blockchain transparency.</p>
                    </div>
                  </div>
                  <div className='cryptoProcess'>
                    <h3>How It Works</h3>
                    <div className='processSteps'>
                      <div className='step'>
                        <div className='stepNumber'>1</div>
                        <p>Choose a cause and donate using cryptocurrency or UPI</p>
                      </div>
                      <div className='step'>
                        <div className='stepNumber'>2</div>
                        <p>UPI donations are automatically converted to cryptocurrency</p>
                      </div>
                      <div className='step'>
                        <div className='stepNumber'>3</div>
                        <p>Funds are held in secure wallets until goals are reached</p>
                      </div>
                      <div className='step'>
                        <div className='stepNumber'>4</div>
                        <p>100% of funds are transferred to the NGO once conditions are met</p>
                      </div>
                      <div className='step'>
                        <div className='stepNumber'>5</div>
                        <p>Receive confirmation with blockchain transaction details for verification</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* blockchain flow section */}
            <a id="blockchain-flow"></a>
            <section>
              <BlockchainFlow />
            </section>
            
            {/* crypto donation section */}
            <a id="donate-crypto"></a>
            <section>
              <CryptoDonation />
            </section>
            
            

            {/* about us section */}
            <a id="aboutSection"></a>
            <section>
              <div className='aboutUs'>
                <div className='aboutSectionTitle'>
                  <h4>ABOUT<span className='aboutName'>{ this.state.companyName}</span></h4>
                </div>
                <div className='aboutUsContent'>
                  <div>
                    <div className='aboutLeft1'>
                      <img src={about1}></img>
                      <div className='aboutText'>
                        <h4>How It Works</h4>
                        <p>Who loves or pursues or desires to obtain pain of itself, because it is pain, because occasionally circumstances occur which toil and pain can procure him some great pleasure.</p>
                      </div>
                    </div>
                    <div className='aboutLeft2'>
                      <img src={about2}></img>
                      <div className='aboutText'>
                        <h4>What We Do</h4>
                        <p>Idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actually teachings of the great explorer of the truth.</p>
                      </div>
                    </div>
                  </div>
                  <div className='abouRight aboutText'>
                    <p>When you give to Our humanity, you know your donation is making a difference. Whether you are supporting one of our Signature Programs or our carefully curated list of Gifts That Give More, our professional staff works hard every day to ensure every dollar has impact for the cause of your choice.</p>
                    <h4>Years of Experience</h4>
                    <p>We partner with over 320 amazing projects worldwide, and have given over $150 million in cash and product grants to other groups since 2011. We also operate our own dynamic suite of Signature Programs.</p>
                    <ul>
                      <li>✔️ This mistaken idea of denouncing pleasure</li>
                      <li>✔️ Master-builder of human happiness</li>
                      <li>✔️ Occasionally circumstances occur in toil</li>
                      <li>✔️ Undertakes laborious physical exercise</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* VOLUNTEER SECTION */}
            <a id="volunteer"></a>
            <section>
              <VolunteerStats></VolunteerStats>
            </section>

            {/* FOOTER SECTION*/}
            <section>
              <Footer></Footer>
            </section>

          </div>
        );
    }
}

export default Home;