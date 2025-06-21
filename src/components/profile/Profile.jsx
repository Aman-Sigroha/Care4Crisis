import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import './Profile.css';

const Profile = ({ user, updateUser, onroutechange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Calculate the date the user joined
  const joinDate = new Date(user.joined).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // In a real app, you would send a PUT/PATCH request to your backend
      // For now, we'll just update the local state
      updateUser(editedUser);
      setIsEditing(false);
      setShowSuccessAlert(true);
      
      // Hide the success alert after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setShowErrorAlert(true);
      
      // Hide the error alert after 3 seconds
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
    }
  };

  return (
    <Container className="profile-container">
      <Button 
        className="back-button"
        onClick={() => onroutechange('home')}
      >
        <i className="fas fa-arrow-left"></i>
      </Button>

      {showSuccessAlert && (
        <Alert variant="success" className="mb-4 cyber-alert">
          Profile updated successfully!
        </Alert>
      )}
      
      {showErrorAlert && (
        <Alert variant="danger" className="mb-4 cyber-alert">
          Failed to update profile. Please try again.
        </Alert>
      )}
      
      <Row className="g-4">
        <Col md={4}>
          <Card className="profile-sidebar cyber-card">
            <div className="text-center mb-4">
              <div className="profile-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="mt-3 neon-text">{user.name}</h3>
              <p className="text-muted">Member since {joinDate}</p>
            </div>
            
            <Row className="profile-stats w-100">
              <Col xs={6} className="stat-item">
                <span className="stat-value">{user.entries || 0}</span>
                <span className="stat-label">Donations</span>
              </Col>
              <Col xs={6} className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">Causes</span>
              </Col>
            </Row>
            
            {!isEditing && (
              <Button 
                variant="primary" 
                className="cyber-button w-100 mt-4"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="profile-details cyber-card mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h2 className="neon-text mb-0">{isEditing ? 'Edit Profile' : 'Profile Details'}</h2>
              {isEditing && (
                <Button 
                  variant="outline-secondary" 
                  className="btn-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUser({ ...user });
                  }}
                >
                  Cancel
                </Button>
              )}
            </Card.Header>
            
            <Card.Body>
              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="cyber-label">Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editedUser.name}
                      onChange={handleChange}
                      className="cyber-input"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="cyber-label">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleChange}
                      className="cyber-input"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="cyber-label">Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="bio"
                      value={editedUser.bio || ''}
                      onChange={handleChange}
                      className="cyber-input"
                      rows={3}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="cyber-label">Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={editedUser.location || ''}
                      onChange={handleChange}
                      className="cyber-input"
                    />
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="cyber-button"
                    >
                      Save Changes
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="profile-info">
                  <div className="info-item">
                    <h4 className="info-label">Full Name</h4>
                    <p className="info-value">{user.name}</p>
                  </div>
                  
                  <div className="info-item">
                    <h4 className="info-label">Email</h4>
                    <p className="info-value">{user.email}</p>
                  </div>
                  
                  <div className="info-item">
                    <h4 className="info-label">Bio</h4>
                    <p className="info-value">{user.bio || 'No bio added yet.'}</p>
                  </div>
                  
                  <div className="info-item">
                    <h4 className="info-label">Location</h4>
                    <p className="info-value">{user.location || 'Not specified'}</p>
                  </div>
                  
                  <div className="info-item">
                    <h4 className="info-label">Member Since</h4>
                    <p className="info-value">{joinDate}</p>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
          
          <Card className="cyber-card">
            <Card.Header>
              <h3 className="neon-text mb-0">Activity</h3>
            </Card.Header>
            <Card.Body className="recent-activity">
              <p className="text-center py-3">No recent activity yet.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 