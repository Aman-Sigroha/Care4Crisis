// Chatbot knowledge base with detailed responses for common questions
import { generateAIResponse, shouldUseAI, checkAIService } from '../../services/geminiService';

// Payment process descriptions
const paymentProcesses = {
  cryptocurrency: `
    Cryptocurrency Donation Process:
    1. Select a cause or use the general donation option
    2. Choose your preferred cryptocurrency (Bitcoin, Ethereum, USDT, Solana)
    3. Use your crypto wallet to scan the QR code or copy the wallet address
    4. Send the amount you wish to donate
    5. Once confirmed on the blockchain, you'll receive a transaction receipt
    6. Track your donation on our transparency page
  `,
  upi: `
    UPI Donation Process:
    1. Select a cause or use the general donation option
    2. Choose UPI as your payment method
    3. Enter the amount you wish to donate
    4. Scan the QR code or use the UPI ID
    5. Complete the payment through your UPI app
    6. Your donation will be converted to cryptocurrency for transparency
    7. You'll receive a confirmation receipt with transaction details
  `
};

// Detailed explanations about blockchain transparency
const transparencyInfo = `
  How Blockchain Transparency Works at Care4Crisis:
  
  1. Every donation is recorded as a transaction on the blockchain
  2. Each transaction contains details like amount, sender, recipient, and timestamp
  3. The transaction is verified by the blockchain network, making it immutable
  4. You can view all transactions on our transparency page
  5. When donation goals are reached or timeframes end, funds are automatically transferred to the NGO
  6. The entire process is public and verifiable through blockchain explorers
  7. We use smart contracts to ensure funds are distributed according to predefined rules
  
  This system eliminates the need for third-party verification and ensures your donation reaches the intended recipients.
`;

// Detailed cause information
const causesInfo = {
  education: `
    Our Education Initiatives:
    - School building and renovation projects
    - Scholarships for underprivileged students
    - Teacher training programs
    - Digital literacy and computer labs
    - Educational materials and resources
    
    Your donation helps provide quality education to children who would otherwise not have access to it.
  `,
  healthcare: `
    Our Healthcare Initiatives:
    - Medical camps in remote areas
    - Essential medicines and equipment
    - Primary healthcare services
    - Maternal and child health programs
    - Disease prevention and awareness
    
    Your donation helps provide essential healthcare services to communities with limited access to medical facilities.
  `,
  environment: `
    Our Environmental Initiatives:
    - Reforestation projects
    - Clean water initiatives
    - Renewable energy installations
    - Waste management solutions
    - Environmental education programs
    
    Your donation helps create sustainable solutions for environmental challenges.
  `,
  disaster: `
    Our Disaster Relief Initiatives:
    - Emergency response teams
    - Food and shelter for affected communities
    - Medical aid for disaster victims
    - Rebuilding homes and infrastructure
    - Long-term rehabilitation support
    
    Your donation helps provide immediate relief and long-term support to communities affected by natural disasters.
  `
};

// FAQ responses
const faqResponses = {
  donationTax: `
    Yes, donations to Care4Crisis are tax-deductible in most countries. After your donation, you'll receive a tax receipt that you can use for tax filing purposes. For specific tax advice, please consult with a tax professional in your region.
  `,
  donationUsage: `
    100% of your donation goes directly to the cause you choose. Our operational costs are covered through separate funding sources. When you donate to a specific cause, the funds are held in a secure wallet until the donation goal is reached or the timeframe ends, at which point they are automatically transferred to the NGO.
  `,
  donationMinimum: `
    There is no minimum donation amount. You can donate as little or as much as you wish. Every contribution helps, no matter the size.
  `,
  cryptoOptions: `
    We currently accept the following cryptocurrencies:
    - Bitcoin (BTC)
    - Ethereum (ETH)
    - USD Tether (USDT)
    - Solana (SOL)
    
    We're actively working to add more options in the future.
  `,
  ngoVerification: `
    All NGOs partnered with Care4Crisis go through a rigorous verification process. We check their legal status, financial records, past projects, and impact assessment. We also conduct regular audits to ensure that the funds are being used as intended. All this information is available on our transparency page.
  `,
  volunteerInfo: `
    You can volunteer with Care4Crisis in several ways:
    1. Become a fundraiser by creating your own campaign
    2. Offer your professional skills (tech, design, legal, etc.)
    3. Participate in our awareness programs
    4. Join local events and initiatives
    
    Visit the "Volunteer" section on our website to sign up.
  `
};

// Navigation options with descriptions and paths
export const navigationOptions = {
  home: {
    path: "/Care4Crisis/",
    description: "The main page of Care4Crisis with an overview of our mission and featured causes."
  },
  events: {
    path: "/Care4Crisis/events",
    description: "Browse all active donation causes and filter by category."
  },
  donate: {
    path: "/Care4Crisis/donate",
    description: "Make a general donation to Care4Crisis."
  },
  transparency: {
    path: "/Care4Crisis/transparency",
    description: "View all blockchain transactions and the distribution of funds."
  },
  donationSuccess: {
    path: "/Care4Crisis/donation-success",
    description: "Confirmation page after a successful donation."
  }
};

// Function to get detailed response for a specific topic
export const getDetailedResponse = async (topic, userQuery = '', conversationHistory = []) => {
  // Check if we should use AI for this query
  if (userQuery && shouldUseAI(userQuery)) {
    try {
      const aiResponse = await generateAIResponse(userQuery, conversationHistory);
      return aiResponse;
    } catch (error) {
      console.error('AI response failed, falling back to predefined response:', error);
      // Fall back to predefined response
    }
  }

  // Use predefined responses for specific topics
  switch (topic) {
    case 'crypto_payment':
      return paymentProcesses.cryptocurrency;
    case 'upi_payment':
      return paymentProcesses.upi;
    case 'transparency':
      return transparencyInfo;
    case 'education':
      return causesInfo.education;
    case 'healthcare':
      return causesInfo.healthcare;
    case 'environment':
      return causesInfo.environment;
    case 'disaster':
      return causesInfo.disaster;
    case 'donation_tax':
      return faqResponses.donationTax;
    case 'donation_usage':
      return faqResponses.donationUsage;
    case 'donation_minimum':
      return faqResponses.donationMinimum;
    case 'crypto_options':
      return faqResponses.cryptoOptions;
    case 'ngo_verification':
      return faqResponses.ngoVerification;
    case 'volunteer_info':
      return faqResponses.volunteerInfo;
    default:
      return null;
  }
};

// New function to get AI-powered response
export const getAIResponse = async (userQuery, conversationHistory = []) => {
  try {
    const aiResponse = await generateAIResponse(userQuery, conversationHistory);
    return aiResponse;
  } catch (error) {
    console.error('AI response generation failed:', error);
    return null;
  }
};

// Function to check if AI service is available
export const isAIAvailable = async () => {
  console.log('isAIAvailable called');
  try {
    if (!checkAIService) {
      console.error('checkAIService is not a function');
      return false;
    }
    // Simple test request
    const response = await checkAIService();
    return response && !response.includes("trouble") && !response.includes("difficulties");
  } catch (error) {
    console.error('AI service check failed:', error);
    return false;
  }
};

// Enhanced matching function to detect more specific queries
export const getTopicFromQuery = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Payment related
  if (/how (to|do I) (donate|pay|contribute) (using|with|via) crypto/i.test(lowerQuery)) {
    return 'crypto_payment';
  }
  
  if (/how (to|do I) (donate|pay|contribute) (using|with|via) upi/i.test(lowerQuery)) {
    return 'upi_payment';
  }
  
  // Transparency related
  if (/how (does|is|about) (the blockchain|transparency) work/i.test(lowerQuery)) {
    return 'transparency';
  }
  
  // Cause related
  if (/education (causes|initiatives|projects)/i.test(lowerQuery)) {
    return 'education';
  }
  
  if (/health(care)? (causes|initiatives|projects)/i.test(lowerQuery)) {
    return 'healthcare';
  }
  
  if (/environment(al)? (causes|initiatives|projects)/i.test(lowerQuery)) {
    return 'environment';
  }
  
  if (/disaster (relief|causes|initiatives|projects)/i.test(lowerQuery)) {
    return 'disaster';
  }
  
  // FAQ related
  if (/tax (deduction|receipt|benefit)/i.test(lowerQuery)) {
    return 'donation_tax';
  }
  
  if (/where (does|will) (my|the) (money|donation) go/i.test(lowerQuery)) {
    return 'donation_usage';
  }
  
  if (/minimum (donation|amount)/i.test(lowerQuery)) {
    return 'donation_minimum';
  }
  
  if (/(what|which) (crypto|cryptocurrency|currencies) (do you accept|can I use)/i.test(lowerQuery)) {
    return 'crypto_options';
  }
  
  if (/(how|are) (NGOs|organizations) (verified|vetted|checked)/i.test(lowerQuery)) {
    return 'ngo_verification';
  }
  
  if (/(how|can) (to|I) (volunteer|help|assist)/i.test(lowerQuery)) {
    return 'volunteer_info';
  }
  
  return null;
};

// Function to check if a query is a navigation request
export const isNavigationRequest = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Direct navigation requests
  if (/^(go|navigate|take me) to (the )?(home|main|landing) page$/i.test(lowerQuery)) {
    return { destination: 'home' };
  }
  
  if (/^(go|navigate|take me|show) to (the )?(causes|events|donations list|active causes)( page)?$/i.test(lowerQuery)) {
    return { destination: 'events' };
  }
  
  if (/^(go|navigate|take me) to (the )?(donate|donation|give money)( page)?$/i.test(lowerQuery)) {
    return { destination: 'donate' };
  }
  
  if (/^(go|navigate|take me|show) to (the )?(transparency|transactions|blockchain records)( page)?$/i.test(lowerQuery)) {
    return { destination: 'transparency' };
  }
  
  // Contextual navigation requests
  if (/^(I want to|let me|help me) (donate|make a donation|give money|contribute)$/i.test(lowerQuery)) {
    return { destination: 'donate', context: 'donation' };
  }
  
  if (/^(I want to|let me|help me|show me) (see|view|check) (causes|events|active donations)$/i.test(lowerQuery)) {
    return { destination: 'events', context: 'browsing' };
  }
  
  if (/^(I want to|let me|help me|show me) (see|view|check) (transparency|transactions|blockchain)$/i.test(lowerQuery)) {
    return { destination: 'transparency', context: 'verification' };
  }
  
  if (/^(take me|go|back) (back )?(to )?(home|main page|landing page)$/i.test(lowerQuery)) {
    return { destination: 'home', context: 'return' };
  }
  
  return null;
};

// Function to get navigation confirmation message
export const getNavigationMessage = (destination, context) => {
  const option = navigationOptions[destination];
  
  if (!option) {
    return "I'm sorry, I don't recognize that page. Would you like to go to the home page instead?";
  }
  
  switch (context) {
    case 'donation':
      return `I'll take you to the donation page where you can contribute to our causes.`;
    case 'browsing':
      return `I'll take you to the events page where you can browse all active causes.`;
    case 'verification':
      return `I'll take you to the transparency page where you can view all blockchain transactions.`;
    case 'return':
      return `Taking you back to the main page.`;
    default:
      return `I'll navigate you to the ${destination} page.`;
  }
};

// Enhanced matching function to detect donation intents
export const getDonationIntent = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Check for specific donation intents
  const amountPattern = /(\d+(\.\d+)?)\s*(eth|ethereum|bitcoin|btc|usdt|solana|sol|crypto)/i;
  const match = lowerQuery.match(amountPattern);
  
  if (match) {
    return {
      intent: 'specific_donation',
      amount: match[1],
      currency: match[3].toLowerCase(),
      cause: getCauseFromQuery(lowerQuery)
    };
  }
  
  // General donation intent
  if (/i want to donate|like to donate|can i donate/i.test(lowerQuery)) {
    return {
      intent: 'general_donation',
      cause: getCauseFromQuery(lowerQuery)
    };
  }
  
  return null;
};

// Helper to extract potential cause from query
function getCauseFromQuery(query) {
  // Check for causes in the donation query
  if (/homeless|shelter|expansion/i.test(query)) {
    return 'homeless_shelter';
  }
  if (/education|school|learning|student/i.test(query)) {
    return 'education';
  }
  if (/water|clean water|drinking/i.test(query)) {
    return 'clean_water';
  }
  if (/disaster|flood|hurricane|earthquake/i.test(query)) {
    return 'disaster_relief';
  }
  if (/wildlife|animals|conservation/i.test(query)) {
    return 'wildlife';
  }
  if (/health|healthcare|medical|hospital/i.test(query)) {
    return 'healthcare';
  }
  
  return 'general';
}

// Get donation response based on intent
export const getDonationResponse = (donationIntent) => {
  if (donationIntent.intent === 'specific_donation') {
    const amount = donationIntent.amount;
    const currency = donationIntent.currency.replace(/^(eth)$/i, 'Ethereum')
      .replace(/^(btc)$/i, 'Bitcoin')
      .replace(/^(sol)$/i, 'Solana');
    
    if (donationIntent.cause !== 'general') {
      const cause = donationIntent.cause.replace(/_/g, ' ');
      return `That's great! You'd like to donate ${amount} ${currency} to our ${cause} initiative. I can help you with that. Would you like to proceed to our donation page?`;
    } else {
      return `Thank you for wanting to donate ${amount} ${currency}! I can guide you to our donation page where you can complete this transaction and choose a specific cause. Would you like to proceed?`;
    }
  } else {
    if (donationIntent.cause !== 'general') {
      const cause = donationIntent.cause.replace(/_/g, ' ');
      return `I'm happy to help you donate to our ${cause} initiative. You can donate using cryptocurrency or UPI. Would you like to proceed to our donation page?`;
    } else {
      return `Thank you for your interest in donating! You can contribute using cryptocurrency (Bitcoin, Ethereum, USDT, Solana) or UPI. Would you like to proceed to our donation page?`;
    }
  }
};

// Info responses for specific crypto questions
export const getCryptoInfo = (query) => {
  const lowerQuery = query.toLowerCase();
  
  if (/why (should|would|do) (i|we|people) use crypto/i.test(lowerQuery) || 
      /benefits of (using|donating with) crypto/i.test(lowerQuery)) {
    return `
      Using cryptocurrency for donations offers several benefits:
      
      1. Full Transparency: Every transaction is recorded on the blockchain and can be publicly verified
      2. Lower Fees: Traditional money transfers often have high fees, while crypto typically has lower costs
      3. Global Accessibility: Funds can be sent worldwide without traditional banking restrictions
      4. Protection Against Corruption: The immutable nature of blockchain helps ensure funds reach their intended destination
      5. Direct Transfers: Funds go directly to NGOs as soon as donation goals are met, with no intermediaries
      
      Would you like to learn more about our cryptocurrency donation process?
    `;
  }
  
  if (/what (is this|about) (website|site|platform)/i.test(lowerQuery)) {
    return `
      Care4Crisis is a blockchain-based donation platform that connects donors with verified causes and NGOs. We leverage cryptocurrency technology to ensure:
      
      • Complete transparency in the donation process
      • Direct transfer of funds to verified NGOs
      • Real-time tracking of fundraising progress
      • Automatic distribution of funds when goals are met
      
      Our platform supports various causes including education, healthcare, disaster relief, and environmental conservation. You can donate using cryptocurrency or UPI.
    `;
  }
  
  return null;
}; 