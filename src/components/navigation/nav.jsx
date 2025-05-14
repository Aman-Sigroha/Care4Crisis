import './nav.css';
import { useNavigate } from 'react-router-dom';
import WalletConnector from '../common/WalletConnector';
 
const Navigation =({onroutechange, issignedin}) =>{
    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate();
    
    const handleWalletConnect = (walletType, address) => {
        console.log(`Connected to ${walletType} wallet: ${address}`);
        // You could store this in state/context if needed
    };
    
    if(issignedin){
        return(
            <nav className='cyber-nav'>
                <div className="nav-left">
                    <span className="cyber-logo">C4C</span>
                </div>
                
                <div className="nav-center">
                    {/* Center section kept empty for consistent layout */}
                </div>
                
                <div className="nav-right">
                    <WalletConnector onWalletConnect={handleWalletConnect} />
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
                <div className="nav-left">
                    <span className="cyber-logo">C4C</span>
                </div>
                <div className="nav-center">
                    {/* Empty center space for consistent layout */}
                </div>
                <div className="nav-right">
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