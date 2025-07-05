import { useState, useEffect, useRef } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';
import { 
  getDetailedResponse, 
  getTopicFromQuery, 
  isNavigationRequest, 
  getNavigationMessage,
  getDonationIntent,
  getDonationResponse,
  getCryptoInfo,
  getAIResponse,
  isAIAvailable
} from './ChatbotService';
import { shouldUseAI } from '../../services/geminiService';

// Sample chatbot responses based on user queries
const chatbotResponses = {
  greetings: [
    "Hello! I'm Care4Crisis AI assistant. How can I help you today?",
    "Hi there! I'm here to guide you through our platform. What would you like to know?",
    "Welcome to Care4Crisis! I'm your AI guide. How may I assist you?"
  ],
  donation: [
    "You can donate by clicking on the 'Donate' button at the top of the page or by selecting a specific cause from our 'Causes' section.",
    "Our platform accepts donations via cryptocurrency or UPI. Would you like me to guide you through the process?",
    "To donate, you can choose a specific cause or make a general donation. All transactions are recorded on the blockchain for transparency."
  ],
  transparency: [
    "At Care4Crisis, we use blockchain technology to ensure complete transparency. Every donation is recorded and can be verified.",
    "You can check our transparency page to see all transactions and how funds are distributed to NGOs.",
    "Our blockchain-based donation system ensures that your contribution reaches the intended recipients without any intermediaries."
  ],
  causes: [
    "We support various causes including education, healthcare, disaster relief, and environmental conservation.",
    "You can explore all our active causes by clicking on the 'Explore' button or visiting the 'Causes' section.",
    "Each cause on our platform is verified, and you can track the progress of fundraising in real-time."
  ],
  payment: [
    "We accept payments through cryptocurrency (Bitcoin, Ethereum, USDT, Solana) and UPI.",
    "Our payment process is secure and transparent. Would you like me to walk you through it?",
    "For cryptocurrency donations, you can use your wallet to transfer funds to the cause's wallet address."
  ],
  default: [
    "I'm not sure I understand. Could you please rephrase your question?",
    "I'd like to help you. Could you provide more details about what you're looking for?",
    "I'm still learning! Can you ask your question differently or choose from topics like donation, causes, or transparency?"
  ]
};

// Helper function to match user input to response categories
const matchUserInput = (input) => {
  const lowercaseInput = input.toLowerCase();
  
  if (/hi|hello|hey|greetings/i.test(lowercaseInput)) {
    return 'greetings';
  } else if (/donate|donation|contribute|give money|support/i.test(lowercaseInput)) {
    return 'donation';
  } else if (/transparency|blockchain|verify|track|transaction/i.test(lowercaseInput)) {
    return 'transparency';
  } else if (/causes|projects|initiatives|help|support|events/i.test(lowercaseInput)) {
    return 'causes';
  } else if (/payment|pay|crypto|cryptocurrency|bitcoin|eth|upi/i.test(lowercaseInput)) {
    return 'payment';
  }
  
  return 'default';
};

// Get random response from category
const getRandomResponse = (category) => {
  const responses = chatbotResponses[category] || chatbotResponses.default;
  return responses[Math.floor(Math.random() * responses.length)];
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm here to help you navigate Care4Crisis. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isAIAvailable, setIsAIAvailable] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  
  // Scroll to bottom of chat when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Safely initialize chatbot
  useEffect(() => {
    try {
      setIsLoaded(true);
      
      // Check AI availability
      const checkAI = async () => {
        try {
          const aiAvailable = await isAIAvailable();
          setIsAIAvailable(aiAvailable);
        } catch (error) {
          console.error('Error checking AI availability:', error);
          setIsAIAvailable(false);
        }
      };
      
      checkAI();
      
      // Only set welcome message if none exists
      if (messages.length === 0) {
        const timer = setTimeout(() => {
          try {
            setMessages([
              { 
                text: getRandomResponse('greetings'),
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          } catch (err) {
            console.error("Error initializing chatbot:", err);
            setHasError(true);
          }
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    } catch (err) {
      console.error("Error in chatbot initialization:", err);
      setHasError(true);
    }
  }, []);
  
  // Handle navigation to another page
  const handleNavigation = (destination) => {
    // Disable input while navigating
    setIsInputDisabled(true);
    
    // Store current route to re-focus input after navigation
    const currentRoute = window.location.pathname;
    
    switch (destination) {
      case 'home':
        navigate('/Care4Crisis/');
        break;
      case 'events':
        navigate('/Care4Crisis/events');
        break;
      case 'donate':
        navigate('/Care4Crisis/donate');
        break;
      case 'about':
        navigate('/Care4Crisis/about');
        break;
      case 'transparency':
        navigate('/Care4Crisis/transparency');
        break;
      case 'contact':
        navigate('/Care4Crisis/contact');
        break;
      default:
        // Handle unknown pages
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: `I'm sorry, I'm not familiar with the ${destination} page. Let me take you to the home page instead.`,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          setTimeout(() => navigate('/Care4Crisis/'), 1500);
        }, 1000);
    }
    
    // Re-enable input after route change and focus on input
    setTimeout(() => {
      setIsInputDisabled(false);
      // Focus on input if we're on the same route
      if (currentRoute === window.location.pathname && inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  };
  
  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!input.trim() && !e.currentTarget?.value) return;
    
    try {
      // Store the current input and clear the input field immediately
      const currentInput = e.currentTarget?.value || input.trim();
      setInput('');
      
      // Handle pending navigation confirmation
      if (pendingNavigation && 
         (currentInput.toLowerCase().includes('yes') || 
          currentInput.toLowerCase().includes('sure') ||
          currentInput.toLowerCase().includes('ok') ||
          currentInput.toLowerCase().includes('confirm'))) {
        
        const userMessage = {
          text: currentInput,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        // Handle navigation
        handleNavigation(pendingNavigation);
        setPendingNavigation(null);
        // Make sure input is re-enabled
        setIsInputDisabled(false);
        return;
      } else if (pendingNavigation && 
                (currentInput.toLowerCase().includes('no') || 
                 currentInput.toLowerCase().includes('cancel') ||
                 currentInput.toLowerCase().includes('stop'))) {
        
        const userMessage = {
          text: currentInput,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, userMessage]);
        setPendingNavigation(null);
        
        // Ensure input is re-enabled
        setIsInputDisabled(false);
        
        // Respond that navigation was cancelled
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: "Navigation cancelled. Is there anything else I can help with?",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 500);
        
        return;
      }
      
      // Regular message flow
      const userMessage = {
        text: currentInput,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      
      // Check for navigation request
      const navRequest = isNavigationRequest(currentInput);
      
      if (navRequest) {
        // Check if we're already in a navigation confirmation
        if (pendingNavigation) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: "I see you're trying to navigate somewhere else. Let's focus on one navigation at a time. Would you still like to proceed to the " + pendingNavigation + " page?",
              sender: 'bot',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setIsTyping(false);
          }, 1000);
          return;
        }
        
        const destinationToNavigate = navRequest.destination;
        
        setTimeout(() => {
          const navMessage = getNavigationMessage(destinationToNavigate, navRequest.context);
          
          // Add confirmation message
          setMessages(prev => [...prev, {
            text: `${navMessage} Would you like to proceed?`,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isNavigation: true
          }]);
          
          // Set pending navigation
          setPendingNavigation(destinationToNavigate);
          setIsTyping(false);
        }, 1000);
        return;
      }
      
      // Check for donation intent
      const donationIntent = getDonationIntent(currentInput);
      
      if (donationIntent) {
        setTimeout(() => {
          const responseText = getDonationResponse(donationIntent);
          
          // Add donation response with navigation option
          setMessages(prev => [...prev, {
            text: responseText,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isNavigation: true,
            isDonation: true
          }]);
          
          // Set pending navigation to donation page
          setPendingNavigation('donate');
          setIsTyping(false);
        }, 1000);
        return;
      }
      
      // Check for crypto info request
      const cryptoInfo = getCryptoInfo(currentInput);
      
      if (cryptoInfo) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: cryptoInfo,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCryptoInfo: true
          }]);
          setIsTyping(false);
          // Make sure input field is always enabled
          setIsInputDisabled(false);
        }, 1000);
        return;
      }
      
      // Check for detailed topic or regular response
      const specificTopic = getTopicFromQuery(currentInput);
      
      // Simulate bot "typing"
      setTimeout(async () => {
        try {
          let botResponse;
          
          // Try AI response first if available and query is complex
          if (isAIAvailable && shouldUseAI(currentInput)) {
            try {
              const aiResponse = await getAIResponse(currentInput, messages);
              if (aiResponse) {
                botResponse = {
                  text: aiResponse,
                  sender: 'bot',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isAIResponse: true
                };
              }
            } catch (aiError) {
              console.error('AI response failed, falling back to predefined response:', aiError);
            }
          }
          
          // If no AI response, use predefined responses
          if (!botResponse) {
            if (specificTopic) {
              // Use detailed response if available
              const detailedText = await getDetailedResponse(specificTopic, currentInput, messages);
              botResponse = {
                text: detailedText,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
            } else {
              // Fall back to general response
              const responseCategory = matchUserInput(currentInput);
              botResponse = {
                text: getRandomResponse(responseCategory),
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
            }
          }
          
          setMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
          // Make sure input is re-enabled after typing finishes
          setIsInputDisabled(false);
        } catch (err) {
          console.error("Error generating bot response:", err);
          setIsTyping(false);
          // Make sure input is re-enabled even if there's an error
          setIsInputDisabled(false);
          
          // Provide fallback response
          setMessages(prev => [...prev, {
            text: "I'm having trouble processing your request. Please try again later.",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      }, 1000 + Math.random() * 1000);
    } catch (err) {
      console.error("Error in message handling:", err);
      // Make sure input is re-enabled if an error occurs
      setIsInputDisabled(false);
    }
  };
  
  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };
  
  // Handle quick action button clicks
  const handleQuickAction = (destination, messageText) => {
    setPendingNavigation(destination);
    // Temporarily disable input while showing navigation confirmation
    setIsInputDisabled(true);
    
    setMessages(prev => [...prev, {
      text: messageText,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isNavigation: true,
      isDonation: destination === 'donate'
    }]);
    
    // Re-enable input after navigation message is shown and focus on it
    setTimeout(() => {
      setIsInputDisabled(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  };
  
  // If chatbot failed to load, render minimal version
  if (hasError) {
    return (
      <div className="chatbot-container">
        <Button 
          className="chatbot-toggle-btn" 
          onClick={() => window.location.reload()}
          variant="primary"
        >
          <i className="fas fa-sync"></i>
        </Button>
      </div>
    );
  }
  
  // Only render the full chatbot if successfully loaded
  if (!isLoaded) {
    return null;
  }
  
  return (
    <div className="chatbot-wrapper">
      <Button 
        className="chatbot-toggle-button"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <span className="robot-icon">🤖</span>
      </Button>

      {isOpen && (
        <div className="chatbot-container">
          <Card className="chatbot-card">
            <Card.Header className="chatbot-header">
              <div className="chatbot-icon-container">
                <div className="robot-head-icon" />
              </div>
              <span className="chatbot-title">Care4Crisis Assistant</span>
              <Button 
                variant="link" 
                className="close-button" 
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <span className="close-icon">×</span>
              </Button>
            </Card.Header>
            
            <Card.Body className="chatbot-body">
              <div ref={messagesEndRef} className="messages-container">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'} ${message.isDonation ? 'donation-theme' : ''}`}
                  >
                    <div className="message-content">
                      {message.text}
                      {message.isNavigation && pendingNavigation && (
                        <div className="navigation-buttons mt-2">
                          <Button 
                            onClick={() => {
                              const userMessage = {
                                text: 'Yes',
                                sender: 'user',
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              };
                              setMessages(prev => [...prev, userMessage]);
                              handleNavigation(pendingNavigation);
                              setPendingNavigation(null);
                              
                              // Focus on input after navigation with a slight delay
                              setTimeout(() => {
                                if (inputRef.current) {
                                  inputRef.current.focus();
                                }
                              }, 800);
                            }}
                            variant="primary" 
                            size="sm"
                            className="me-2"
                          >
                            Yes
                          </Button>
                          <Button 
                            onClick={() => {
                              const userMessage = {
                                text: 'No',
                                sender: 'user',
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              };
                              setMessages(prev => [...prev, userMessage]);
                              setPendingNavigation(null);
                              setIsInputDisabled(false);
                              
                              // Focus on the input field after a slight delay
                              if (inputRef.current) {
                                setTimeout(() => inputRef.current.focus(), 100);
                              }
                              
                              // Respond that navigation was cancelled
                              setTimeout(() => {
                                setMessages(prev => [...prev, {
                                  text: "Navigation cancelled. Is there anything else I can help with?",
                                  sender: 'bot',
                                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                }]);
                              }, 500);
                            }}
                            variant="outline-secondary" 
                            size="sm"
                          >
                            No
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="message-timestamp">{message.timestamp}</div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message bot-message">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
            
            <Card.Footer className="chatbot-footer">
              <div className="quick-actions">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2 mb-1 btn-donate"
                  onClick={() => handleQuickAction('donate', 
                    "Would you like to navigate to the donation page where you can contribute to various causes using cryptocurrency or UPI?"
                  )}
                >
                  Donate Now
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2 mb-1"
                  onClick={() => handleQuickAction('transparency',
                    "Would you like to navigate to our transparency page to see how we ensure that all donations reach their intended causes?"
                  )}
                >
                  Transparency
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="mb-1"
                  onClick={() => handleQuickAction('events',
                    "Would you like to navigate to our events page to see all active donation campaigns?"
                  )}
                >
                  View Events
                </Button>
              </div>
              
              <Form onSubmit={handleSendMessage}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isInputDisabled}
                    ref={inputRef}
                  />
                  <Button type="submit" variant="primary" disabled={!input.trim() || isInputDisabled}>
                    Send
                  </Button>
                </InputGroup>
              </Form>
            </Card.Footer>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Chatbot; 