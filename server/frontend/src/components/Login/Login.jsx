import React, { useState } from "react";

import "./Login.css";

// Helper function to get the CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
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

  let login_url = "http://localhost:8000/djangoapp/login"; //window.location.origin + "/djangoapp/login";

  const login = async (e) => {
    e.preventDefault();

    // Get CSRF token from the cookie
    const csrftoken = getCookie("csrftoken");

    const res = await fetch(login_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken, // Include the CSRF token here
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
      }),
    });

    const json = await res.json();
    if (json.status != null && json.status === "Authenticated") {
      sessionStorage.setItem("username", json.userName);
      setOpen(false);
    } else {
      alert("The user could not be authenticated.");
    }
  };

  if (!open) {
    window.location.href = "/";
  }

  return (
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
              <span className="input_field">Username </span>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input_field"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <span className="input_field">Password </span>
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
        </div>
      </div>
    </div>
  );
};

export default Login;
