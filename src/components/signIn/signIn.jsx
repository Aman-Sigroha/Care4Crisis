import { Component } from 'react';
import './signIn.css';
import apiService from '../../services/apiService';

class SignIn extends Component {
    constructor(props){
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: '',
            error: null
        }
    }

    onEmailChange = (event) => {
        this.setState({
            signInEmail: event.target.value
        })
    }

    onPasswordChange = (event) => {
        this.setState({
            signInPassword: event.target.value
        })
    }

    onSubmitSignIn = async () => {
        try {
            console.log('Attempting login with:', { email: this.state.signInEmail });
            
            // Try with the new API service first
            try {
                const response = await apiService.login({
                    email: this.state.signInEmail,
                    password: this.state.signInPassword
                });
                
                console.log('Login response (new API):', response);
                
                if (response.data && response.data.data && response.data.data.user) {
                    // Map backend data structure to frontend expected structure
                    const userData = {
                        id: response.data.data.user.id,
                        name: response.data.data.user.name,
                        email: response.data.data.user.email,
                        entries: 0, // Default value if not provided
                        joined: response.data.data.user.createdAt // Map createdAt to joined
                    };
                    
                    // Store token in localStorage
                    localStorage.setItem('token', response.data.data.token);
                    
                    this.props.loadUser(userData);
                    this.props.onroutechange('home');
                    return;
                }
            } catch (apiError) {
                console.log('New API login failed, trying legacy endpoint:', apiError);
                // Continue to legacy approach if API service fails
            }
            
            // Fallback to old endpoint directly
            const response = await fetch('https://care4crisis-api.onrender.com/signin', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    email: this.state.signInEmail, 
                    password: this.state.signInPassword
                })
            });
            
            const data = await response.json();
            console.log('Login response (legacy):', data);
            
            if (data.id) {
                this.props.loadUser(data);
                this.props.onroutechange('home');
            } else {
                this.setState({ error: data.message || 'Login failed' });
            }
        } catch (error) {
            console.error('Login error details:', error);
            
            // More detailed error information
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                
                // Display meaningful error based on status code
                if (error.response.status === 400) {
                    this.setState({ error: 'Invalid email or password format' });
                } else if (error.response.status === 401) {
                    this.setState({ error: 'Invalid credentials' });
                } else {
                    this.setState({ error: error.response.data?.message || 'Login failed' });
                }
            } else if (error.request) {
                // Request was made but no response received
                console.error('No response received:', error.request);
                this.setState({ error: 'Server did not respond. Please try again later.' });
            } else {
                // Something happened in setting up the request
                console.error('Error message:', error.message);
                this.setState({ error: 'Failed to connect to the server' });
            }
        }
    }

    directAccess = () => {
        // Direct access without authentication
        this.props.onroutechange('home');
    }

    render() {
        return(
            <div className="cyber-container signin-container">
                <div className="corner-decoration top-left"></div>
                <div className="corner-decoration top-right"></div>
                <div className="corner-decoration bottom-left"></div>
                <div className="corner-decoration bottom-right"></div>
                
                <h2 className="form-title">Access System</h2>
                
                {this.state.error && (
                    <div className="error-message">
                        {this.state.error}
                    </div>
                )}
                
                <div className="form-group">
                    <label htmlFor="email-address">Email ID</label>
                    <input 
                        onChange={this.onEmailChange} 
                        className="neon-input" 
                        type="email" 
                        name="email-address" 
                        id="email-address"
                        placeholder="Enter your email"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Security Key</label>
                    <input 
                        onChange={this.onPasswordChange} 
                        className="neon-input" 
                        type="password" 
                        name="password" 
                        id="password"
                        placeholder="Enter your password"
                    />
                </div>
                
                <button 
                    onClick={this.onSubmitSignIn} 
                    className="cyber-button signin-btn"
                >
                    <span className="button-text">System Login</span>
                </button>
                
                <div className="alt-action">
                    <p>New user?</p>
                    <button onClick={() => {this.props.onroutechange('register')}} className="text-link">
                        Register for access
                    </button>
                </div>
                
                <div className="direct-access">
                    <button 
                        onClick={this.directAccess} 
                        className="cyber-button direct-access-btn"
                    >
                        <i className="fas fa-rocket"></i> Direct Access
                    </button>
                    <p className="direct-note">No database connection required</p>
                </div>
            </div>
        )
    }
}

export default SignIn; 