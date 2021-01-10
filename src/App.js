import "./App.css";
import React from "react";
import Clarifai from "clarifai";
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";

//this is currently deprecated for web apps. look for changes in future.
const clarifai = new Clarifai.App({
  apiKey: "***REMOVED***",
});

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      input: '',
      boxes: []
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonClick = () => {
    clarifai.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
      )
      .then((resp) => {
        this.displayFaces(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  calculateBox = (box) => {
    return {
      top: box.top_row * 100,
      right: 100 - box.right_col * 100,
      left: box.left_col * 100,
      bottom: 100 - box.bottom_row * 100
    }
  }

  setFaceBoxes = (regions) => {
    const boundingBoxes = regions.map(region => this.calculateBox(region.region_info.bounding_box));
    console.log(boundingBoxes);
    this.setState({boxes: boundingBoxes});
  }

  displayFaces = (clarifaiResp) => {
    this.setFaceBoxes(clarifaiResp.outputs[0].data.regions);
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onButtonClick={this.onButtonClick} onInputChange={this.onInputChange} />
        <FaceRecognition imageUrl={this.state.input} boxes={this.state.boxes}/>
      </div>
    );
  }
}

export default App;
