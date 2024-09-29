import React from "react";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; // Import for Google OAuth
import { GoogleLogin } from "react-google-login";
import GoogleLogo from "../assets/google-logo.svg";

function LoginGoogle() {
  const login_url_google =
    "http://localhost:8000/djangoapp/accounts/google/login/token/"; // Your Django login API URL for Google

  const handleGoogleSuccess = (response) => {
    // Send the ID token to your Django backend
    fetch(login_url_google, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: response.credential,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "Authenticated") {
          console.log("Login success:", data);
          // Handle success (store token, redirect, etc.)
          sessionStorage.setItem("username", data.username);
          sessionStorage.setItem("screen_name", data.screen_name);
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  return (
    <GoogleLogin
      clientId="433919242072-1tlg6pcbsdcolj0l6b236m9o36abj8lg.apps.googleusercontent.com" // Replace with your actual Client ID
      onSuccess={handleGoogleSuccess}
      onFailure={() => console.log("error")}
      cookiePolicy={"single_host_origin"}
      render={(props) => (
        <button {...props}>
          <img
              src={GoogleLogo}
              alt="Google Logo"
            />
          {/* <i className="fab fa-google" style={iconStyle} /> */}
        </button>
      )}
    />
  );
}

export default LoginGoogle;
