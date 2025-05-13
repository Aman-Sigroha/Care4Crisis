import './nav.css';
import { useNavigate } from 'react-router-dom';
import WalletConnector from '../common/WalletConnector';
 
const Navigation =({onroutechange, issignedin}) =>{
    const navigate = useNavigate();
    const BASE_PATH = '/Care4Crisis';
    
    const handleWalletConnect = (walletType, address) => {
        console.log(`Connected to ${walletType} wallet: ${address}`);
        // You could store this in state/context if needed
    };
    
    if(issignedin){
        return(
            <nav className='cyber-nav'>
                <div className="logo-container">
                    <span className="cyber-logo">C4C</span>
                </div>
                
                <div className="nav-center">
                    <div className="dropdown menu-dropdown">
                        <button className="cyber-button dropdown-toggle" type="button" id="donationMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            DONATIONS
                        </button>
                        <ul className="dropdown-menu bg-dark" aria-labelledby="donationMenuButton">
                            <li><button className="dropdown-item text-light" onClick={() => navigate(`${BASE_PATH}/donate`)}>Regular Donations</button></li>
                            <li><button className="dropdown-item text-light" onClick={() => navigate(`${BASE_PATH}/campaigns`)}>Blockchain Campaigns</button></li>
                            <li><button className="dropdown-item text-light" onClick={() => navigate(`${BASE_PATH}/create-campaign`)}>Create Campaign</button></li>
                        </ul>
                    </div>
                </div>
                
                <div className="nav-links">
                    <div className="wallet-connector-wrapper">
                        <WalletConnector onWalletConnect={handleWalletConnect} />
                    </div>
                    <button 
                        onClick={() => {onroutechange('profile')}} 
                        className='cyber-button profile-btn'
                    >
                        PROFILE
                    </button>
                    <button 
                        onClick={() => {onroutechange('signin')}} 
                        className='cyber-button'
                    >
                        SIGN OUT
                    </button>
                </div>
            </nav>
        )
    } else {
        return(
            <nav className='cyber-nav'>
                <div className="logo-container">
                    <span className="cyber-logo">C4C</span>
                </div>
                <div className="nav-links">
                    <button 
                        onClick={() => {onroutechange('signin')}} 
                        className='cyber-button'
                    >
                        SIGN IN
                    </button>
                    <button 
                        onClick={() => {onroutechange('register')}} 
                        className='cyber-button register-btn'
                    >
                        REGISTER
                    </button>
                </div>
            </nav>
        )
    }
}

export default Navigation;