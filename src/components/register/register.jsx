import { Component } from 'react';
import './register.css';
import apiService from '../../services/apiService';

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
            
            // Try with the new API service first
            try {
                const response = await apiService.register({ name, email, password });
                
                console.log('Register response (new API):', response);
                
                if (response.data && response.data.data && response.data.data.user) {
                    // Map backend data structure to frontend expected structure
                    const userData = {
                        id: response.data.data.user.id,
                        name: response.data.data.user.name,
                        email: response.data.data.user.email,
                        entries: 0, // Default value
                        joined: response.data.data.user.createdAt // Map createdAt to joined
                    };
                    
                    // Store token in localStorage for authenticated requests
                    localStorage.setItem('token', response.data.data.token);
                    
                    this.props.loadUser(userData);
                    this.props.onroutechange('home');
                    return;
                }
            } catch (apiError) {
                console.log('New API registration failed, trying legacy endpoint:', apiError);
                // Continue to legacy approach if API service fails
            }
            
            // Fallback to old endpoint directly
            const response = await fetch('https://care4crisis-api.onrender.com/register', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            console.log('Register response (legacy):', data);
            
            if (data.id) {
                this.props.loadUser(data);
                this.props.onroutechange('home');
            } else {
                this.setState({ error: data.message || 'Registration failed' });
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.setState({ 
                error: error.response?.data?.message || 'Registration failed. Please try again.' 
            });
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