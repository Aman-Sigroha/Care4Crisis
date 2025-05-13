import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EventCard.css';

// Import BASE_PATH constant or define it here
const BASE_PATH = '/Care4Crisis';

const EventCard = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  
  // Calculate progress percentage
  const progressPercent = Math.round((event.raised / event.goal) * 100);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Determine urgency class
  const getUrgencyClass = () => {
    if (event.daysLeft <= 5) return 'high-urgency';
    if (event.daysLeft <= 15) return 'medium-urgency';
    return 'low-urgency';
  };

  // Get NGO slug for navigation
  const getNgoSlug = (organizerName) => {
    switch(organizerName) {
      case 'WaterAid Foundation':
        return 'wateraid-foundation';
      case 'Education First NGO':
        return 'education-first-ngo';
      default:
        return 'wateraid-foundation'; // default fallback
    }
  };

  // Handle NGO info button click
  const handleNgoInfoClick = () => {
    const ngoSlug = getNgoSlug(event.organizer);
    navigate(`${BASE_PATH}/ngo-info/${ngoSlug}`);
  };

  return (
    <div className="event-card">
      <div className="event-image">
        <img src={event.image || 'https://via.placeholder.com/400x250?text=Donation+Cause'} alt={event.title} />
        <div className="event-category">{event.category}</div>
        <div className={`event-urgency ${getUrgencyClass()}`}>
          {event.daysLeft} {event.daysLeft === 1 ? 'day' : 'days'} left
        </div>
      </div>
      
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        
        <div className="event-organizer">
          <i className="fas fa-building"></i> {event.organizer}
          <Button 
            variant="link" 
            className="view-ngo-btn event-ngo-btn"
            onClick={handleNgoInfoClick}
          >
            <i className="fas fa-info-circle"></i> NGO Info
          </Button>
        </div>
        
        <div className="event-location">
          <i className="fas fa-map-marker-alt"></i> {event.location}
        </div>
        
        <p className="event-description">
          {showDetails 
            ? event.description 
            : `${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}`}
        </p>
        
        {event.description.length > 100 && (
          <button 
            className="details-toggle" 
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Show less' : 'Show more'}
          </button>
        )}
        
        <div className="event-progress">
          <div className="progress-stats">
            <div className="raised">
              <span>Raised:</span> {formatCurrency(event.raised)}
            </div>
            <div className="goal">
              <span>Goal:</span> {formatCurrency(event.goal)}
            </div>
          </div>
          
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
          
          <div className="progress-percentage">{progressPercent}% Complete</div>
        </div>
      </div>
      
      <div className="event-actions">
        <div className="action-group-left">
          <div className="blockchain-badge">
            <i className="fas fa-link"></i> Blockchain Verified
          </div>
          
          <button className="share-button">
            <i className="fas fa-share-alt"></i>
          </button>
        </div>
        
        <div className="action-group-right">
          <Link to={`${BASE_PATH}/donate/${event.id}`}>
            <Button className="donate-button" variant="primary">
              <i className="fas fa-coins"></i> Donate Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 