import { Component } from 'react';
import './register.css';

class Register extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            error: null
        }
    }

    onNameChange = (event) => {
        this.setState({
            name: event.target.value
        })
    }

    onEmailChange = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    onPasswordChange = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    onSubmitRegister = async () => {
        try {
            const { name, email, password } = this.state;
            
            console.log('Attempting registration with:', { email, name });
            
            // Use the correct API endpoint: /api/users/register
            try {
                console.log('Trying registration with correct endpoint: /api/users/register');
                const response = await fetch('https://care4crisis-api.onrender.com/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Origin': window.location.origin
                    },
                    body: JSON.stringify({ name, email, password })
                });
                
                console.log('Registration response status:', response.status);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Registration successful:', data);
                    
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
                    let errorText = 'Registration failed';
                    try {
                        const errorData = await response.json();
                        errorText = errorData.message || errorText;
                    } catch (e) {
                        // If parsing JSON fails, use response status text
                        errorText = response.statusText || errorText;
                    }
                    console.error('Registration failed:', errorText);
                    this.setState({ error: errorText });
                }
            } catch (fetchError) {
                console.error('Registration fetch error:', fetchError);
                this.setState({ 
                    error: 'Server connection error. Please try using Demo Mode.'
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.setState({ error: 'Unable to connect to server. Try Demo Mode.' });
        }
    }

    render(){
        return(
            <div className="cyber-container register-container">
                <div className="corner-decoration top-left"></div>
                <div className="corner-decoration top-right"></div>
                <div className="corner-decoration bottom-left"></div>
                <div className="corner-decoration bottom-right"></div>
                
                <h2 className="form-title">New User Registration</h2>
                
                {this.state.error && (
                    <div className="error-message">
                        {this.state.error}
                    </div>
                )}
                
                <div className="form-group">
                    <label htmlFor="name">Full Identity</label>
                    <input 
                        onChange={this.onNameChange} 
                        className="neon-input" 
                        type="text" 
                        name="name" 
                        id="name"
                        placeholder="Enter your name"
                    />
                </div>
                
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
                        placeholder="Create a password"
                    />
                </div>
                
                <button 
                    onClick={this.onSubmitRegister} 
                    className="cyber-button register-btn"
                >
                    <span className="button-text">Create Account</span>
                </button>
                
                <div className="alt-action">
                    <p>Already registered?</p>
                    <button onClick={() => {this.props.onroutechange('signin')}} className="text-link">
                        Back to login
                    </button>
                </div>
            </div>
        )
    }
}

export default Register; 