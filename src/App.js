import './App.css';
import Navigation from './components/navigation/nav';
import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import SignIn from './components/signIn/signIn.jsx';
import Register from './components/register/register.jsx';
import { Helmet } from 'react-helmet';

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
        <Navigation issignedin={isSignedIn} onroutechange={this.onroutechange}/>
        {route === 'signin'
        ? <>
        <SignIn loadUser={this.loadUser} onroutechange={this.onroutechange}/>
        <ParticlesBg type="fountain" bg={true} className='particles' />
        </>
        : ( route === 'register'
        ? <>
        <Register loadUser={this.loadUser} onroutechange={this.onroutechange}/>
        <ParticlesBg type="polygon" bg={true} className='particles' />
        </>
        :<>
        <ParticlesBg type="cobweb" bg={true} className='particles' />
        </>)
        }
      </div>
    );
  }
}

export default App;
