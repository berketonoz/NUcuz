import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuItem, Button } from "@mui/material";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logout = async (e) => {
    e.preventDefault();
    let logout_url = "http://localhost:8000/djangoapp/logout"; //window.location.origin + "/djangoapp/logout";
    const res = await fetch(logout_url, {
      method: "GET",
    });

    const json = await res.json();
    if (json) {
      let username = sessionStorage.getItem("username");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("screen_name");
      window.location.href = window.location.origin;
      window.location.reload();
      alert("Logging out " + username + "...");
    } else {
      alert("The user could not be logged out.");
    }
  };
  //The default home page items are the login details panel
  let home_page_items = <div></div>;

  //Gets the username in the current session
  // let curr_user = sessionStorage.getItem("username");
  let curr_user = sessionStorage.getItem("screen_name");

  //If the user is logged in, show the username and logout option on home page
  if (curr_user !== null && curr_user !== "") {
    home_page_items = (
      <>
        <li>
          <Button
            style={{
              textTransform: "none",
              color: "#FFFFFF",
              fontSize: "17.6px",
              fontFamily: "Arial, sans-serif",
            }}
            onClick={(event) => {
              setIsOpen(event.currentTarget);
            }}
          >
            {curr_user}
          </Button>
          <Menu
            anchorEl={isOpen}
            keepMounted
            open={Boolean(isOpen)}
            onClose={() => setIsOpen(false)}
          >
            <MenuItem>
              <Link to="/profile">
                <div>Profile</div>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/settings">
                <div>Settings</div>
              </Link>
            </MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </li>
      </>
    );
  } else {
    home_page_items = (
        <li>
          <Link to="/login">
            <div>Login</div>
          </Link>
        </li>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Product Search</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">
            <Button
              style={{
                textTransform: "none",
                color: "#FFFFFF",
                fontSize: "17.6px",
                fontFamily: "Arial, sans-serif",
              }}
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Home
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/products">
            <Button
              style={{
                textTransform: "none",
                color: "#FFFFFF",
                fontSize: "17.6px",
                fontFamily: "Arial, sans-serif",
              }}
              onClick={() => {
                window.location.href = "/products";
              }}
            >
              Products
            </Button>
          </Link>
        </li>
        {home_page_items}
      </ul>
    </nav>
  );
};

export default Navbar;
