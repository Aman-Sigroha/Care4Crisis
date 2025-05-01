import { Component } from 'react';
import './register.css';

class Register extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
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

    onSubmitRegister = () => {
        fetch('https://care4crisis-api.onrender.com/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: this.state.email, password: this.state.password, name: this.state.name})
        }).then(response => response.json())
        .then(user => {
            if (user){
                this.props.loadUser(user);
                this.props.onroutechange('home');
            }
        })
    }

    render(){
        return(
            <div className="cyber-container register-container">
                <div className="corner-decoration top-left"></div>
                <div className="corner-decoration top-right"></div>
                <div className="corner-decoration bottom-left"></div>
                <div className="corner-decoration bottom-right"></div>
                
                <h2 className="form-title">New User Registration</h2>
                
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