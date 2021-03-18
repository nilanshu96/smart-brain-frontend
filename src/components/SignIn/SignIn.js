import React from "react";

import "./SignIn.css";
class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem("token", token);
  };

  onEmailChanged = (event) => {
    this.setState({ email: event.target.value });
  };

  onPasswordChanged = (event) => {
    this.setState({ password: event.target.value });
  };

  onSubmitSignIn = () => {
    const { email, password } = this.state;

    fetch(`${process.env.REACT_APP_API_URL}/signin`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.userid) {
          this.saveAuthTokenInSession(data.token);
          return fetch(
            `${process.env.REACT_APP_API_URL}/profile/${data.userid}`, {
              method: "get",
              headers: {
                "Authorization": data.token
              }
            }
          );
        } else {
          return Promise.reject("Received invalid user data");
        }
      })
      .then((resp) => resp.json())
      .then((user) => {
        this.props.loadUser(user);
        this.props.onRouteChange("home");
      })
      .catch((err) => {
        throw err;
      });
  };

  render() {
    const { onRouteChange } = this.props;

    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0 nowrap">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy tl f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  onChange={this.onEmailChanged}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy tl f6" htmlFor="password">
                  Password
                </label>
                <input
                  onChange={this.onPasswordChanged}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange("register")}
                href="#0"
                className="f6 link dim black db pointer"
              >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default SignIn;
