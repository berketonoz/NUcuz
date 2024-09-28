import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const FacebookLoginComponent = () => {
  const buttonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%", // Make it circular
  };

  const iconStyle = {
    fontSize: "24px", // Adjust icon size as needed
  };

  const responseFacebook = (response) => {
    console.log(response);
  };

  return (
    <div>
      <FacebookLogin
        appId="YOUR_FACEBOOK_APP_ID" // Replace with your Facebook App ID
        autoLoad={false}
        callback={responseFacebook}
        fields="name,email,picture"
        render={(props) => (
          <button {...props} style={buttonStyle}>
            <i className="fab fa-facebook" style={iconStyle} />
          </button>
        )}
      />
    </div>
  );
};

export default FacebookLoginComponent;
