import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllCampaigns } from '../../services/ethereumService';
import './DonationPage.css'; // Reusing existing styles

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const campaignsData = await getAllCampaigns();
        setCampaigns(campaignsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns. Please ensure your wallet is connected to Sepolia testnet.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Calculate percentage of target reached
  const calculateProgress = (amountCollected, targetAmount) => {
    return Math.round((parseFloat(amountCollected) / parseFloat(targetAmount)) * 100);
  };

  // Format deadline to readable date
  const formatDeadline = (deadline) => {
    return new Date(deadline).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days left until deadline
  const calculateDaysLeft = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const difference = deadlineDate - now;
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Handle donation button click
  const handleDonate = (campaignId) => {
    navigate(`/donate-blockchain/${campaignId}`);
  };

  // Handle NGO info button click
  const handleNgoInfo = (ngoAddress) => {
    // This could navigate to NGO profile or show info in a modal
    console.log("View NGO info:", ngoAddress);
  };

  if (loading) {
    return (
      <Container className="donation-page py-5">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-3 text-light">Loading campaigns from blockchain...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="donation-page py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Campaigns</Alert.Heading>
          <p>{error}</p>
          <p>
            <Button 
              variant="outline-danger" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="donation-page py-5">
      <h2 className="text-center mb-5 text-light">Blockchain Donation Campaigns</h2>
      
      {campaigns.length === 0 ? (
        <Alert variant="info">
          No campaigns found. Be the first to create a campaign!
        </Alert>
      ) : (
        <Row>
          {campaigns.map((campaign) => (
            <Col md={4} className="mb-4" key={campaign.id}>
              <Card className="summary-card h-100">
                <Card.Body>
                  <span className="cause-category">{campaign.isComplete ? 'Complete' : 'Active'}</span>
                  <Card.Title>{campaign.title}</Card.Title>
                  
                  <div className="organizer">
                    <i className="fas fa-building"></i> NGO Address: 
                    <Button 
                      variant="link" 
                      className="view-ngo-btn p-0 ms-1"
                      onClick={() => handleNgoInfo(campaign.ngoAddress)}
                    >
                      {campaign.ngoAddress.slice(0, 6)}...{campaign.ngoAddress.slice(-4)}
                    </Button>
                  </div>
                  
                  <p className="cause-description">{campaign.description}</p>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <Badge bg={calculateDaysLeft(campaign.deadline) > 5 ? "info" : "warning"}>
                      {calculateDaysLeft(campaign.deadline)} days left
                    </Badge>
                    <Badge bg={campaign.isComplete ? "success" : "primary"}>
                      {campaign.isComplete ? 'Goal Reached' : 'In Progress'}
                    </Badge>
                  </div>
                  
                  <div className="funding-progress">
                    <div className="progress-stats">
                      <div className="raised">
                        <span>Raised:</span> {campaign.amountCollected} ETH
                      </div>
                      <div className="goal">
                        <span>Goal:</span> {campaign.targetAmount} ETH
                      </div>
                    </div>
                    
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${calculateProgress(campaign.amountCollected, campaign.targetAmount)}%` }}
                      >
                        <div className="progress-glow"></div>
                      </div>
                    </div>
                    
                    <div className="progress-percentage">
                      {calculateProgress(campaign.amountCollected, campaign.targetAmount)}% Complete
                    </div>
                    
                    <div className="mt-3">
                      <p className="small text-muted">
                        Donors: {campaign.donors.length} | 
                        Deadline: {formatDeadline(campaign.deadline)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={() => handleDonate(campaign.id)}
                    disabled={campaign.isComplete}
                  >
                    {campaign.isComplete ? 'Campaign Complete' : 'Donate Now'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CampaignsList; 