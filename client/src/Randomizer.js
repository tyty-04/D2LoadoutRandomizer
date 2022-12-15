import React, { Component } from "react";
import { getToken } from "./tokens";

export class Randomizer extends Component {
  constructor() {
    super();
    this.state = {
      API_KEY: process.env.REACT_APP_API_KEY,
      CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
      CLIENT_SECRET: process.env.REACT_APP_CLIENT_SECRET,
      memershipId: sessionStorage.getItem("membershipId"),
      membershipType: "",
      displayName: "",
      characters: [],
    };
    this.getAccounts = this.getAccounts.bind(this);
  }
  async getAccounts() {
    sessionStorage.setItem(
      "accessToken",
      getToken(sessionStorage.getItem("accessToken"))
    );
    const request = await fetch(
      `https://www.bungie.net/Platform/Destiny2/254/Profile/${sessionStorage.getItem(
        "membershipId"
      )}/LinkedProfiles/`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${window.btoa(
            `${sessionStorage.getItem("accessToken")}`
          )}`,
          "X-API-Key": `${this.state.API_KEY}`,
        },
      }
    );
    const response = await request.json();
    this.setState(
      {
        membershipId: response["Response"]["profiles"][0]["membershipId"],
        membershipType: response["Response"]["profiles"]["0"]["membershipType"],
        displayName: response["Response"]["profiles"][0]["displayName"],
      },
      this.getCharacters
    );
  }
  async getCharacters() {
    const request = await fetch(
      `https://www.bungie.net/Platform/Destiny2/${this.state.membershipType}/Profile/${this.state.membershipId}/?components=200`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${window.btoa(
            `${sessionStorage.getItem("accessToken")}`
          )}`,
          "X-API-Key": `${this.state.API_KEY}`,
        },
      }
    );
    const response = await request.json();
    console.log(response);
  }
  render() {
    return (
      <div>
        <h3>Randomizer</h3>
        {!(this.state.displayName.length > 0) ? (
          <button onClick={this.getAccounts}>Get Accounts</button>
        ) : (
          <h1>Welcome {this.state.displayName}</h1>
        )}
      </div>
    );
  }
}

export default Randomizer;
