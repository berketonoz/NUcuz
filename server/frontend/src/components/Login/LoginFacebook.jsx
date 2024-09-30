import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import FacebookLogo from "../assets/facebook-logo.svg";

const FacebookLoginComponent = () => {
  const responseFacebook = (response) => {
    console.log(response);
  };

  return (
      // <FacebookLogin
      //   appId="YOUR_FACEBOOK_APP_ID" // Replace with your Facebook App ID
      //   autoLoad={false}
      //   callback={responseFacebook}
      //   fields="name,email,picture"
      //   render={(props) => (
          <button>
            <img
              src={FacebookLogo}
              alt="Facebook Logo"
            />
          </button>
      //   )}
      // />
  );
};

export default FacebookLoginComponent;
