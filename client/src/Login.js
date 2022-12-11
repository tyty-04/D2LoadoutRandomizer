import React, { Component } from "react";

export class Login extends Component {
  constructor() {
    super();
    this.state = {
      authCode: "",
      loginInfo: "",
      accessToken: "",
      refreshToken: "",
      bungieClientId: "42261",
      bungieClientSecret: "faLWYMy8zJvK4AJW0xxz2SY8QVhVXC6UVShmbrjqMeU",
    };
  }
  componentDidMount() {
    if (window.location.href.includes("code")) {
      this.handleLogin();
    }
  }
  handleLogin() {
    this.setState({
      authCode: window.location.href.substring(
        window.location.href.indexOf("=") + 1
      ),
    });
    const x = window.btoa("42261" + ":" + `${this.state.authCode}`);
    fetch(
      `https://www.bungie.net/Platform/App/OAuth/Token/?grant_type=authorization_code&client_id=42261&code=${this.state.authCode}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-API-Key": "88a947a3eda54127812b8a3a60dad11f",
          Authorization: "Basic " + x,
        },
        form: {
          grant_type: "authorization_code",
          client_id: "42261",
          code: `${this.state.authCode}`,
        },
      }
    ).then(function (response) {
      this.setState({ loginInfo: response });
    });
  }
  render() {
    return (
      <div>
        <a href="https://www.bungie.net/en/OAuth/Authorize?client_id=42261&response_type=code">
          <button>Login</button>
        </a>
        <p>{this.state.authCode}</p>
        <p>{this.state.loginInfo}</p>
      </div>
    );
  }
}

export default Login;
