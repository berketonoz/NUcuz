import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "./Login.css";
import LoginApple from "./LoginApple";
import LoginFacebook from "./LoginFacebook";
import LoginGoogle from "./LoginGoogle";
import LoginTwitter from "./LoginTwitter";

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

const Login = ({ show, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(true);

  const login_url = "http://localhost:8000/djangoapp/login"; // Your Django login API URL
  console.log("Login invoked");

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
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={login}>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Row className="mt-4">
            <Col>
              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Col>
            <Col>
              <Button variant="secondary" className="w-100" onClick={onClose}>
                Cancel
              </Button>
            </Col>
          </Row>

          <div className="text-center mt-3">
            <a href="/register">Register Now</a>
          </div>
        </Form>

        <div className="mt-4">
          <p className="text-center">Or sign in with:</p>
          <Row className="justify-content-center">
            <Col md={{ span: 2 }} sm={{ span: 2 }} xs={{ span: 2 }}>
              <LoginGoogle />
            </Col>
            <Col
              xs={{ span: 2, offset: 1 }}
              sm={{ span: 2, offset: 1 }}
              md={{ span: 2, offset: 1 }}
            >
              <LoginApple />
            </Col>
            <Col
              xs={{ span: 2, offset: 1 }}
              sm={{ span: 2, offset: 1 }}
              md={{ span: 2, offset: 1 }}
            >
              <LoginFacebook />
            </Col>
            <Col
              xs={{ span: 2, offset: 1 }}
              sm={{ span: 2, offset: 1 }}
              md={{ span: 2, offset: 1 }}
            >
              <LoginTwitter />
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Login;
