import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import EventCard from './EventCard';
import EventsNav from './EventsNav';
import './EventsPage.css';
import { Link } from 'react-router-dom';
import EventDistribution from './EventDistribution';

// Sample event data - this would typically come from an API
const sampleEvents = [
  {
    id: 1,
    title: "Clean Water Initiative",
    image: "/events/event1.jpg",
    category: "ENVIRONMENT",
    description: "Providing clean drinking water to remote villages in drought-affected regions. Access to clean water is a fundamental human right.",
    goal: 15000,
    raised: 9750,
    daysLeft: 12,
    organizer: "WaterAid Foundation",
    location: "Eastern Africa"
  },
  {
    id: 2,
    title: "Education for Girls",
    image: "/events/event2.jpg",
    category: "EDUCATION",
    description: "Supporting education for girls in underserved communities. Empowering young women through knowledge and skills development.",
    goal: 25000,
    raised: 18200,
    daysLeft: 20,
    organizer: "Education First NGO",
    location: "South Asia"
  },
  {
    id: 3,
    title: "Emergency Flood Relief",
    image: "/events/event3.jpg",
    category: "DISASTER",
    description: "Providing emergency supplies and support to families affected by recent flooding. Immediate assistance for those who lost everything.",
    goal: 50000,
    raised: 32150,
    daysLeft: 5,
    organizer: "Rapid Response Relief",
    location: "Southeast Asia"
  },
  {
    id: 4,
    title: "Wildlife Conservation",
    image: "/events/event4.jpg",
    category: "WILDLIFE",
    description: "Protecting endangered species and their habitats from poaching and environmental destruction. Preserving biodiversity for future generations.",
    goal: 35000,
    raised: 12800,
    daysLeft: 30,
    organizer: "Wildlife Protection Society",
    location: "Global Initiative"
  },
  {
    id: 5,
    title: "Healthcare for Children",
    image: "/events/event5.jpg",
    category: "HEALTH",
    description: "Providing essential medical care and vaccinations for children in poverty-stricken areas. Every child deserves a healthy start in life.",
    goal: 40000,
    raised: 27500,
    daysLeft: 15,
    organizer: "Children's Health Foundation",
    location: "Multiple Regions"
  },
  {
    id: 6,
    title: "Sustainable Farming",
    image: "/events/event6.jpg",
    category: "AGRICULTURE",
    description: "Teaching sustainable farming techniques to rural communities facing climate change challenges. Building resilience through knowledge.",
    goal: 20000,
    raised: 8400,
    daysLeft: 25,
    organizer: "Sustainable Earth Coalition",
    location: "Rural Communities"
  },
  {
    id: 7,
    title: "Homeless Shelter Expansion",
    image: "/events/event7.jpg",
    category: "HOUSING",
    description: "Expanding facilities at an urban homeless shelter to accommodate more individuals and families in need of safe housing.",
    goal: 60000,
    raised: 39200,
    daysLeft: 18,
    organizer: "Urban Housing Initiative",
    location: "Metropolitan Areas"
  },
  {
    id: 8,
    title: "Refugee Support Program",
    image: "/events/event8.jpg",
    category: "HUMANITARIAN",
    description: "Providing essential services, legal support, and integration assistance to refugees seeking safety and a new beginning.",
    goal: 45000,
    raised: 21700,
    daysLeft: 22,
    organizer: "Refugee Rights Alliance",
    location: "Border Regions"
  }
];

// Categories for filtering
const categories = [
  "ALL", "ENVIRONMENT", "EDUCATION", "DISASTER", 
  "WILDLIFE", "HEALTH", "AGRICULTURE", "HOUSING", "HUMANITARIAN"
];

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("urgency");
  const [distributionActive, setDistributionActive] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    setEvents(sampleEvents);
    setFilteredEvents(sampleEvents);
    
    // Check for distributions every 5 minutes in production
    // For demo, we'll do it once on load
    handleDistributionCheck();
  }, []);
  
  // Handle distribution check for events that have reached goals or timeouts
  const handleDistributionCheck = async () => {
    if (distributionActive) return;
    
    try {
      setDistributionActive(true);
      console.log("Checking events for auto-distribution...");
      
      // Check which events need distribution and process them
      await EventDistribution.checkAndDistribute(events);
      
      // Update events to reflect distributions
      setEvents(prevEvents => {
        const updatedEvents = [...prevEvents];
        return updatedEvents;
      });
    } catch (error) {
      console.error("Error during distribution check:", error);
    } finally {
      setDistributionActive(false);
    }
  };

  // Filter events based on category and search term
  useEffect(() => {
    let filtered = [...events];
    
    // Apply category filter
    if (activeCategory !== "ALL") {
      filtered = filtered.filter(event => event.category === activeCategory);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.organizer.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    switch(sortBy) {
      case "urgency":
        filtered.sort((a, b) => a.daysLeft - b.daysLeft);
        break;
      case "progress":
        filtered.sort((a, b) => (b.raised / b.goal) - (a.raised / a.goal));
        break;
      case "amount":
        filtered.sort((a, b) => b.goal - a.goal);
        break;
      default:
        break;
    }
    
    setFilteredEvents(filtered);
  }, [events, activeCategory, searchTerm, sortBy]);

  return (
    <div className="events-page">
      <EventsNav />
      
      <div className="events-hero">
        <h1>ACTIVE <span className="highlight">DONATION CAUSES</span></h1>
        <p>Support these urgent causes with cryptocurrency for maximum transparency and impact</p>
      </div>
      
      <Container>
        {/* Filter and search section */}
        <div className="events-controls">
          <div className="category-filters">
            {categories.map(category => (
              <Button 
                key={category} 
                variant={activeCategory === category ? "primary" : "outline-primary"}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="search-sort">
            <Row className="align-items-center">
              <Col xs={12} md={7}>
                <InputGroup className="search-bar">
                  <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
                  <Form.Control
                    placeholder="Search for causes, locations, or organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col xs={12} md={5}>
                <Form.Group className="sort-by">
                  <Form.Label>Sort by:</Form.Label>
                  <Form.Select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="urgency">Most Urgent</option>
                    <option value="progress">Most Progress</option>
                    <option value="amount">Highest Goal</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>
        
        {/* Results count */}
        <div className="results-count">
          <p>Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'cause' : 'causes'}</p>
        </div>
        
        {/* Events grid */}
        <Row className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <Col key={event.id} xs={12} md={6} lg={4} className="event-column">
                <EventCard event={event} />
              </Col>
            ))
          ) : (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No matching causes found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}
        </Row>
        
        {/* Blockchain transparency note */}
        <div className="blockchain-note">
          <div className="note-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="note-content">
            <h3>Blockchain-Verified Donations</h3>
            <p>All donations are processed through our transparent blockchain system, ensuring that your contributions reach the intended recipients with complete traceability.</p>
          </div>
        </div>
      </Container>

      <footer className="events-footer">
        <Container>
          <div className="footer-content">
            <div className="footer-logo">
              <h3>CARE4CRISIS</h3>
              <p>Transparent Blockchain Donations</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Navigation</h4>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><a href="#top">Causes</a></li>
                  <li><a href="#about">About</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              <div className="link-group">
                <h4>Categories</h4>
                <ul>
                  <li><a href="#environment">Environment</a></li>
                  <li><a href="#education">Education</a></li>
                  <li><a href="#health">Healthcare</a></li>
                  <li><a href="#disaster">Disaster Relief</a></li>
                </ul>
              </div>
              <div className="link-group">
                <h4>Donate</h4>
                <ul>
                  <li><a href="#crypto">Cryptocurrency</a></li>
                  <li><a href="#upi">UPI Payment</a></li>
                  <li><a href="#bank">Bank Transfer</a></li>
                  <li><a href="#card">Card Payment</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Care4Crisis. All rights reserved.</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default EventsPage; 