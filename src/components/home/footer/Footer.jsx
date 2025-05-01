import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Banner */}
      <div className="top-banner">
        <div className="container">
          <h2 className="banner-text">Join Our Mission to Improve a Child's Feature, Pet's Life and Our Planet.</h2>
          <button className="volunteer-btn">BECOME A VOLUNTEER</button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="main-footer">
        <div className="container footer-grid">
          {/* About Us Section */}
          <div className="footer-section">
            <h3>ABOUT US</h3>
            <p>
              We partner with over 320 amazing projects worldwide, and have given
              over $150 million in cash and product grants to other groups since 2011. We
              also operate our own dynamic suite of Signature Programs, million in cash
              and product grants to others
            </p>
            <button className="read-more">READ MORE →</button>
          </div>

          {/* Useful Links Section */}
          <div className="footer-section">
            <h3>USEFULL LINKS</h3>
            <ul className="footer-links">
              <li><a href="#">About Our Humanity</a></li>
              <li><a href="#">Recent Causes</a></li>
              <li><a href="#">Our Volunteers</a></li>
              <li><a href="#">Our Donators</a></li>
              <li><a href="#">Sponsers</a></li>
              <li><a href="#">Upcoming Events</a></li>
            </ul>
          </div>

          {/* Recent Post Section */}
          <div className="footer-section">
            <h3>RECENT POST</h3>
            <div className="recent-posts">
              <div className="post">
                <a href="#">Car show event photos 2024</a>
                <span className="date">March 14, 2024</span>
              </div>
              <div className="post">
                <a href="#">Hope Kids Holiday Party</a>
                <span className="date">February 21, 2024</span>
              </div>
              <div className="post">
                <a href="#">humanity Bikini Car wash photos</a>
                <span className="date">January 15, 2024</span>
              </div>
            </div>
          </div>

          {/* Get in Touch Section */}
          <div className="footer-section">
            <h3>GET IN TOUCH</h3>
            <div className="contact-info">
              <p>
                <strong>Address:</strong> Park Drive, Varick Str<br />
                New York, NY 10012, USA
              </p>
              <p>
                <strong>Phone:</strong> (91+) 9198700871 &<br />
                9911864571
              </p>
              <p>
                <strong>Email:</strong> care4crisis@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
