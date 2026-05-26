import { Component } from "react";
import { baseURL } from "../../config";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      isLoading: false,
    };
  }

  onNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  onSubmitSignUp = async () => {
    const { loadUser, onRouteChange } = this.props;
    this.setState({ isLoading: true });
    try {
      const response = await fetch(baseURL + "register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          name: this.state.name,
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
              <legend className="f1 fw6 ph0 mh0">Sign Up</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name"
                  id="name"
                  onChange={this.onNameChange}
                />
              </div>
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
                onClick={this.onSubmitSignUp}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value={isLoading ? "Loading…" : "Sign up"}
                disabled={isLoading}
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange("signIn")}
                className="pointer f6 link dim black db"
              >
                Have an account?
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;
