import { Component } from "react";
import { baseURL } from "../../config";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: "",
      isLoading: false,
      error: "",
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
    this.setState({ isLoading: true, error: "" });
    try {
      const response = await fetch(baseURL + "signin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.signInEmail,
          password: this.state.signInPassword,
        }),
      });
      if (!response.ok) {
        this.setState({ error: "Wrong email or password." });
        return;
      }
      const user = await response.json();
      if (user && user.id) {
        loadUser(user);
        onRouteChange("home");
      } else {
        this.setState({ error: "Wrong email or password." });
      }
    } catch (error) {
      console.log("error", error);
      this.setState({ error: "Network error. Please try again." });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { onRouteChange } = this.props;
    const { isLoading, error } = this.state;
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
            {error && <p className="red f6 mt2">{error}</p>}
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
