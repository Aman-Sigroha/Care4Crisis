import axios from 'axios';

// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Create axios instance for Gemini API with API key in header
const geminiClient = axios.create({
  baseURL: GEMINI_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-goog-api-key': API_KEY,
  },
});

// Response interceptor for error handling
geminiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Gemini API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Context for Care4Crisis chatbot
const CARE4CRISIS_CONTEXT = `
You are Care4Crisis AI Assistant, a helpful chatbot for a blockchain-based donation platform. 

About Care4Crisis:
- We connect donors with verified causes and NGOs
- We use blockchain technology for transparency
- We accept cryptocurrency (Bitcoin, Ethereum, USDT, Solana) and UPI payments
- We support causes like education, healthcare, disaster relief, and environmental conservation
- All donations are recorded on the blockchain and can be verified
- We have a transparency page where users can view all transactions

Your role:
- Help users navigate the platform
- Explain donation processes
- Provide information about causes and transparency
- Guide users to relevant pages (donate, events, transparency, etc.)
- Be friendly, helpful, and concise
- If you don't know something specific about our platform, suggest they check our website or contact support

Keep responses conversational and under 150 words unless the user asks for detailed information.
`;

// Function to generate AI response
export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Prepare conversation context
    const conversationContext = conversationHistory
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    // Create the prompt
    const prompt = `${CARE4CRISIS_CONTEXT}

Previous conversation:
${conversationContext}

User: ${userMessage}

Assistant:`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await geminiClient.post('', requestBody);
    
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text.trim();
    } else {
      throw new Error('Invalid response format from Gemini API');
    }

  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Return fallback response based on error type
    if (error.message.includes('API key')) {
      return "I'm having trouble connecting to my AI service. Please check the API configuration.";
    } else if (error.response?.status === 429) {
      return "I'm receiving too many requests right now. Please try again in a moment.";
    } else if (error.response?.status === 403) {
      return "I don't have permission to access the AI service. Please check the API key.";
    } else {
      return "I'm experiencing technical difficulties. Please try again or contact support if the problem persists.";
    }
  }
};

// Function to check if AI service is available
export const checkAIService = async () => {
  try {
    if (!API_KEY) {
      return false;
    }
    
    // Simple test request
    const response = await generateAIResponse("Hello");
    return response && !response.includes("trouble") && !response.includes("difficulties");
  } catch (error) {
    console.error('AI service check failed:', error);
    return false;
  }
};

// Function to detect if a query should use AI
export const shouldUseAI = (query) => {
  const lowerQuery = query.toLowerCase();
  const aiTriggers = [
    'how does', 'what is', 'explain', 'tell me about', 'why', 'when', 'where',
    'can you help', 'i need help', 'i have a question', 'what are', 'how can',
    'difference between', 'compare', 'advantages', 'disadvantages', 'benefits',
    'who is', 'who are', 'president', 'prime minister', 'ceo', 'founder', 'capital of', 'country', 'city', 'famous', 'history', 'fact', 'information', 'details'
  ];
  const should = aiTriggers.some(trigger => lowerQuery.includes(trigger));
  console.log('shouldUseAI called:', query, '=>', should);
  return should;
};

export default {
  generateAIResponse,
  checkAIService,
  shouldUseAI
}; 