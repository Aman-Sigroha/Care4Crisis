import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createCampaign } from '../../services/ethereumService';
import './DonationPage.css';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '', // YYYY-MM-DD format
    ngoAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form data
      if (!formData.title || !formData.description || !formData.targetAmount || !formData.deadline || !formData.ngoAddress) {
        throw new Error('All fields are required');
      }

      // Validate that deadline is in the future
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        throw new Error('Deadline must be in the future');
      }

      // Validate target amount is a positive number
      if (isNaN(formData.targetAmount) || parseFloat(formData.targetAmount) <= 0) {
        throw new Error('Target amount must be a positive number');
      }

      // Validate NGO address format (basic Ethereum address validation)
      if (!/^0x[a-fA-F0-9]{40}$/.test(formData.ngoAddress)) {
        throw new Error('Invalid Ethereum address format');
      }

      // Create campaign on the blockchain
      const txHash = await createCampaign(
        formData.ngoAddress,
        formData.title,
        formData.description,
        formData.targetAmount,
        deadlineDate
      );

      setSuccess({
        message: 'Campaign created successfully!',
        txHash
      });

      // Reset form after success
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        deadline: '',
        ngoAddress: ''
      });

      // Redirect to campaigns list after a short delay
      setTimeout(() => {
        navigate('/campaigns');
      }, 5000);

    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err.message || 'Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="donation-page py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="summary-card">
            <Card.Body>
              <h2 className="text-center mb-4">Create Donation Campaign</h2>
              
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
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Campaign Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter campaign title"
                    disabled={loading}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the purpose of this campaign"
                    disabled={loading}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Target Amount (ETH)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    placeholder="Enter target amount in ETH"
                    disabled={loading}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Deadline</Form.Label>
                  <Form.Control
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]} // Today's date
                    disabled={loading}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>NGO Wallet Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="ngoAddress"
                    value={formData.ngoAddress}
                    onChange={handleChange}
                    placeholder="Enter the Ethereum address to receive funds"
                    disabled={loading}
                    required
                  />
                  <Form.Text className="text-muted">
                    This address will receive the funds when the campaign is complete.
                  </Form.Text>
                </Form.Group>
                
                <div className="blockchain-note mb-4">
                  <i className="fas fa-info-circle note-icon"></i>
                  <p>
                    This campaign will be created on the Ethereum Sepolia testnet.
                    All donations and funds release will be transparent and verifiable on the blockchain.
                  </p>
                </div>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Creating Campaign...
                      </>
                    ) : (
                      'Create Campaign'
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/campaigns')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateCampaign; 