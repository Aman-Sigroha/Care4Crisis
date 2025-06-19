import './volunteer.css';

const VolunteerStats = () => {
  return (
    <div className="volunteer-container">
      <div className="content-wrapper">
        <div className="grid-container">
          {/* Left side - Call to action */}
          <div className="cta-card">
            <div className="cta-content">
              <h2 className="heading">BECOME A PROUD VOLUNTEER</h2>
              <p className="description">
                When you bring together those who have, with those who have not - 
                miracles happen. Become a time hero by volunteering with us. Meet 
                new friends, gain new skills, get happiness and have fun!
              </p>
              <button className="join-button">
                JOIN WITH US
              </button>
            </div>
          </div>

          {/* Right side - Statistics */}
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                {/* User Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="stat-number">347</div>
              <div className="stat-label">Team Members</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                {/* Award Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <div className="stat-number">85+</div>
              <div className="stat-label">Winning Awards</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                {/* Heart Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <div className="stat-number">30+</div>
              <div className="stat-label">Experienced</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                {/* Smile Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <div className="stat-number">2345</div>
              <div className="stat-label">Projects Done</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerStats;