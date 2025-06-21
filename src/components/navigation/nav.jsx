import './nav.css';
import { useNavigate } from 'react-router-dom';
import WalletConnector from '../common/WalletConnector';
 
const Navigation =({onroutechange, issignedin, currentRoute, isWalletConnected, walletAddress, walletType, onWalletUpdate}) =>{
    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate();
    
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
                    <WalletConnector 
                        isWalletConnected={isWalletConnected}
                        walletAddress={walletAddress}
                        walletType={walletType}
                        onWalletConnect={onWalletUpdate}
                    />
                    {currentRoute.includes('/profile') ? (
                        <button 
                            onClick={() => {onroutechange('home')}} 
                            className='cyber-button profile-btn'
                        >
                            HOME
                        </button>
                    ) : (
                    <button 
                        onClick={() => {onroutechange('profile')}} 
                        className='cyber-button profile-btn'
                    >
                        PROFILE
                    </button>
                    )}
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