import './nav.css';
 
const Navigation =({onroutechange, issignedin}) =>{
    if(issignedin){
        return(
            <nav className='cyber-nav'>
                <div className="logo-container">
                    <span className="cyber-logo">C4C</span>
                </div>
                <div className="nav-links">
                    <button 
                        onClick={() => {onroutechange('profile')}} 
                        className='cyber-button profile-btn'
                    >
                        Profile
                    </button>
                    <button 
                        onClick={() => {onroutechange('signin')}} 
                        className='cyber-button'
                    >
                        Sign Out
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
                        Sign In
                    </button>
                    <button 
                        onClick={() => {onroutechange('register')}} 
                        className='cyber-button register-btn'
                    >
                        Register
                    </button>
                </div>
            </nav>
        )
    }
}

export default Navigation;