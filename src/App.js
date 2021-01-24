import "./App.css";
import React from "react";
import Clarifai from "clarifai";
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

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
      input: "",
      boxes: [],
      route: "signIn",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        createdAt: "",
      },
    };
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        createdAt: data.createdAt,
      },
    });
  };

  onRouteChange = (route) => {
    if (route === "signOut") {
      this.setState({ isSignedIn: false, input: '', boxes: [] });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value, boxes: [] });
  };

  onButtonClick = () => {
    clarifai.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((resp) => {
        if (resp.outputs[0].data.regions) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((resp) => resp.json())
            .then((count) => {
              this.setState({ user: { ...this.state.user, entries: count } });
            })
            .catch((err) => {
              console.log(err);
            });

          this.displayFaces(resp);
        }
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
      bottom: 100 - box.bottom_row * 100,
    };
  };

  setFaceBoxes = (regions) => {
    const boundingBoxes = regions.map((region) =>
      this.calculateBox(region.region_info.bounding_box)
    );
    this.setState({ boxes: boundingBoxes });
  };

  displayFaces = (clarifaiResp) => {
    this.setFaceBoxes(clarifaiResp.outputs[0].data.regions);
  };

  render() {
    const { user, input, boxes, route, isSignedIn } = this.state;
    let div;

    if (route === "home") {
      div = (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onButtonClick={this.onButtonClick}
            onInputChange={this.onInputChange}
          />
          <FaceRecognition imageUrl={input} boxes={boxes} />
        </div>
      );
    } else if (route === "register") {
      div = (
        <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
      );
    } else {
      div = (
        <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
      );
    }

    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {div}
      </div>
    );
  }
}

export default App;
