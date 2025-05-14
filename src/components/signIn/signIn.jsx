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
            const response = await apiService.login({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            });
            
            if (response.data && response.data.data.user) {
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
            } else {
                this.setState({ error: 'Invalid login response' });
            }
        } catch (error) {
            console.error('Login error:', error);
            this.setState({ 
                error: error.response?.data?.message || 'Login failed. Please check your credentials.'
            });
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