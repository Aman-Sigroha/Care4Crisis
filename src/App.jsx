import './App.css';
import Navigation from './components/navigation/nav';
import { Component } from 'react';
import SignIn from './components/signIn/signIn.jsx';
import Register from './components/register/register.jsx';
import { Helmet } from 'react-helmet';
import Home from './components/home/home.jsx';
import EventsPage from './components/events/EventsPage';
import DonationPage from './components/donation/DonationPage';
import DonationSuccess from './components/donation/DonationSuccess';
import TransparencyPage from './components/transparency/TransparencyPage';
import Chatbot from './components/chatbot/Chatbot';
import Profile from './components/profile/Profile.jsx';
import NGOInfoPage from './components/ngo/NGOInfoPage';
import CampaignsList from './components/donation/CampaignsList';
import CreateCampaign from './components/donation/CreateCampaign';
import BlockchainDonation from './components/donation/BlockchainDonation';
import WalletConnector from './components/common/WalletConnector';
import ConnectionTestPage from './components/ConnectionTestPage';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Base path for GitHub Pages
const BASE_PATH = '/Care4Crisis';

const initialState = {
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  },
  // Add wallet state
  isWalletConnected: false,
  walletAddress: '',
  walletType: ''
};

// Default user for direct access
const defaultUser = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com',
  entries: 5,
  joined: new Date().toISOString()
};

// Wrapper components for SignIn and Register to provide navigation
const SignInWithNavigation = (props) => {
  const navigate = useNavigate();
  
  const onRouteChange = (route) => {
    if (route === 'register') {
      navigate(`${BASE_PATH}/register`);
    } else if (route === 'home') {
      navigate(`${BASE_PATH}/home`);
      props.updateSignInStatus(true);
    }
  };
  
  return <SignIn {...props} onroutechange={onRouteChange} />;
};

const RegisterWithNavigation = (props) => {
  const navigate = useNavigate();
  
  const onRouteChange = (route) => {
    if (route === 'signin') {
      navigate(`${BASE_PATH}/signin`);
    } else if (route === 'home') {
      navigate(`${BASE_PATH}/home`);
      props.updateSignInStatus(true);
    }
  };
  
  return <Register {...props} onroutechange={onRouteChange} />;
};

// Wrapper for Navigation component
const NavigationWithRouter = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const onRouteChange = (route) => {
    if (route === 'signin') {
      // If signing out, reset auth state
      if (props.issignedin) {
        props.updateSignInStatus(false);
      }
      navigate(`${BASE_PATH}/signin`);
    } else if (route === 'register') {
      navigate(`${BASE_PATH}/register`);
    } else if (route === 'home') {
      navigate(`${BASE_PATH}/home`);
    } else if (route === 'profile') {
      navigate(`${BASE_PATH}/profile`);
    }
  };
  
  return <Navigation {...props} onroutechange={onRouteChange} currentRoute={location.pathname} />;
};

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  // New wallet connection handler
  handleWalletUpdate = (walletType, address) => {
    if (walletType && address) {
      this.setState({
        isWalletConnected: true,
        walletAddress: address,
        walletType: walletType,
      });
    } else {
      // Handle disconnection
      this.setState({
        isWalletConnected: false,
        walletAddress: '',
        walletType: '',
      });
    }
  };

  loadUser = (data)=>{
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  updateSignInStatus = (status) => {
    this.setState({isSignedIn: status});
  }

  onroutechange = (route) => {
    if(route === 'signin'){
      this.setState(initialState)
    } else if (route === 'home'){
      // If no user is loaded (direct access), use default user
      if (!this.state.user.id) {
        this.loadUser(defaultUser);
      }
      this.setState({isSignedIn: true});
    }
    this.setState({route: route})
  };

  render() {
    const {isSignedIn, isWalletConnected, walletAddress, walletType} = this.state
    
    // Login component with particles background
    const LoginComponent = () => (
      <>
        {/* <NavigationWithRouter
          issignedin={isSignedIn}
          updateSignInStatus={this.updateSignInStatus}
        /> */}
        <div className="content-container">
          <h1 className="cyberpunk-logo screen-glitch" title="CARE4CRISIS">CARE4CRISIS</h1>
          <SignInWithNavigation
            loadUser={this.loadUser}
            updateSignInStatus={this.updateSignInStatus}
          />
        </div>
        </>
    );
    
    // Register component with particles background
    const RegisterComponent = () => (
      <>
        {/* <NavigationWithRouter
          issignedin={isSignedIn}
          updateSignInStatus={this.updateSignInStatus}
        /> */}
        <div className="content-container">
          <h1 className="cyberpunk-logo">CARE4CRISIS</h1>
          <p className="neon-text">Create Your AI Crisis Management Account</p>
          <RegisterWithNavigation
            loadUser={this.loadUser}
            updateSignInStatus={this.updateSignInStatus}
          />
        </div>
        </>
    );
    
    // Navigation for all protected routes
    const ProtectedNavigation = () => (
      <NavigationWithRouter
        issignedin={isSignedIn}
        updateSignInStatus={this.updateSignInStatus}
        // Pass wallet state down
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        walletType={walletType}
        onWalletUpdate={this.handleWalletUpdate}
      />
    );
    
    const MainContent = () => (
      <Router>
        <div className="App">
          <Helmet>
            <title>Care4Crisis - AI-Powered Crisis Management</title>
            <meta name="description" content="Care4Crisis is an AI-driven platform for effective crisis management and donation tracking, ensuring transparency and efficiency in aid distribution." />
            <meta name="keywords" content="crisis management, AI, donation tracking, blockchain, transparency, disaster relief" />
          </Helmet>
          
          {/* Grid Background */}
          <div className="grid-background"></div>
          
          <Routes>
            {/* Default route - redirect to signin */}
            <Route path="/" element={<Navigate to={`${BASE_PATH}/signin`} />} />
            <Route path={`${BASE_PATH}/`} element={<Navigate to={`${BASE_PATH}/signin`} />} />
            
            {/* Authentication routes */}
            <Route path={`${BASE_PATH}/signin`} element={<LoginComponent />} />
            <Route path={`${BASE_PATH}/register`} element={<RegisterComponent />} />
            
            {/* Protected routes - only accessible after login */}
            <Route path={`${BASE_PATH}/events`} element={
              isSignedIn ? (
                <>
                  
                  <EventsPage />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            <Route path={`${BASE_PATH}/donate/:causeId`} element={
              isSignedIn ? (
                <>
                  <DonationPage 
                    isWalletConnected={isWalletConnected}
                    walletAddress={walletAddress}
                    walletType={walletType}
                    onWalletUpdate={this.handleWalletUpdate}
                  />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            <Route path={`${BASE_PATH}/donate`} element={
              isSignedIn ? (
                <>
                  <DonationPage 
                    isWalletConnected={isWalletConnected}
                    walletAddress={walletAddress}
                    walletType={walletType}
                    onWalletUpdate={this.handleWalletUpdate}
                  />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            <Route path={`${BASE_PATH}/donation-success`} element={
              isSignedIn ? (
                <>
                  <ProtectedNavigation />
                  <DonationSuccess />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            <Route path={`${BASE_PATH}/transparency`} element={
              <>
                <TransparencyPage />
                <Chatbot />
              </>
            } />
            
            <Route path={`${BASE_PATH}/about`} element={
              isSignedIn ? (
                <>
                  <ProtectedNavigation />
                  <Home userName={this.state.user.name || "User"} isSignedIn={true} showAbout={true} />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            <Route path={`${BASE_PATH}/contact`} element={
              isSignedIn ? (
                <>
                  <ProtectedNavigation />
                  <Home userName={this.state.user.name || "User"} isSignedIn={true} showContact={true} />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            <Route path={`${BASE_PATH}/home`} element={
              isSignedIn ? (
                <>
                  <ProtectedNavigation />
                  <Home userName={this.state.user.name || "User"} isSignedIn={true}/>
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            <Route path={`${BASE_PATH}/profile`} element={
              isSignedIn ? (
                <>
                  <ProtectedNavigation />
                  <Profile 
                    user={this.state.user} 
                    updateUser={(updatedUser) => this.loadUser(updatedUser)}
                  />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            <Route path={`${BASE_PATH}/ngo-info`} element={
              isSignedIn ? (
                <>
                  <ProtectedNavigation />
                  <NGOInfoPage />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            <Route path={`${BASE_PATH}/ngo-info/:ngoId`} element={
              isSignedIn ? (
                <>
                  <ProtectedNavigation />
                  <NGOInfoPage />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            {/* New blockchain routes */}
            <Route path={`${BASE_PATH}/campaigns`} element={
              isSignedIn ? (
                <>
                  <ProtectedNavigation />
                  <CampaignsList />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            <Route path={`${BASE_PATH}/create-campaign`} element={
              isSignedIn ? (
                <>
                  <ProtectedNavigation />
                  <CreateCampaign />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            <Route path={`${BASE_PATH}/donate-blockchain/:campaignId`} element={
              isSignedIn ? (
                <>
                  <ProtectedNavigation />
                  <BlockchainDonation />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            <Route path={`${BASE_PATH}/connection-test`} element={
              isSignedIn ? (
                <>
                  <ProtectedNavigation />
                  <ConnectionTestPage />
                  <Chatbot />
                </>
              ) : (
                <Navigate to={`${BASE_PATH}/signin`} />
              )
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to={`${BASE_PATH}/signin`} />} />
          </Routes>
        </div>
      </Router>
    );

    return (
      <Router>
        <div className="App">
          <Helmet>
            <title>Care4Crisis - AI-Powered Crisis Management</title>
            <meta name="description" content="Care4Crisis is an AI-driven platform for effective crisis management and donation tracking, ensuring transparency and efficiency in aid distribution." />
            <meta name="keywords" content="crisis management, AI, donation tracking, blockchain, transparency, disaster relief" />
          </Helmet>
          <MainContent />
        </div>
      </Router>
    );
  }
}

export default App; 