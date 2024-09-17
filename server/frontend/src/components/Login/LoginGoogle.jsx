import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = "433919242072-1tlg6pcbsdcolj0l6b236m9o36abj8lg.apps.googleusercontent.com";

const LoginGoogle = () => {
  const handleSuccess = (response) => {
    // Send the ID token to your Django backend
    fetch("http://localhost:8000/djangoapp/accounts/google/login/token/", {
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
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-container">
        <h2>Login with Google</h2>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginGoogle;
