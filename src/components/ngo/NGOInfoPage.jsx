import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Tab, Tabs } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Footer from '../home/footer/Footer';
import './NGOInfoPage.css';

// Import BASE_PATH constant or define it here
const BASE_PATH = '/Care4Crisis';

// Sample NGO data - would be fetched from API in production
const ngoDatabase = {
  "wateraid-foundation": {
    id: "wateraid-foundation",
    name: "WaterAid Foundation",
    logo: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
    coverImage: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "WaterAid Foundation is dedicated to providing clean and safe drinking water to communities around the world that lack access to this basic necessity. Our mission is to transform lives by improving access to clean water, decent toilets, and good hygiene.",
    mission: "To transform the lives of the poorest and most marginalized people by improving access to safe water, sanitation, and hygiene services.",
    vision: "A world where everyone has access to safe water and sanitation.",
    foundedYear: 1981,
    headquarters: "London, UK with operations in 34 countries",
    leadership: [
      { name: "Sarah Walker", position: "CEO" },
      { name: "Michael Chen", position: "Director of Operations" },
      { name: "Priya Singh", position: "Chief of Field Programs" }
    ],
    impactStats: {
      peopleHelped: "28.5 million",
      countriesServed: 34,
      projectsCompleted: 187,
      volunteerCount: 5400
    },
    financialInfo: {
      transparencyRating: "A+",
      adminExpenseRatio: "8.5%",
      programExpenseRatio: "86.3%",
      fundraisingExpenseRatio: "5.2%"
    },
    contactInfo: {
      email: "contact@wateraid.org",
      phone: "+1 (555) 123-4567",
      website: "https://www.wateraid.org",
      socialMedia: {
        twitter: "@WaterAid",
        facebook: "WaterAid",
        instagram: "wateraid"
      }
    },
    activeProjects: [
      {
        name: "Clean Water Initiative",
        location: "Eastern Africa",
        goal: 15000,
        raised: 9750,
        deadline: "2023-12-15"
      },
      {
        name: "Community Well Construction",
        location: "South Asia",
        goal: 22000,
        raised: 15300,
        deadline: "2024-01-10"
      },
      {
        name: "Water Purification Stations",
        location: "Southeast Asia",
        goal: 18000,
        raised: 7200,
        deadline: "2024-02-28"
      }
    ],
    blockchainVerification: {
      walletAddress: "0x7a8C5F24f21ed0A6287b873B7B7334E0c5603Ea9",
      transactionLink: "https://sepolia.etherscan.io/address/0x7a8C5F24f21ed0A6287b873B7B7334E0c5603Ea9",
      verificationType: "Ethereum Smart Contract",
      verificationAuthority: "Deloitte Blockchain Audit"
    }
  },
  "education-first-ngo": {
    id: "education-first-ngo",
    name: "Education First NGO",
    logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
    coverImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Education First NGO is committed to ensuring quality education for all, particularly focusing on girls and underserved communities. We work to break down barriers to education and create opportunities for children to learn and grow.",
    mission: "To ensure that every child, regardless of their circumstances, has access to quality education.",
    vision: "A world where education is accessible to all and serves as a pathway out of poverty.",
    foundedYear: 2005,
    headquarters: "New York, USA with projects in 22 countries",
    leadership: [
      { name: "David Okafor", position: "Executive Director" },
      { name: "Lisa Wong", position: "Program Director" },
      { name: "Raj Patel", position: "Chief Financial Officer" }
    ],
    impactStats: {
      peopleHelped: "12.2 million",
      countriesServed: 22,
      projectsCompleted: 143,
      volunteerCount: 3800
    },
    financialInfo: {
      transparencyRating: "A",
      adminExpenseRatio: "9.2%",
      programExpenseRatio: "84.6%",
      fundraisingExpenseRatio: "6.2%"
    },
    contactInfo: {
      email: "info@educationfirst.org",
      phone: "+1 (555) 987-6543",
      website: "https://www.educationfirst.org",
      socialMedia: {
        twitter: "@EduFirst",
        facebook: "EducationFirstNGO",
        instagram: "education_first_ngo"
      }
    },
    activeProjects: [
      {
        name: "Education for Girls",
        location: "South Asia",
        goal: 25000,
        raised: 18200,
        deadline: "2023-12-31"
      },
      {
        name: "School Building Project",
        location: "East Africa",
        goal: 40000,
        raised: 22500,
        deadline: "2024-03-15"
      },
      {
        name: "Teacher Training Program",
        location: "Central America",
        goal: 15000,
        raised: 9800,
        deadline: "2024-01-20"
      }
    ],
    blockchainVerification: {
      walletAddress: "0x9bC5Fc9B0AeE9488Ff797B0d49Aa49e5e4f2B3EA",
      transactionLink: "https://sepolia.etherscan.io/address/0x9bC5Fc9B0AeE9488Ff797B0d49Aa49e5e4f2B3EA",
      verificationType: "Ethereum Smart Contract",
      verificationAuthority: "PwC Blockchain Verification"
    }
  },
  "rapid-response-relief": {
    id: "rapid-response-relief",
    name: "Rapid Response Relief",
    logo: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
    coverImage: "https://images.unsplash.com/photo-1547683905-f686c993aae5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Rapid Response Relief provides immediate assistance to communities affected by natural disasters and emergencies. We deploy quickly to deliver essential supplies, medical aid, and logistical support when it matters most.",
    mission: "To deliver rapid, effective relief to communities affected by disasters, reducing suffering and supporting recovery.",
    vision: "A world where no community faces disaster recovery alone.",
    foundedYear: 2010,
    headquarters: "Seattle, USA with global response capabilities",
    leadership: [
      { name: "James Rodriguez", position: "Executive Director" },
      { name: "Elena Kim", position: "Operations Director" },
      { name: "Abdul Hassan", position: "Logistics Coordinator" }
    ],
    impactStats: {
      peopleHelped: "3.7 million",
      countriesServed: 28,
      projectsCompleted: 75,
      volunteerCount: 2500
    },
    financialInfo: {
      transparencyRating: "A",
      adminExpenseRatio: "7.8%",
      programExpenseRatio: "87.2%",
      fundraisingExpenseRatio: "5.0%"
    },
    contactInfo: {
      email: "info@rapidresponse.org",
      phone: "+1 (555) 456-7890",
      website: "https://www.rapidresponse.org",
      socialMedia: {
        twitter: "@RapidResponse",
        facebook: "RapidResponseRelief",
        instagram: "rapid_response_relief"
      }
    },
    activeProjects: [
      {
        name: "Emergency Flood Relief",
        location: "Southeast Asia",
        goal: 50000,
        raised: 32150,
        deadline: "2023-11-30"
      },
      {
        name: "Earthquake Recovery",
        location: "Central Asia",
        goal: 65000,
        raised: 41200,
        deadline: "2024-01-15"
      },
      {
        name: "Hurricane Response",
        location: "Caribbean",
        goal: 55000,
        raised: 28700,
        deadline: "2023-12-20"
      }
    ],
    blockchainVerification: {
      walletAddress: "0x3aD4E8B9A3A6D9864ce69cF3E92A427f6fA1BF3C",
      transactionLink: "https://sepolia.etherscan.io/address/0x3aD4E8B9A3A6D9864ce69cF3E92A427f6fA1BF3C",
      verificationType: "Ethereum Smart Contract",
      verificationAuthority: "Ernst & Young Blockchain Verification"
    }
  },
  "childrens-health-foundation": {
    id: "childrens-health-foundation",
    name: "Children's Health Foundation",
    logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
    coverImage: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Children's Health Foundation is dedicated to improving the health and well-being of children worldwide through medical care, vaccination programs, and health education. We believe every child deserves a healthy start in life.",
    mission: "To ensure that all children have access to essential healthcare and the opportunity to thrive.",
    vision: "A world where no child suffers from preventable diseases or lack of healthcare.",
    foundedYear: 1995,
    headquarters: "Boston, USA with programs in 31 countries",
    leadership: [
      { name: "Dr. Emily Sanchez", position: "President" },
      { name: "Robert Lee", position: "Director of Programs" },
      { name: "Grace Okonkwo", position: "Medical Director" }
    ],
    impactStats: {
      peopleHelped: "15.3 million",
      countriesServed: 31,
      projectsCompleted: 208,
      volunteerCount: 4700
    },
    financialInfo: {
      transparencyRating: "A+",
      adminExpenseRatio: "8.0%",
      programExpenseRatio: "85.5%",
      fundraisingExpenseRatio: "6.5%"
    },
    contactInfo: {
      email: "contact@childrenshealth.org",
      phone: "+1 (555) 234-5678",
      website: "https://www.childrenshealth.org",
      socialMedia: {
        twitter: "@ChildrensHealth",
        facebook: "ChildrensHealthFoundation",
        instagram: "childrens_health"
      }
    },
    activeProjects: [
      {
        name: "Healthcare for Children",
        location: "Multiple Regions",
        goal: 40000,
        raised: 27500,
        deadline: "2024-01-31"
      },
      {
        name: "Vaccination Campaign",
        location: "West Africa",
        goal: 35000,
        raised: 19800,
        deadline: "2023-12-31"
      },
      {
        name: "Pediatric Clinic Support",
        location: "South America",
        goal: 30000,
        raised: 15600,
        deadline: "2024-02-15"
      }
    ],
    blockchainVerification: {
      walletAddress: "0x5F2dB7E93A9C7cD2D45454f3CcD8624c8b3eF5Ec",
      transactionLink: "https://sepolia.etherscan.io/address/0x5F2dB7E93A9C7cD2D45454f3CcD8624c8b3eF5Ec",
      verificationType: "Ethereum Smart Contract",
      verificationAuthority: "KPMG Blockchain Audit"
    }
  }
};

const NGOInfoPage = () => {
  const { ngoId } = useParams();
  const [ngoData, setNgoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API fetch with a timeout
    setLoading(true);
    
    setTimeout(() => {
      // Check if NGO exists in our database
      if (ngoDatabase[ngoId]) {
        setNgoData(ngoDatabase[ngoId]);
      } else {
        // If NGO not found, use default (first one in the database)
        const fallbackNgoId = Object.keys(ngoDatabase)[0];
        setNgoData(ngoDatabase[fallbackNgoId]);
      }
      setLoading(false);
    }, 800);
  }, [ngoId]);
  
  // Helper function to calculate percentage
  const calculatePercentage = (raised, goal) => {
    return Math.round((raised / goal) * 100);
  };
  
  // Helper function to convert percentage string to CSS width
  const getWidthFromPercentage = (percentageStr) => {
    if (!percentageStr) return "0%";
    // Remove the % sign and convert to a number
    const percentage = parseFloat(percentageStr);
    if (isNaN(percentage)) return "0%";
    return `${percentage}%`;
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading NGO information...</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="ngo-info-page">
        <div className="ngo-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(10, 14, 23, 0.8)), url(${ngoData.coverImage})` }}>
          <Container>
            <Row className="align-items-center">
              <Col md={3} className="text-center">
                <div className="ngo-logo">
                  <img 
                    src={ngoData.logo || "https://via.placeholder.com/150?text=NGO"} 
                    alt={`${ngoData.name} Logo`} 
                  />
                </div>
              </Col>
              <Col md={9}>
                <h1>{ngoData.name}</h1>
                <p className="ngo-tagline">{ngoData.mission}</p>
                <div className="verification-badge">
                  <Badge bg="success">
                    <i className="fas fa-check-circle"></i> Blockchain Verified
                  </Badge>
                  <Badge bg="info" className="ms-2">
                    <i className="fas fa-award"></i> {ngoData.financialInfo.transparencyRating} Rating
                  </Badge>
                </div>
                <div className="cta-buttons mt-3">
                  <Button 
                    variant="primary" 
                    className="me-2"
                    onClick={() => navigate(`${BASE_PATH}/donate`)}
                  >
                    <i className="fas fa-hand-holding-heart"></i> Donate Now
                  </Button>
                  <a 
                    href={ngoData.contactInfo.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline-light"
                  >
                    <i className="fas fa-external-link-alt"></i> Visit Website
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        
        <Container className="ngo-content">
          <Tabs defaultActiveKey="about" id="ngo-tabs" className="mb-4">
            <Tab eventKey="about" title="About">
              <Card className="mb-4">
                <Card.Body>
                  <h2>About {ngoData.name}</h2>
                  <div className="ngo-description">
                    <p>{ngoData.description}</p>
                  </div>
                  
                  <Row className="mt-4">
                    <Col md={6}>
                      <h3>Our Mission</h3>
                      <p>{ngoData.mission}</p>
                      
                      <h3>Our Vision</h3>
                      <p>{ngoData.vision}</p>
                    </Col>
                    <Col md={6}>
                      <h3>Quick Facts</h3>
                      <table className="quick-facts">
                        <tbody>
                          <tr>
                            <td><i className="fas fa-calendar-alt"></i> Founded</td>
                            <td>{ngoData.foundedYear}</td>
                          </tr>
                          <tr>
                            <td><i className="fas fa-map-marker-alt"></i> Headquarters</td>
                            <td>{ngoData.headquarters}</td>
                          </tr>
                          <tr>
                            <td><i className="fas fa-globe"></i> Countries Served</td>
                            <td>{ngoData.impactStats.countriesServed}</td>
                          </tr>
                          <tr>
                            <td><i className="fas fa-users"></i> People Helped</td>
                            <td>{ngoData.impactStats.peopleHelped}</td>
                          </tr>
                          <tr>
                            <td><i className="fas fa-check-circle"></i> Projects Completed</td>
                            <td>{ngoData.impactStats.projectsCompleted}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                  
                  <h3 className="mt-4">Leadership</h3>
                  <Row className="leadership-section">
                    {ngoData.leadership.map((leader, index) => (
                      <Col md={4} key={index}>
                        <div className="leader-card">
                          <div className="leader-avatar">
                            {leader.image ? (
                              <img src={leader.image} alt={leader.name} />
                            ) : (
                              <div className="avatar-placeholder">
                                <i className="fas fa-user-circle"></i>
                                <div className="avatar-initials">
                                  {leader.name.split(' ').map(n => n[0]).join('')}
                                </div>
                              </div>
                            )}
                          </div>
                          <h4>{leader.name}</h4>
                          <p>{leader.position}</p>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="projects" title="Active Projects">
              <Card className="mb-4">
                <Card.Body>
                  <h2>Active Projects</h2>
                  <Row className="projects-grid">
                    {ngoData.activeProjects.map((project, index) => (
                      <Col md={4} key={index} className="mb-4">
                        <div className="project-card">
                          <h3>{project.name}</h3>
                          <div className="project-details">
                            <p><i className="fas fa-map-marker-alt"></i> {project.location}</p>
                            <p className="deadline"><i className="fas fa-clock"></i> Deadline: {project.deadline}</p>
                            
                            <div className="funding-progress">
                              <div className="progress-stats">
                                <span>Raised: ${project.raised}</span>
                                <span>Goal: ${project.goal}</span>
                              </div>
                              <div className="progress-bar-container">
                                <div 
                                  className="progress-bar-fill" 
                                  style={{ width: `${calculatePercentage(project.raised, project.goal)}%` }}
                                >
                                </div>
                              </div>
                              <div className="progress-percentage">
                                {calculatePercentage(project.raised, project.goal)}% Complete
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline-primary" 
                              className="mt-3 w-100"
                              onClick={() => navigate(`${BASE_PATH}/donate/${index + 1}`)}
                            >
                              Donate to Project
                            </Button>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="transparency" title="Financial Transparency">
              <Card className="mb-4">
                <Card.Body>
                  <h2>Financial Transparency</h2>
                  <Row className="financial-overview">
                    <Col md={6}>
                      <div className="expense-ratio-chart">
                        <h3>Expense Allocation</h3>
                        <div className="ratio-bars">
                          <div className="ratio-item">
                            <div className="ratio-label">Program Expenses</div>
                            <div className="ratio-bar-container">
                              <div 
                                className="ratio-bar program"
                                style={{ width: getWidthFromPercentage(ngoData.financialInfo.programExpenseRatio) }}
                              ></div>
                              <span className="ratio-value">{ngoData.financialInfo.programExpenseRatio}</span>
                            </div>
                          </div>
                          <div className="ratio-item">
                            <div className="ratio-label">Administrative Expenses</div>
                            <div className="ratio-bar-container">
                              <div 
                                className="ratio-bar admin"
                                style={{ width: getWidthFromPercentage(ngoData.financialInfo.adminExpenseRatio) }}
                              ></div>
                              <span className="ratio-value">{ngoData.financialInfo.adminExpenseRatio}</span>
                            </div>
                          </div>
                          <div className="ratio-item">
                            <div className="ratio-label">Fundraising Expenses</div>
                            <div className="ratio-bar-container">
                              <div 
                                className="ratio-bar fundraising"
                                style={{ width: getWidthFromPercentage(ngoData.financialInfo.fundraisingExpenseRatio) }}
                              ></div>
                              <span className="ratio-value">{ngoData.financialInfo.fundraisingExpenseRatio}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="blockchain-verification">
                        <h3>Blockchain Verification</h3>
                        <p>
                          All donations and fund distributions for {ngoData.name} are verified and 
                          tracked on the blockchain for complete transparency.
                        </p>
                        <div className="verification-details">
                          <div className="detail-item">
                            <span className="detail-label">Verification Type:</span>
                            <span className="detail-value">{ngoData.blockchainVerification.verificationType}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Verified By:</span>
                            <span className="detail-value">{ngoData.blockchainVerification.verificationAuthority}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Wallet Address:</span>
                            <code className="detail-value address">{ngoData.blockchainVerification.walletAddress}</code>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Transaction History:</span>
                            <a 
                              href={ngoData.blockchainVerification.transactionLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="detail-value link"
                            >
                              View on Blockchain <i className="fas fa-external-link-alt"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="contact" title="Contact">
              <Card className="mb-4">
                <Card.Body>
                  <h2>Contact Information</h2>
                  <Row className="contact-info">
                    <Col md={6}>
                      <div className="contact-details">
                        <div className="contact-item">
                          <i className="fas fa-envelope"></i>
                          <div className="contact-text">
                            <h4>Email</h4>
                            <p><a href={`mailto:${ngoData.contactInfo.email}`}>{ngoData.contactInfo.email}</a></p>
                          </div>
                        </div>
                        <div className="contact-item">
                          <i className="fas fa-phone-alt"></i>
                          <div className="contact-text">
                            <h4>Phone</h4>
                            <p><a href={`tel:${ngoData.contactInfo.phone}`}>{ngoData.contactInfo.phone}</a></p>
                          </div>
                        </div>
                        <div className="contact-item">
                          <i className="fas fa-globe"></i>
                          <div className="contact-text">
                            <h4>Website</h4>
                            <p>
                              <a 
                                href={ngoData.contactInfo.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                {ngoData.contactInfo.website.replace('https://', '')}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="social-media">
                        <h3>Follow Us</h3>
                        <div className="social-links">
                          <a 
                            href={`https://twitter.com/${ngoData.contactInfo.socialMedia.twitter.replace('@', '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="social-link twitter"
                          >
                            <i className="fab fa-twitter"></i>
                            <span className="social-username">Twitter</span>
                          </a>
                          <a 
                            href={`https://facebook.com/${ngoData.contactInfo.socialMedia.facebook}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="social-link facebook"
                          >
                            <i className="fab fa-facebook-f"></i>
                            <span className="social-username">Facebook</span>
                          </a>
                          <a 
                            href={`https://instagram.com/${ngoData.contactInfo.socialMedia.instagram}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="social-link instagram"
                          >
                            <i className="fab fa-instagram"></i>
                            <span className="social-username">Instagram</span>
                          </a>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
          
          <div className="back-navigation">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(-1)}
              className="back-button"
            >
              <i className="fas fa-arrow-left"></i> Back
            </Button>
            <Link to={`${BASE_PATH}/events`} className="btn btn-outline-primary">
              Browse All Causes
            </Link>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default NGOInfoPage; 