import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { getContract, donateToCampaign } from '../../services/ethereumService';
import './DonationPage.css';

const BlockchainDonation = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setLoading(true);
        const contract = await getContract();
        const campaignDetails = await contract.getCampaignDetails(campaignId);
        
        // Format campaign data
        setCampaign({
          id: campaignId,
          ngoAddress: campaignDetails[0],
          title: campaignDetails[1],
          description: campaignDetails[2],
          targetAmount: ethers.formatEther(campaignDetails[3]),
          deadline: new Date(campaignDetails[4] * 1000), // Convert Unix timestamp to Date
          amountCollected: ethers.formatEther(campaignDetails[5]),
          isComplete: campaignDetails[6],
        });
        
        setError(null);
      } catch (err) {
        console.error("Error fetching campaign details:", err);
        setError("Failed to load campaign details. Please ensure your wallet is connected to Sepolia testnet.");
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaignDetails();
    }
  }, [campaignId]);

  const handleDonate = async (e) => {
    e.preventDefault();
    setDonating(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate input
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid donation amount');
      }

      // Send donation transaction
      const txHash = await donateToCampaign(campaignId, amount);
      
      setSuccess({
        message: `Thank you for your donation of ${amount} ETH!`,
        txHash
      });
      
      setAmount('');
      
      // Redirect to campaigns list after a short delay
      setTimeout(() => {
        navigate('/campaigns');
      }, 5000);

    } catch (err) {
      console.error('Error making donation:', err);
      setError(err.message || 'Failed to process donation. Please try again.');
    } finally {
      setDonating(false);
    }
  };

  // Calculate progress percentage
  const calculateProgress = (amountCollected, targetAmount) => {
    return Math.round((parseFloat(amountCollected) / parseFloat(targetAmount)) * 100);
  };

  // Format date to readable string
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="donation-page py-5">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-3 text-light">Loading campaign details...</p>
        </div>
      </Container>
    );
  }

  if (error && !campaign) {
    return (
      <Container className="donation-page py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Campaign</Alert.Heading>
          <p>{error}</p>
          <p>
            <Button 
              variant="outline-danger" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
            {' '}
            <Button 
              variant="outline-primary" 
              onClick={() => navigate('/campaigns')}
            >
              View All Campaigns
            </Button>
          </p>
        </Alert>
      </Container>
    );
  }

  if (!campaign) {
    return (
      <Container className="donation-page py-5">
        <Alert variant="warning">
          <Alert.Heading>Campaign Not Found</Alert.Heading>
          <p>The campaign you're looking for doesn't exist or has been removed.</p>
          <Button 
            variant="outline-primary" 
            onClick={() => navigate('/campaigns')}
          >
            View All Campaigns
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="donation-page py-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="summary-card">
            <Card.Body>
              <h2 className="text-center mb-4">Donate to {campaign.title}</h2>
              
              {campaign.isComplete && (
                <Alert variant="info" className="mb-4">
                  <Alert.Heading>Campaign Complete!</Alert.Heading>
                  <p>This campaign has reached its target amount or its deadline has passed. Donations are no longer accepted.</p>
                </Alert>
              )}
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" className="mb-4">
                  {success.message}
                  <div className="mt-2">
                    <strong>Transaction Hash:</strong> {success.txHash}
                  </div>
                  <div className="mt-2">
                    Redirecting to campaigns list...
                  </div>
                </Alert>
              )}
              
              <Row>
                <Col md={6}>
                  <h3 className="mb-3">Campaign Details</h3>
                  <p className="mb-4">{campaign.description}</p>
                  
                  <div className="mb-3">
                    <strong>Target Amount:</strong> {campaign.targetAmount} ETH
                  </div>
                  
                  <div className="mb-3">
                    <strong>Amount Raised:</strong> {campaign.amountCollected} ETH
                  </div>
                  
                  <div className="mb-3">
                    <strong>Deadline:</strong> {formatDate(campaign.deadline)}
                  </div>
                  
                  <div className="mb-4">
                    <strong>NGO Address:</strong> {campaign.ngoAddress}
                  </div>
                  
                  <div className="funding-progress mb-4">
                    <div className="progress-stats">
                      <div className="progress-label">Campaign Progress:</div>
                      <div className="progress-percentage">
                        {calculateProgress(campaign.amountCollected, campaign.targetAmount)}%
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
                  </div>
                </Col>
                
                <Col md={6}>
                  <h3 className="mb-3">Make a Donation</h3>
                  
                  {campaign.isComplete ? (
                    <div className="text-center py-4">
                      <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '3rem' }}></i>
                      <h4>Campaign Complete</h4>
                      <p>Thank you for your interest in supporting this campaign.</p>
                      <Button 
                        variant="primary" 
                        onClick={() => navigate('/campaigns')}
                        className="mt-3"
                      >
                        View Other Campaigns
                      </Button>
                    </div>
                  ) : (
                    <Form onSubmit={handleDonate}>
                      <Form.Group className="mb-4">
                        <Form.Label>Donation Amount (ETH)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount in ETH"
                          disabled={donating}
                          required
                        />
                        <Form.Text className="text-muted">
                          All donations are made in ETH on the Sepolia testnet.
                        </Form.Text>
                      </Form.Group>
                      
                      <div className="blockchain-note mb-4">
                        <i className="fas fa-info-circle note-icon"></i>
                        <p>
                          Your donation will be recorded on the Ethereum blockchain and is irreversible.
                          Make sure you have enough ETH in your wallet to cover the transaction.
                        </p>
                      </div>
                      
                      <div className="d-grid gap-2">
                        <Button 
                          variant="primary" 
                          type="submit"
                          disabled={donating}
                        >
                          {donating ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Processing Donation...
                            </>
                          ) : (
                            'Donate Now'
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => navigate('/campaigns')}
                          disabled={donating}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BlockchainDonation;