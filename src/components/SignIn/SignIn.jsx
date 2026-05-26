import { Component } from "react";
import { baseURL } from "../../config";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: "",
      isLoading: false,
    };
  }

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  onSubmitSignIn = async () => {
    const { loadUser, onRouteChange } = this.props;
    this.setState({ isLoading: true });
    try {
      const response = await fetch(baseURL + "signin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.signInEmail,
          password: this.state.signInPassword,
        }),
      });
      // 1. Get the raw text instead of jumping straight to JSON
      const responseText = await response.text();

      // 2. Check if the server actually sent anything back
      if (!responseText) {
        console.error(
          "Server returned an empty response. Check your backend status code!",
        );
        return;
      }

      // 3. Check if the HTTP status is a success (200-299) before parsing
      if (!response.ok) {
        console.error(
          "Server returned an error status:",
          response.status,
          responseText,
        );
        return;
      }

      // 4. Safe to parse now
      const user = JSON.parse(responseText);
      if (user && user.id) {
        loadUser(user);
        onRouteChange("home");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { onRouteChange, isLoading } = this.props;
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value={isLoading ? "Loading…" : "Sign in"}
                disabled={isLoading}
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange("register")}
                className="pointer f6 link dim black db"
              >
                New user?
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default SignIn;
