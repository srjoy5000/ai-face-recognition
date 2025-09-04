import { Component } from 'react'
import Navigation from './components/navigation/Navigation'
import Logo from './components/logo/Logo'
import Rank from './components/rank/Rank'
import ImageLinkForm from './components/imagelinkform/ImageLinkForm'
import FaceRecognition from './components/facerecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import ParticlesBg from 'particles-bg'
import './App.css'

const baseURL = 'https://ai-face-recognition-api.onrender.com/'

const initState = {
  input: '',
  imgURL: '',
  bboxes: [],
  route: 'signIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = initState
  }

  loadUser = (userData) => {
    const { id, name, email, entries, joined } = userData
    this.setState({
      user: {
        id: id,
        name: name,
        email: email,
        entries: entries,
        joined: joined
      }
    })
  }

  faceLocation = (data) => {
    const regions = data.outputs[0].data.regions
    const image = document.getElementById("inputImage")
    const width = Number(image.width)
    const height = Number(image.height)

    const bboxes = regions.map(region => {
      const boundingBox = region.region_info.bounding_box

      return {
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        rightCol: width - (boundingBox.right_col * width),
        bottomRow: height - (boundingBox.bottom_row * height),
      }

      // region.data.concepts.forEach(concept => {
      //   // Accessing and rounding the concept value
      //   const name = concept.name;
      //   const value = concept.value.toFixed(4);
      // });
    })
    return bboxes
  }

  displayBBox = (bboxes) => {
    this.setState({ bboxes: bboxes })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onSubmitButton = async () => {
    this.setState({ imgURL: this.state.input })
    fetch(baseURL + 'imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(result => {
        if (result) {
          fetch(baseURL + 'image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState
                (
                  Object.assign(this.state.user, { entries: count })
                )
            })
            .catch(console.log)
        }
        this.displayBBox(this.faceLocation(result))
      })
      .catch(error => console.log('error', error));
  }

  onRouteChange = (page) => {
    if (page !== 'home') {
      this.setState(initState)
    } else if (page === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: page })
  }

  render() {
    const { isSignedIn, route, bboxes, imgURL, user } = this.state
    return (
      <div className='App'>
        <ParticlesBg color="#ffffff" type="cobweb" bg={true} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        {route === 'home'
          ? <>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onSubmitButton={this.onSubmitButton} />
            <FaceRecognition bboxes={bboxes} imgURL={imgURL} />
          </>
          : (route === 'signIn'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    )
  }
}

export default App
