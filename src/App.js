import "./App.css";
import React from "react";
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import Modal from "./components/Modal/Modal";
import Profile from "./components/Profile/Profile";

//this is currently deprecated for web apps. look for changes in future.
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

const initialState = {
  input: "",
  boxes: [],
  route: "signIn",
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    createdAt: "",
  },
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      ...initialState,
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
      return this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value, boxes: [] });
  };

  onButtonClick = () => {
    fetch(`${process.env.REACT_APP_API_URL}/imageurl`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageurl: this.state.input,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (Array.isArray(data)) {
          fetch(`${process.env.REACT_APP_API_URL}/image`, {
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

          this.displayFaces(data);
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

  displayFaces = (regions) => {
    const boundingBoxes = regions.map((region) =>
      this.calculateBox(region.region_info.bounding_box)
    );
    this.setState({ boxes: boundingBoxes });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen,
    }));
  };

  render() {
    const { user, input, boxes, route, isSignedIn, isProfileOpen } = this.state;
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
          toggleModal={this.toggleModal}
        />
        {isProfileOpen && (
          <Modal>
            <Profile
              isProfileOpen={isProfileOpen}
              toggleModal={this.toggleModal}
            />
          </Modal>
        )}
        {div}
      </div>
    );
  }
}

export default App;
