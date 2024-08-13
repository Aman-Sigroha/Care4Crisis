import React, { Component } from 'react'
import './home.css'

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: 'Care4Crisis'
        }
    }
    render() {
        return (
          <div>
            <div id='1' className='image'>
                    <h1 className='logo'>{this.state.name}</h1>
            </div>
            <div id='2' className='navbar'></div>
          </div>
        );
    }
}

export default Home;