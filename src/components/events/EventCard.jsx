import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EventCard.css';

// Import BASE_PATH constant or define it here
const BASE_PATH = '/Care4Crisis';

const EventCard = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);
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
      case 'Rapid Response Relief':
        return 'rapid-response-relief';
      case 'Children\'s Health Foundation':
        return 'childrens-health-foundation';
      case 'Wildlife Protection Society':
        return 'wildlife-protection-society';
      case 'Sustainable Earth Coalition':
        return 'sustainable-earth-coalition';
      case 'Urban Housing Initiative':
        return 'urban-housing-initiative';
      case 'Refugee Rights Alliance':
        return 'refugee-rights-alliance';
      default:
        // Create a slug from the organizer name
        return organizerName
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s]+/g, '-');
    }
  };

  // Handle NGO info button click
  const handleNgoInfoClick = () => {
    const ngoSlug = getNgoSlug(event.organizer);
    navigate(`${BASE_PATH}/ngo-info/${ngoSlug}`);
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get fallback image based on category
  const getFallbackImage = () => {
    switch(event.category) {
      case 'ENVIRONMENT':
        return 'https://images.unsplash.com/photo-1532408840957-031d8034aeef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
      case 'EDUCATION':
        return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
      case 'DISASTER':
        return 'https://images.unsplash.com/photo-1573197852243-a2abcd12eab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
      case 'WILDLIFE':
        return 'https://images.unsplash.com/photo-1557178985-891ca9b6659f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
      case 'HEALTH':
        return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
      case 'AGRICULTURE':
        return 'https://images.unsplash.com/photo-1608526728034-8fee8193e1e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
      case 'HOUSING':
        return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
      case 'HUMANITARIAN':
        return 'https://images.unsplash.com/photo-1560269507-c5e084b07f94?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
      default:
        return 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    }
  };

  return (
    <div className="event-card">
      <div className="event-image">
        <img 
          src={imageError ? getFallbackImage() : (event.image || getFallbackImage())} 
          alt={event.title} 
          onError={handleImageError}
        />
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