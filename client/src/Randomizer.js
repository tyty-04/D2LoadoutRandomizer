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
      selectedClass: "",
      titanEquipped: [],
      titanInventor: [],
      hunterEquipped: [],
      hunterInventory: [],
      warlockEquipped: [],
      warlockInventory: [],
      vault: [],
    };
    this.equipItem = this.equipItem.bind(this);
  }
  async componentDidMount() {
    getToken(sessionStorage.getItem("accessToken"));
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
    getToken(sessionStorage.getItem("accessToken"));
    const request = await fetch(
      `https://www.bungie.net/Platform/Destiny2/${this.state.membershipType}/Profile/${this.state.membershipId}/?components=102,200,201,205`,
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
    const charIds = Object.keys(response["Response"]["characters"]["data"]).map(
      (x) => x
    );
    this.setState({ characters: charIds });
  }
  equipItem = async () => {
    getToken(sessionStorage.getItem("accessToken"));
    const response = await fetch(
      `https://www.bungie.net/Platform/Destiny2/Actions/Items/EquipItems/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "X-API-Key": `${this.state.API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: "6917529582624172129",
          characterId: `${this.state.characters[0]}`,
          membershipType: `${this.state.membershipType}`,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
  };
  render() {
    return (
      <div>
        <h1>Welcome {this.state.displayName}</h1>
        <button onClick={this.equipItem}>Equip</button>
      </div>
    );
  }
}

export default Randomizer;
