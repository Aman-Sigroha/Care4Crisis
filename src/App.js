import './App.css';
import Navigation from './components/navigation/nav';
import Logo1 from './components/logo/logo1';
import ImageLinkForm from './components/form/form';
import Rank from './components/rank/rank';
import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import FaceRecognition1 from './components/faceRecognition/faceRecognition1.jsx';
import SignIn from './components/signIn/signIn.jsx';
import Register from './components/register/register.jsx';

const initialState = {
  input:'',
  imageurl:'',
  box:{},
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

  findFaceLocation = (T,L,B,R) => {
    const IMAGE = document.getElementById('inputImage');
    const WIDTH = Number(IMAGE.width);
    const HEIGHT = Number(IMAGE.height);
    return{
      left : L*WIDTH + 'px',
      right : WIDTH - (R*WIDTH)  + 'px',
      top : T*HEIGHT  + 'px',
      bottom : HEIGHT - (B*HEIGHT)  + 'px'
    }
  }

  displayFaceBox = (box) => {
    this.setState({box : box});
  }

  setupclarify = (IMAGE_url) => {
      const PAT = 'edc637ba37a34f8fad6dab1cd5865476';
      const USER_ID = 'aman_sigroha';
      const APP_ID = 'test1';
      const IMAGE_URL = IMAGE_url;
      // const IMAGE_BYTES_STRING = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAoACgDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAYDBQcE/8QAMBAAAQMDAwMDAgQHAAAAAAAAAQIDBAAFEQYSIQcTMTJBURRhCBYikSNScXKhsdH/xAAZAQACAwEAAAAAAAAAAAAAAAAFBgIDBAf/xAAtEQABAwMBBgQHAQAAAAAAAAABAgMRAAQhMQUSE0FRYQaBocEUFiJCcrHR8P/aAAwDAQACEQMRAD8A3+RYY1unSYzCS0ttZUkAgktn0q5yT7jPyDUC4wdGwycH5U2Kt9ZQ7VI1qw5PkvQy3CSVPpf7aQjuKyFH25xzn3pHn3TVNy01Hl2hyy6YdkSpKsS9sl/6RlI3rRu3dxWd6spwnAGPIJTfl925fcLaoSDHXvyo6i9SlCQrU9wKln3OyWiaDN1RAbW3kKbSd7gPtwMkH/tTWy9afuy1iPfnXMAblITwkE4yf08cn3pSbYt1uts24XH6fUbiLAuY1MWyGkLEmUW0rcCRvUpQ5CtwKQCPgi4S1ZbDe4sd9NntDEe79m3uOBLTr0IR9jzodSMqUpTu9JJ8owD7UTT4ZCfv9PbP7860m+s+HBSrejWRuz2kAxoesGYxTW/Zlpkwo1vkuSly3UgKWQUhHJUvIHsAaKTemF8XE6sWmxyZkiaZrMh1jv8ArQNpUVqB8FW0njHqx4zRVVhsph1KlKk5xQ+7uHmikaSJrQerMByet2IwvtuTLa4xv2k7Rk84H9x/esHv92d01boenLXGcuiWrFIhLlpbcaQ2/JdK3VJCkAq2pAR7Zz7YxWudY9fxNIdQbNGkR5TyX4aisNNpUMFZAzkj4NK0jq9ZpbLr0PSlzkhrlZDaQlP3P8Q4/ap3F87bPucJEkx/hHv60b2TYXLrKN5sramYECSQRk9M6c6zmJ+eb5Hi22M7cnWGIQgFLbX0zSo4PDa1YBcTgDyMjJ/qbGPabH08SJt1Uzc9QqRliGg5QySPKvgc+TyfYDmmTUWpNYz7ctxoQdPQshCktupckDJUPUcJT6DwMq8YyaQ9VL0pCS8zapcq4SVOBZmPDO8/cnknlWcDBwn4NYnPjLkQ+qE9OtOVlYpeVHDCEkkkJyT+SuQzy5Y0ru6Ez511/Efa5s1fdkOtyVurIxgdlQAA9gOKKPwolU7remU5hCGYEgo38KUv9I/0TRTDYJCWQBSF4rIN/CRgAR0iTpVD1j1g/qDqJcJqlKcjB9bcda142MpOEJAzgeMnjyTSyze5KEuNRpDoDvC0oe4X9iAeaKKFK+oya6fbOqYbDTeEiAPKpHdS3gBLYc7RQkp3ApQog+cq8nwPJrljzxnPZbUfnugn/NFFRgEVch9xKsH0H8pg6e3x3T3UC1ajaZITGkJLoS4MKbOUrzz/ACKVRRRVzVwtoQmhG1NkWu0HuI+JI8u/Kv/Z';

      const raw = JSON.stringify({
          "user_app_id": {
              "user_id": USER_ID,
              "app_id": APP_ID
          },
          "inputs": [
              {
                  "data": {
                      "image": {
                          "url": IMAGE_URL
                      }
                  }
              }
          ]
      });

      const requestOptions = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Key ' + PAT
          },
          body: raw
      };

      return requestOptions;
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageurl: this.state.input});
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", this.setupclarify(this.state.input))
    .then(response => response.json())
    .then(result => {

      if (result.outputs && result.outputs.length > 0 && result.outputs[0].data && result.outputs[0].data.regions) {
        const regions = result.outputs[0].data.regions;

        if(regions.length > 0){

          fetch('https://face-detection-api-version-1.onrender.com/image',{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: this.state.user.id})
          }).then(response => response.json())
          .then(entries => {
              if (entries){
                  this.setState({ user: { ...this.state.user, entries } });
              }
          }).catch(console.log)
        regions.forEach(region => {
            // Accessing and rounding the bounding box values
            const boundingBox = region.region_info.bounding_box;
            const topRow = boundingBox.top_row.toFixed(3);
            const leftCol = boundingBox.left_col.toFixed(3);
            const bottomRow = boundingBox.bottom_row.toFixed(3);
            const rightCol = boundingBox.right_col.toFixed(3);

            region.data.concepts.forEach(concept => {
                const name = concept.name;
                const value = concept.value.toFixed(4);

                console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
                this.displayFaceBox(this.findFaceLocation(topRow,leftCol,bottomRow,rightCol))
                
            });
        });
      }  else {
        console.error("No regions found in the Clarifai API response.");
    }}else {
      console.error("Invalid or empty response from the Clarifai API.");
  }

    })
    .catch(error => console.log('error', error));
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
    const {isSignedIn, imageurl, route, box} = this.state
    return (
      <div className="App">
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
        :<><Logo1 />
        <Rank info={this.state.user}/>
        <ImageLinkForm onchange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/> {/* Corrected prop name */}
        <FaceRecognition1 imageurl={imageurl} box={box}/>
        <ParticlesBg type="cobweb" bg={true} className='particles' />
        </>)
        }
      </div>
    );
  }
}

export default App;
