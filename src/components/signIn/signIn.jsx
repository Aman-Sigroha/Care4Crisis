import { Component } from 'react';
import './signIn.css';
import apiService from '../../services/apiService';
import ApiTestComponent from '../ApiTestComponent';

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
            const credentials = {
                email: this.state.signInEmail,
                password: this.state.signInPassword
            };
            
            // Use the correct API endpoint: /api/users/login
            try {
                console.log('Trying login with correct endpoint: /api/users/login');
                const response = await fetch('https://care4crisis-api.onrender.com/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Origin': window.location.origin
                    },
                    body: JSON.stringify(credentials)
                });
                
                console.log('Login response status:', response.status);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Login successful:', data);
                    
                    // Map backend data structure to frontend expected structure
                    const userData = {
                        id: data.data.user.id,
                        name: data.data.user.name,
                        email: data.data.user.email,
                        entries: 0,
                        joined: data.data.user.createdAt || new Date().toISOString()
                    };
                    
                    // Store token in localStorage
                    if (data.data.token) {
                        localStorage.setItem('token', data.data.token);
                    }
                    
                    this.props.loadUser(userData);
                    this.props.onroutechange('home');
                    return;
                } else {
                    // Try to get error message from response
                    let errorText = 'Login failed';
                    try {
                        const errorData = await response.json();
                        errorText = errorData.message || errorText;
                    } catch (e) {
                        // If parsing JSON fails, use response status text
                        errorText = response.statusText || errorText;
                    }
                    console.error('Login failed:', errorText);
                    this.setState({ error: errorText });
                }
            } catch (fetchError) {
                console.error('Login fetch error:', fetchError);
                this.setState({ 
                    error: 'Server connection error. Please try using Demo Mode.'
                });
            }
        } catch (error) {
            console.error('Login error details:', error);
            this.setState({ error: 'Unable to connect to server. Try Demo Mode.' });
        }
    }

    directAccess = () => {
        // Direct access without authentication
        this.props.onroutechange('home');
    }

    render() {
        return (
            <>
                <div className="cyber-container signin-container">
                    <div className="corner-decoration top-left"></div>
                    <div className="corner-decoration top-right"></div>
                    <div className="corner-decoration bottom-left"></div>
                    <div className="corner-decoration bottom-right"></div>
                    
                    <h2 className="form-title">Access System</h2>
                    
                    {this.state.error && (
                        <div className="error-message" style={{
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            border: '1px solid red',
                            borderRadius: '4px',
                            padding: '10px',
                            marginBottom: '20px',
                            color: '#ff6b6b'
                        }}>
                            <strong>Login failed:</strong> {this.state.error}
                            <p style={{marginTop: '10px', fontSize: '0.9em'}}>
                                Try using the Demo Mode button below.
                            </p>
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
                    
                    <button 
                        onClick={this.directAccess} 
                        className="cyber-button direct-access-btn mt-3"
                        style={{backgroundColor: 'rgba(0, 128, 0, 0.6)', marginTop: '1rem', width: '100%'}}
                    >
                        <span className="button-text">Demo Mode</span>
                    </button>
                    
                    <div className="alt-action">
                        <p>New user?</p>
                        <button onClick={() => {this.props.onroutechange('register')}} className="text-link">
                            Register for access
                        </button>
                    </div>
                </div>
                <ApiTestComponent />
            </>
        );
    }
}

export default SignIn; 