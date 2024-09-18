import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; // Import for Google OAuth
import { jwtDecode } from "jwt-decode"; // For decoding the Google token (optional, but recommended)
import "./Login.css";

// Helper function to get the CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const Login = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(true);

  const login_url = "http://localhost:8000/djangoapp/login"; // Your Django login API URL
  const login_url_google = "http://localhost:8000/djangoapp/accounts/google/login/token/"; // Your Django login API URL for Google

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

  // Traditional login handler
  const login = async (e) => {
    e.preventDefault();
    const csrftoken = getCookie("csrftoken");
    const res = await fetch(login_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const json = await res.json();
    if (json.status === "Authenticated") {
      sessionStorage.setItem("username", json.username);
      sessionStorage.setItem("screen_name", json.screen_name);
      setOpen(false);
    } else {
      alert("The user could not be authenticated.");
    }
  };

  if (!open) {
    window.location.href = "/";
  }

  return (
    <GoogleOAuthProvider clientId="433919242072-1tlg6pcbsdcolj0l6b236m9o36abj8lg.apps.googleusercontent.com">
      {" "}
      {/* Add GoogleOAuthProvider */}
      <div>
        <div onClick={onClose}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="modalContainer"
          >
            <form className="login_panel" style={{}} onSubmit={login}>
              <div>
                <span className="input_field">Username</span>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="input_field"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <span className="input_field">Password</span>
                <input
                  name="psw"
                  type="password"
                  placeholder="Password"
                  className="input_field"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <input className="action_button" type="submit" value="Login" />
                <input
                  className="action_button"
                  type="button"
                  value="Cancel"
                  onClick={() => setOpen(false)}
                />
              </div>
              <a className="loginlink" href="/register">
                Register Now
              </a>
            </form>

            {/* Google Sign-In Button */}
            <div className="google-login">
              <GoogleLogin
                text="signin_with"
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log("Error");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
