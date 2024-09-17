import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; // Import for Google OAuth
import {jwtDecode} from "jwt-decode"; // For decoding the Google token (optional, but recommended)
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
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(true);

  const login_url = "http://localhost:8000/djangoapp/login"; // Your Django login API URL

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
        userName,
        password,
      }),
    });

    const json = await res.json();
    if (json.status === "Authenticated") {
      sessionStorage.setItem("username", json.userName);
      setOpen(false);
    } else {
      alert("The user could not be authenticated.");
    }
  };

  // Google login success handler
  const handleGoogleLoginSuccess = (response) => {
    const userObject = jwtDecode(response.credential);
    console.log("Google User Info:", userObject);
    // Send token to your Django backend for verification or login
    // Example:
    // fetch("/api/google-login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-CSRFToken": csrftoken,
    //   },
    //   body: JSON.stringify({ token: response.credential }),
    // }).then((response) => {
    //   // handle response
    // });
  };

  const handleGoogleLoginFailure = (error) => {
    console.error("Google Login Failed:", error);
    alert("Google login failed. Please try again.");
  };

  if (!open) {
    window.location.href = "/";
  }

  return (
    <GoogleOAuthProvider clientId="433919242072-1tlg6pcbsdcolj0l6b236m9o36abj8lg.apps.googleusercontent.com"> {/* Add GoogleOAuthProvider */}
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
                  onChange={(e) => setUserName(e.target.value)}
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
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
