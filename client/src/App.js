import React, { useState } from "react";
import Randomizer from "./Randomizer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let authCode = "";
  const API_KEY = process.env.REACT_APP_API_KEY;
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

  const createBungieAuthLink = async () => {
    window.onload = checkForCode();
    try {
      const request = await fetch(
        `https://www.bungie.net/Platform/App/OAuth/token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-API-Key": `${API_KEY}`,
            Authorization: `Basic ${window.btoa(
              `${CLIENT_ID}:${CLIENT_SECRET}`
            )}`,
          },
          body: new URLSearchParams({
            client_id: `${CLIENT_ID}`,
            grant_type: "authorization_code",
            code: `${authCode}`,
          }).toString(),
        }
      );
      const response = await request.json();
      const accessToken = response.access_token;
      const refreshToken = response.refresh_token;
      const membershipId = response.membership_id;
      const expirationDate = newExpirationDate();
      console.log("App.js 30 | expiration Date", expirationDate);
      if (accessToken && refreshToken) {
        storeTokenData(accessToken, refreshToken, membershipId, expirationDate);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log("App.js 12 | error", error);
      throw new Error("Issue with Login", error.message);
    }
  };

  const checkForCode = () => {
    if (window.location.href.includes("code")) {
      authCode = window.location.href.substring(
        window.location.href.indexOf("=") + 1
      );
    }
  };

  const newExpirationDate = () => {
    var expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    return expiration;
  };

  const storeTokenData = async (
    token,
    refreshToken,
    membershipId,
    expirationDate
  ) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("membershipId", membershipId);
    localStorage.setItem("expirationDate", expirationDate);
  };

  const signOut = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  return (
    <div className="App">
      <h1>Destiny Loadout Randomizer</h1>
      {!isLoggedIn ? (
        <a href="https://www.bungie.net/en/OAuth/Authorize?client_id=42261&response_type=code">
          <button onClick={(window.onload = createBungieAuthLink)}>
            Login
          </button>
        </a>
      ) : (
        <>
          <Randomizer />
          <button onClick={signOut}>Sign Out</button>
        </>
      )}
    </div>
  );
}

export default App;
