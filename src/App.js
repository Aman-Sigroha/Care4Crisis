import './App.css';
import Navigation from './components/navigation/nav';
import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import SignIn from './components/signIn/signIn.jsx';
import Register from './components/register/register.jsx';
import { Helmet } from 'react-helmet';
import Home from './components/home/home.jsx';

const initialState = {
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
}};

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
    }

  loadUser = (data)=>{
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  onroutechange = (route) => {
    if(route === 'signin'){
      this.setState(initialState)
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  };

  render() {
    const {isSignedIn, route} = this.state
    return (
      <div className="App">
        <Helmet>
          <title>Care4Crisis</title>
        </Helmet>
        {route === "signin" ? (
          <>
            <Navigation
              issignedin={isSignedIn}
              onroutechange={this.onroutechange}
            />
            <SignIn
              loadUser={this.loadUser}
              onroutechange={this.onroutechange}
            />
            <ParticlesBg type="fountain" bg={true} className="particles" />
          </>
        ) : route === "register" ? (
          <>
            <Navigation
              issignedin={isSignedIn}
              onroutechange={this.onroutechange}
            />
            <Register
              loadUser={this.loadUser}
              onroutechange={this.onroutechange}
            />
            <ParticlesBg type="polygon" bg={true} className="particles" />
          </>
        ) : (
          <>
            <Home />
            
          </>
        )}
      </div>
    );
  }
}

export default App;
