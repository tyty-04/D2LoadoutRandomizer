import React from "react";

export const getToken = async () => {
  if (tokenExpired()) {
    const refreshtoken = localStorage.getItem("refreshToken");
    const token = await getValidTokenFromServer(refreshtoken);
    localStorage.setItem("accessToken", token.accessToken);
    localStorage.setItem("expirationDate", newExpirationDate());
  } else {
    console.log("tokens.js 11 | token not expired");
  }
};

const newExpirationDate = () => {
  var expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  return expiration;
};

const tokenExpired = () => {
  const now = Date.now();

  const expirationDate = localStorage.getItem("expirationDate");
  const expDate = new Date(expirationDate);

  if (now > expDate.getTime()) {
    return true; // token expired
  }

  return false; // valid token
};

const getValidTokenFromServer = async (refreshToken) => {
  // get new token from server with refresh token
  try {
    const request = await fetch(
      "https://www.bungie.net/Platform/App/OAuth/token/",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${window.btoa(
            `${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`
          )}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refreshToken: refreshToken,
        }),
      }
    );
    const token = await request.json();
    return token;
  } catch (error) {
    throw new Error("Issue getting new token", error.message);
  }
};
